import _ from 'lodash';
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import Link from 'react-router-dom/Link';
import {
  FormattedTime,
  FormattedMessage,
} from 'react-intl';
import {
  Pane,
  PaneMenu,
  Row,
  Col,
  Accordion,
  ExpandAllButton,
  KeyValue,
  Layer,
  IconButton,
  MultiColumnList,
  AppIcon,
  Button,
  Icon,
} from '@folio/stripes/components';

import { ViewMetaData } from '@folio/stripes/smart-components';

import { craftLayerUrl } from './utils';

import ItemForm from './edit/items/ItemForm';

class ViewItem extends React.Component {
  static manifest = Object.freeze({
    query: {},
    items: {
      type: 'okapi',
      path: 'inventory/items/:{itemid}',
      POST: {
        path: 'inventory/items',
      },
    },
    holdingsRecords: {
      type: 'okapi',
      path: 'holdings-storage/holdings/:{holdingsrecordid}',
    },
    instances1: {
      type: 'okapi',
      path: 'inventory/instances/:{id}',
    },
    materialTypes: {
      type: 'okapi',
      path: 'material-types',
      records: 'mtypes',
    },
    loanTypes: {
      type: 'okapi',
      path: 'loan-types',
      params: {
        query: 'cql.allRecords=1 sortby name',
        limit: '40',
      },
      records: 'loantypes',
    },
    itemNoteTypes: {
      type: 'okapi',
      path: 'item-note-types',
      records: 'itemNoteTypes',
    },
    requests: {
      type: 'okapi',
      path: 'circulation/requests?query=(itemId==:{itemid}) and status==("Open - Awaiting pickup" or "Open - Not yet filled") sortby requestDate desc',
      records: 'requests',
    },
    // there is no canonical method to retrieve an item's "current" loan.
    // the top item, sorted by loan-date descending, is a best-effort.
    loans: {
      type: 'okapi',
      path: 'circulation/loans?query=(itemId==!{itemId}) sortby loanDate/sort.descending&limit=1',
      records: 'loans',
    },
    borrowerId: {},
    borrower: {
      type: 'okapi',
      path: 'users?query=(id==%{borrowerId.query})',
      records: 'users',
    },
  });

  constructor(props) {
    super(props);
    this.state = {
      accordions: {
        acc01: true,
        acc02: true,
        acc03: true,
        acc04: true,
        acc05: true,
        acc06: true,
        acc07: true,
        acc08: true,
      },
      loan: null,
      borrower: null,
      loanStatusDate: null,
    };

    this.craftLayerUrl = craftLayerUrl.bind(this);
    this.cViewMetaData = props.stripes.connect(ViewMetaData);
  }

  /**
   * If a loan is retrieved matching this item, retrieve the corresponding
   * user record as well.
   *
   * I do not understand why it is necessary to check that loan.itemId matches
   * itemid and that borrower.id matches userId; the latter values are those
   * that are used in the manifest above and I can see that the correct
   * queries are running in the browser's network inspector. And yet, if
   * they are not checked, the values in nextProps.resources are always
   * from a previous incarnation of this object.
   *
   * Likewise, if the borrower resource's path is defined to have a string
   * substituted in rather than an object, it will always contain the value
   * from the previous incarnation of the object. i.e. if the path is
   *     users?query=(id==%{borrowerId})
   * and we call
   *     nextProps.mutator.borrowerId.replace(loan.userId);
   * instead of
   *     users?query=(id==%{ borrowerId.query })
   * and
   *     nextProps.mutator.borrowerId.replace({ query: loan.userId });
   * then the value retrieved by nextProps.resources.borrower will always
   * be that from the previous instance of this object.
   *
   * This smells like a dataKey issue in stripes-connect.
   *
   * dataKey, with a lower case "d",
   * that rhymes with "t",
   * that stands for "tap dancing" or maybe "tesseract" and also "thelonious"
   * that rhymes with "felonious"
   * and that stands for "funk!"
   *
   */
  static getDerivedStateFromProps(nextProps, prevState) {
    const loanRecords = (nextProps.resources.loans || {}).records || [];
    if ((!prevState.loan) && loanRecords.length === 1) {
      const loan = loanRecords[0];
      if (nextProps.itemId === loan.itemId) {
        const nextState = {
          loanStatusDate: _.get(loan, ['metadata', 'updatedDate']),
        };

        // FIXME: loan-status-check must be i18n friendly
        const itemStatus = loan.item.status.name;
        if (itemStatus !== 'Available' && itemStatus !== 'Awaiting pickup' && itemStatus !== 'In transit') {
          nextProps.mutator.borrowerId.replace({ query: loan.userId });
          nextState.loan = loan;
        }

        return nextState;
      }

      // console.warn(`retrieved a loan.itemId ${loan.itemId} that did not match the item.itemid ${nextProps.itemid}`)
    }

    const borrowerRecords = (nextProps.resources.borrower || {}).records || [];
    if (prevState.loan && (!prevState.borrower) && borrowerRecords.length === 1) {
      const borrower = borrowerRecords[0];
      if (prevState.loan.userId === borrower.id) {
        return { borrower };
      }

      // console.warn('retrieved a borrower.id ${borrower.id} that did not match the loan.userId ${prevState.loan.userId}')
    }

    return null;
  }

  onClickEditItem = (e) => {
    if (e) e.preventDefault();
    this.props.mutator.query.update({ layer: 'editItem' });
  }

  onClickCloseEditItem = (e) => {
    if (e) e.preventDefault();
    this.props.mutator.query.update({ layer: null });
  }

  saveItem = (item) => {
    this.props.mutator.items.PUT(item).then(() => this.onClickCloseEditItem());
  }

  copyItem = (item) => {
    const { resources: { holdingsRecords, instances1 } } = this.props;
    const holdingsRecord = holdingsRecords.records[0];
    const instance = instances1.records[0];

    this.props.mutator.items.POST(item).then((data) => {
      this.props.mutator.query.update({
        _path: `/inventory/view/${instance.id}/${holdingsRecord.id}/${data.id}`,
        layer: null,
      });
    });
  }

  handleAccordionToggle = ({ id }) => {
    this.setState((state) => {
      const newState = _.cloneDeep(state);
      newState.accordions[id] = !newState.accordions[id];
      return newState;
    });
  }

  handleExpandAll = (obj) => {
    this.setState((curState) => {
      const newState = _.cloneDeep(curState);
      newState.accordions = obj;
      return newState;
    });
  }

  onCopy(item) {
    this.setState((state) => {
      const newState = _.cloneDeep(state);
      newState.copiedItem = _.omit(item, ['id', 'barcode']);
      newState.copiedItem.status = { name: 'Available' };
      return newState;
    });

    this.props.mutator.query.update({ layer: 'copyItem' });
  }

  getActionMenu = ({ onToggle }) => {
    const { resources } = this.props;
    const firstItem = _.get(resources, 'items.records[0]');

    return (
      <Fragment>
        <Button
          href={this.craftLayerUrl('editItem')}
          onClick={() => {
            onToggle();
            this.onClickEditItem();
          }}
          buttonStyle="dropdownItem"
          data-test-inventory-edit-item-action
        >
          <Icon icon="edit">
            <FormattedMessage id="ui-inventory.editItem" />
          </Icon>
        </Button>
        <Button
          id="clickable-copy-item"
          onClick={() => {
            onToggle();
            this.onCopy(firstItem);
          }}
          buttonStyle="dropdownItem"
          data-test-inventory-duplicate-item-action
        >
          <Icon icon="duplicate">
            <FormattedMessage id="ui-inventory.copyItem" />
          </Icon>
        </Button>
      </Fragment>
    );
  }

  render() {
    const {
      location,
      resources: {
        items,
        holdingsRecords,
        instances1,
        materialTypes,
        loanTypes,
        itemNoteTypes,
        requests,
      },
      referenceTables,
      okapi,
      paneWidth,
      stripes: { intl },
    } = this.props;

    const {
      accordions,
    } = this.state;

    const formatMsg = intl.formatMessage;

    referenceTables.loanTypes = (loanTypes || {}).records || [];
    referenceTables.materialTypes = (materialTypes || {}).records || [];
    referenceTables.itemNoteTypes = (itemNoteTypes || {}).records || [];

    if (!items || !items.hasLoaded || !instances1 ||
      !instances1.hasLoaded || !holdingsRecords ||
      !holdingsRecords.hasLoaded) return <div>Waiting for resources</div>;

    if (!loanTypes || !loanTypes.hasLoaded ||
        !materialTypes || !materialTypes.hasLoaded ||
        !itemNoteTypes || !itemNoteTypes.hasLoaded) return <div>Waiting for resources</div>;

    const instance = instances1.records[0];
    const item = items.records[0];
    const holdingsRecord = holdingsRecords.records[0];
    const { locationsById } = referenceTables;
    const permanentHoldingsLocation = locationsById[holdingsRecord.permanentLocationId];
    const temporaryHoldingsLocation = locationsById[holdingsRecord.temporaryLocationId];

    const requestRecords = (requests || {}).records || [];
    const query = location.search ? queryString.parse(location.search) : {};

    const detailMenu = (
      <PaneMenu>
        <IconButton
          icon="edit"
          id="clickable-edit-item"
          style={{ visibility: !item ? 'hidden' : 'visible' }}
          href={this.craftLayerUrl('editItem', location)}
          onClick={this.onClickEditItem}
          title="Edit Item"
        />
      </PaneMenu>
    );

    const labelPermanentHoldingsLocation = _.get(permanentHoldingsLocation, ['name'], '');
    const labelCallNumber = holdingsRecord.callNumber || '';

    let requestLink = 0;
    if (requestRecords.length && item.barcode) {
      requestLink = <Link to={`/requests?filters=&query=${item.barcode}&sort=Request%20Date`}>{requestRecords.length}</Link>;
    }

    let loanLink = item.status.name;
    let borrowerLink = '-';
    if (this.state.loan && this.state.borrower) {
      loanLink = <Link to={`/users/view/${this.state.loan.userId}?filters=&layer=loan&loan=${this.state.loan.id}&query=&sort=`}>{item.status.name}</Link>;
      borrowerLink = <Link to={`/users/view/${this.state.loan.userId}`}>{this.state.borrower.barcode}</Link>;
    }
    if (loanLink === 'Awaiting pickup') {
      loanLink = <Link to={`/requests?filters=&query=${item.barcode}&sort=Request%20Date`}>{loanLink}</Link>;
    }

    let itemStatusDate = _.get(item, ['metadata', 'updatedDate']);
    if (this.state.loanStatusDate && this.state.loanStatusDate > itemStatusDate) {
      itemStatusDate = this.state.loanStatusDate;
    }

    const refLookup = (referenceTable, id) => {
      const ref = (referenceTable && id) ? referenceTable.find(record => record.id === id) : {};
      return ref || {};
    };

    const layoutNotes = (noteTypes, notes) => {
      const table = [];
      let cols = [];
      noteTypes
        .filter((noteType) => notes.find(note => note.itemNoteTypeId === noteType.id))
        .map((noteType, i) => {
          cols.push(
            <Col key={i} sm={3}>
              <KeyValue
                label={noteType.name}
                value={_.get(item, ['notes'], []).map((note, j) => { if (note.itemNoteTypeId === noteType.id) return <div key={j}>{note.note}</div>; else return ''; })}
              />
            </Col>
          );
          if ((i + 1) % 4 === 0) {
            table.push(<Row>{cols}</Row>);
            cols = [];
          }
          return cols;
        });
      if (cols.length) table.push(<Row>{cols}</Row>);
      return table;
    };

    return (
      <div>
        <Layer isOpen label="View Item">
          <Pane
            data-test-item-view-page
            defaultWidth={paneWidth}
            paneTitle={
              <div style={{ textAlign: 'center' }} data-test-header-title>
                <AppIcon app="inventory" iconKey="item" size="small" />
                {' '}
                {_.get(item, ['barcode'], '')}
                <div>
                  { formatMsg({ id: 'ui-inventory.itemDotStatus' }, { status: _.get(item, ['status', 'name'], '') }) }
                </div>
              </div>
            }
            lastMenu={detailMenu}
            dismissible
            onClose={this.props.onCloseViewItem}
            actionMenu={this.getActionMenu}
          >
            <Row center="xs">
              <Col sm={6}>
                {formatMsg({ id: 'ui-inventory.instance' })}
                {' '}
                {instance.title}
                {(instance.publication && instance.publication.length > 0) &&
                  <span>
                    <em>, </em>
                    <em>
                      {instance.publication[0].publisher}
                      {instance.publication[0].dateOfPublication ? `, ${instance.publication[0].dateOfPublication}` : ''}
                    </em>
                  </span>
                }
                <div>
                  { `${formatMsg({ id: 'ui-inventory.holdingsColon' })} ${labelPermanentHoldingsLocation} > ${labelCallNumber}`}
                </div>
              </Col>
            </Row>
            <hr />
            <Row end="xs"><Col xs><ExpandAllButton accordionStatus={this.state.accordions} onToggle={this.handleExpandAll} /></Col></Row>
            <br />
            <Accordion
              open={accordions.acc01}
              id="acc01"
              onToggle={this.handleAccordionToggle}
              label={formatMsg({ id: 'ui-inventory.administrativeData' })}
            >
              { (item.metadata && item.metadata.createdDate) &&
              <this.cViewMetaData metadata={item.metadata} />
              }
              <Row>
                <Col sm={12}>
                  <AppIcon app="inventory" iconKey="item" size="small" />
                  {' '}
                  {formatMsg({ id: 'ui-inventory.itemRecord' })}
                  {' '}
                  <AppIcon app="inventory" iconKey="material-type" size="small" />
                  {' '}
                  {_.get(item, ['materialType', 'name'], '')}
                  {' '}
                  <AppIcon app="inventory" iconKey="item-status" size="small" />
                  {' '}
                  {_.get(item, ['status', 'name'], '')}
                </Col>
              </Row>
              <br />
              <Row>
                <Col xs={3}>
                  <KeyValue label={formatMsg({ id: 'ui-inventory.itemHrid' })} value={_.get(item, ['id'], '')} />
                </Col>
                { (item.barcode) &&
                <Col xs={3}>
                  <KeyValue label={formatMsg({ id: 'ui-inventory.itemBarcode' })} value={_.get(item, ['barcode'], '')} />
                </Col>
                }
              </Row>
            </Accordion>
            <Accordion
              open={accordions.acc02}
              id="acc02"
              onToggle={this.handleAccordionToggle}
              label={formatMsg({ id: 'ui-inventory.itemData' })}
            >
              <Row>
                <Col smOffset={0} sm={4}>
                  <strong>{formatMsg({ id: 'ui-inventory.itemCallNumber' })}</strong>
                </Col>
              </Row>
              <Row>
                { (item.copyNumbers) &&
                <Col smOffset={0} sm={4}>
                  <KeyValue label={formatMsg({ id: 'ui-inventory.copyNumbers' })} value={_.get(item, ['copyNumbers'], []).map((line, i) => <div key={i}>{line}</div>)} />
                </Col>
                }
                { (item.numberOfPieces) &&
                <Col smOffset={0} sm={4}>
                  <KeyValue label={formatMsg({ id: 'ui-inventory.numberOfPieces' })} value={_.get(item, ['numberOfPieces'], '')} />
                </Col>
                }
              </Row>
            </Accordion>
            <Accordion
              open={accordions.acc03}
              id="acc03"
              onToggle={this.handleAccordionToggle}
              label={formatMsg({ id: 'ui-inventory.enumerationData' })}
            >
              <Row>
                { (item.enumeration) &&
                <Col smOffset={0} sm={4}>
                  <KeyValue label={formatMsg({ id: 'ui-inventory.enumeration' })} value={_.get(item, ['enumeration'], '')} />
                </Col>
                }
                { (item.volume) &&
                <Col smOffset={0} sm={4}>
                  <KeyValue label={formatMsg({ id: 'ui-inventory.volume' })} value={_.get(item, ['volume'], '')} />
                </Col>
                }
                { (item.chronology) &&
                <Col smOffset={0} sm={4}>
                  <KeyValue label={formatMsg({ id: 'ui-inventory.chronology' })} value={_.get(item, ['chronology'], '')} />
                </Col>
                }
              </Row>
              <Row>
                { (item.yearCaption && item.yearCaption.length > 0) &&
                  <Col smOffset={0} sm={8}>
                    <KeyValue label={formatMsg({ id: 'ui-inventory.yearCaption' })} value={_.get(item, ['yearCaption'], []).map((line, i) => <div key={i}>{line}</div>)} />
                  </Col>
                }
              </Row>
            </Accordion>
            <Accordion
              open={accordions.acc04}
              id="acc04"
              onToggle={this.handleAccordionToggle}
              label={formatMsg({ id: 'ui-inventory.conditions' })}
            >
              <Row>
                { (item.numberOfMissingPieces) &&
                  <Col smOffset={0} sm={4}>
                    <KeyValue label={intl.formatMessage({ id: 'ui-inventory.numberOfMissingPieces' })} value={_.get(item, ['numberOfMissingPieces'], '')} />
                  </Col>
                }
                { (item.missingPieces) &&
                  <Col smOffset={0} sm={4}>
                    <KeyValue label={intl.formatMessage({ id: 'ui-inventory.missingPieces' })} value={_.get(item, ['missingPieces'], '')} />
                  </Col>
                }
                { (item.missingPiecesDate) &&
                  <Col smOffset={0} sm={4}>
                    <KeyValue label={intl.formatMessage({ id: 'ui-inventory.date' })} value={_.get(item, ['missingPiecesDate'], '')} />
                  </Col>
                }
              </Row>
              <Row>
                { (item.itemDamagedStatus) &&
                  <Col smOffset={0} sm={4}>
                    <KeyValue label={intl.formatMessage({ id: 'ui-inventory.itemDamagedStatus' })} value="" />
                  </Col>
                }
                { (item.itemDamagedStatusDate) &&
                  <Col smOffset={0} sm={4}>
                    <KeyValue label={intl.formatMessage({ id: 'ui-inventory.date' })} value={_.get(item, ['itemDamagedStatusDate'], '')} />
                  </Col>
                }
              </Row>
            </Accordion>
            <Accordion
              open={accordions.acc05}
              id="acc05"
              onToggle={this.handleAccordionToggle}
              label={formatMsg({ id: 'ui-inventory.notes' })}
            >
              {layoutNotes(referenceTables.itemNoteTypes, _.get(item, ['notes'], []))}
            </Accordion>
            <Accordion
              open={accordions.acc06}
              id="acc06"
              onToggle={this.handleAccordionToggle}
              label={intl.formatMessage({ id: 'ui-inventory.item.availability' })}
            >
              <Row>
                { (item.permanentLoanType) &&
                <Col smOffset={0} sm={4}>
                  <KeyValue label={formatMsg({ id: 'ui-inventory.permanentLoantype' })} value={_.get(item, ['permanentLoanType', 'name'], '')} />
                </Col>
                }
                { (item.temporaryLoanType) &&
                <Col smOffset={0} sm={4}>
                  <KeyValue label={formatMsg({ id: 'ui-inventory.temporaryLoantype' })} value={_.get(item, ['temporaryLoanType', 'name'], '')} />
                </Col>
                }
              </Row>
              <Row>
                <Col smOffset={0} sm={4}>
                  <KeyValue label={intl.formatMessage({ id: 'ui-inventory.item.availability.itemStatus' })} value={loanLink} />
                </Col>
                <Col smOffset={0} sm={4}>
                  <KeyValue label={intl.formatMessage({ id: 'ui-inventory.item.availability.itemStatusDate' })}>
                    {itemStatusDate ? <FormattedTime value={itemStatusDate} day="numeric" month="numeric" year="numeric" /> : '-'}
                  </KeyValue>
                </Col>
                <Col smOffset={0} sm={4}>
                  <KeyValue label={intl.formatMessage({ id: 'ui-inventory.item.availability.requests' })} value={requestLink} />
                </Col>
              </Row>
              <Row>
                <Col smOffset={0} sm={4}>
                  <KeyValue label={intl.formatMessage({ id: 'ui-inventory.item.availability.borrower' })} value={borrowerLink} />
                </Col>
                <Col smOffset={0} sm={4}>
                  <KeyValue label={intl.formatMessage({ id: 'ui-inventory.item.availability.loanDate' })}>
                    {this.state.loan ? <FormattedTime value={this.state.loan.loanDate} day="numeric" month="numeric" year="numeric" /> : '-'}
                  </KeyValue>
                </Col>
                <Col smOffset={0} sm={4}>
                  <KeyValue label={intl.formatMessage({ id: 'ui-inventory.item.availability.dueDate' })}>
                    {this.state.loan ? <FormattedTime value={this.state.loan.dueDate} day="numeric" month="numeric" year="numeric" /> : '-'}
                  </KeyValue>
                </Col>
              </Row>
            </Accordion>
            <Accordion
              open={accordions.acc07}
              id="acc07"
              onToggle={this.handleAccordionToggle}
              label={formatMsg({ id: 'ui-inventory.location' })}
            >
              <Row>
                <Col smOffset={0} sm={4}>
                  <strong>{formatMsg({ id: 'ui-inventory.holdingsLocation' })}</strong>
                </Col>
              </Row>
              <br />
              <Row>
                <Col smOffset={0} sm={4}>
                  <KeyValue label={formatMsg({ id: 'ui-inventory.permanentLocation' })} value={_.get(permanentHoldingsLocation, ['name'], '')} />
                </Col>
                <Col sm={4}>
                  <KeyValue label={formatMsg({ id: 'ui-inventory.temporaryLocation' })} value={_.get(temporaryHoldingsLocation, ['name'], '-')} />
                </Col>
              </Row>
              <Row>
                <Col smOffset={0} sm={4}>
                  <strong>{formatMsg({ id: 'ui-inventory.itemLocation' })}</strong>
                </Col>
              </Row>
              <br />
              <Row>
                <Col smOffset={0} sm={4}>
                  <KeyValue label={formatMsg({ id: 'ui-inventory.permanentLocation' })} value={_.get(item, ['permanentLocation', 'name'], '-')} />
                </Col>
                <Col sm={4}>
                  <KeyValue label={formatMsg({ id: 'ui-inventory.temporaryLocation' })} value={_.get(item, ['temporaryLocation', 'name'], '-')} />
                </Col>
              </Row>
              <Row>
                <Col smOffset={0} sm={4}>
                  <strong>{formatMsg({ id: 'ui-inventory.effectiveLocation' })}</strong>
                </Col>
              </Row>
              <br />
              <Row>
                <Col smOffset={0} sm={4}>
                  {_.get(item, ['effectiveLocation', 'name'], '')}
                </Col>
              </Row>
            </Accordion>
            <Accordion
              open={accordions.acc08}
              id="acc08"
              onToggle={this.handleAccordionToggle}
              label={formatMsg({ id: 'ui-inventory.electronicAccess' })}
            >
              {item.electronicAccess && item.electronicAccess.length &&
                <MultiColumnList
                  id="list-electronic-access"
                  contentData={item.electronicAccess}
                  visibleColumns={['URL relationship', 'URI', 'Link text', 'Materials specified', 'URL public note']}
                  formatter={{
                    'URL relationship': x => refLookup(referenceTables.electronicAccessRelationships, _.get(x, ['relationshipId'])).name,
                    'URI': x => <a href={_.get(x, ['uri'])}>{_.get(x, ['uri'])}</a>,
                    'Link text': x => _.get(x, ['linkText']) || '',
                    'Materials specified': x => _.get(x, ['materialsSpecification']) || '',
                    'URL public note': x => _.get(x, ['publicNote']) || '',
                  }}
                  ariaLabel="Electronic access"
                  containerRef={(ref) => { this.resultsList = ref; }}
                />
              }
            </Accordion>

          </Pane>
        </Layer>
        <Layer isOpen={query.layer ? query.layer === 'editItem' : false} label="Edit Item Dialog">
          <ItemForm
            form={`itemform_${item.id}`}
            onSubmit={(record) => { this.saveItem(record); }}
            initialValues={item}
            onCancel={this.onClickCloseEditItem}
            okapi={okapi}
            instance={instance}
            holdingsRecord={holdingsRecord}
            referenceTables={referenceTables}
            intl={intl}
            stripes={this.props.stripes}
          />
        </Layer>
        <Layer isOpen={query.layer === 'copyItem'} label="Copy Item Dialog">
          <ItemForm
            form={`itemform_${holdingsRecord.id}`}
            onSubmit={(record) => { this.copyItem(record); }}
            initialValues={this.state.copiedItem}
            onCancel={this.onClickCloseEditItem}
            okapi={okapi}
            instance={instance}
            copy
            holdingsRecord={holdingsRecord}
            referenceTables={referenceTables}
            intl={intl}
            stripes={this.props.stripes}
          />
        </Layer>
      </div>
    );
  }
}

ViewItem.propTypes = {
  stripes: PropTypes.shape({
    intl: PropTypes.object.isRequired,
    connect: PropTypes.func.isRequired,
  }).isRequired,
  resources: PropTypes.shape({
    instances1: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object),
    }),
    materialTypes: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object),
    }),
    loanTypes: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object),
    }),
    requests: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object),
    }),
    loans: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object),
    }),
    borrower: PropTypes.object,
  }).isRequired,
  okapi: PropTypes.object,
  location: PropTypes.object,
  paneWidth: PropTypes.string,
  referenceTables: PropTypes.object.isRequired,
  mutator: PropTypes.shape({
    items: PropTypes.shape({
      PUT: PropTypes.func.isRequired,
      POST: PropTypes.func.isRequired,
    }),
    query: PropTypes.object.isRequired,
  }),
  onCloseViewItem: PropTypes.func.isRequired,
};

export default ViewItem;
