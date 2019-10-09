import {
  get,
  upperFirst,
  cloneDeep,
  set,
  omit,
  includes,
} from 'lodash';
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import Link from 'react-router-dom/Link';
import SafeHTMLMessage from '@folio/react-intl-safe-html';
import {
  FormattedDate,
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
  PaneHeaderIconButton,
  MultiColumnList,
  Button,
  Icon,
  ConfirmationModal,
  Modal,
} from '@folio/stripes/components';

import { ViewMetaData } from '@folio/stripes/smart-components';
import {
  AppIcon,
  IntlConsumer,
  stripesConnect,
} from '@folio/stripes/core';

import { craftLayerUrl, canMarkItemAsMissing } from './utils';
import ItemForm from './edit/items/ItemForm';
import withLocation from './withLocation';
import { itemStatuses } from './constants';

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
      params: {
        query: 'cql.allRecords=1 sortby name',
        limit: '1000',
      },
      records: 'mtypes',
    },
    loanTypes: {
      type: 'okapi',
      path: 'loan-types',
      params: {
        query: 'cql.allRecords=1 sortby name',
        limit: '1000',
      },
      records: 'loantypes',
    },
    callNumberTypes: {
      type: 'okapi',
      path: 'call-number-types',
      params: {
        query: 'cql.allRecords=1 sortby name',
        limit: '1000',
      },
      records: 'callNumberTypes',
    },
    requests: {
      type: 'okapi',
      path: 'circulation/requests?query=(itemId==:{itemid}) and status==("Open - Awaiting pickup" or "Open - Not yet filled" or "Open - In transit") sortby requestDate desc',
      records: 'requests',
      PUT: {
        path: 'circulation/requests/%{requestOnItem.id}'
      },
    },
    // there is no canonical method to retrieve an item's "current" loan.
    // the top item, sorted by loan-date descending, is a best-effort.
    loans: {
      type: 'okapi',
      path: 'circulation/loans',
      params: {
        query: 'itemId==!{itemId} sortby loanDate/sort.descending',
        limit: '1',
      },
      records: 'loans',
      accumulate: 'true',
      fetch: false,
    },
    borrowers: {
      type: 'okapi',
      path: 'users',
      records: 'users',
      accumulate: 'true',
      fetch: false,
    },
    requestOnItem: {},
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
      itemMissingModal: false,
      confirmDeleteItemModal: false,
      cannotDeleteItemModal: false,
    };

    this.craftLayerUrl = craftLayerUrl.bind(this);
    this.cViewMetaData = props.stripes.connect(ViewMetaData);
  }

  async componentDidMount() {
    const { AVAILABLE, AWAITING_PICKUP, IN_TRANSIT } = itemStatuses;
    const loans = await this.fetchLoans();
    const loan = loans[0];

    if (!loan) return;

    const itemStatus = get(loan, 'item.status.name');
    const loanStatusDate = get(loan, 'metadata.updatedDate');
    const state = { loanStatusDate };

    if (!includes([AVAILABLE, AWAITING_PICKUP, IN_TRANSIT], itemStatus)) {
      const borrowers = await this.fetchBorrowers(loans[0].userId);
      state.loan = loan;
      state.borrower = borrowers[0];
    }

    this.setState(state);
  }

  fetchLoans() {
    const { mutator: { loans } } = this.props;
    loans.reset();
    return loans.GET();
  }

  fetchBorrowers(borrowerId) {
    const { mutator: { borrowers } } = this.props;
    const query = `id==${borrowerId}`;

    borrowers.reset();
    return borrowers.GET({ params: { query } });
  }

  onClickEditItem = (e) => {
    if (e) e.preventDefault();
    this.props.updateLocation({ layer: 'editItem' });
  }

  onClickCloseEditItem = (e) => {
    if (e) e.preventDefault();
    this.props.updateLocation({ layer: null });
  }

  saveItem = (item) => {
    if (!item.barcode) {
      delete item.barcode;
    }

    this.props.mutator.items.PUT(item).then(() => this.onClickCloseEditItem());
  }

  copyItem = (item) => {
    const { resources: { holdingsRecords, instances1 } } = this.props;
    const holdingsRecord = holdingsRecords.records[0];
    const instance = instances1.records[0];

    this.props.mutator.items.POST(item).then((data) => {
      this.props.goTo(`/inventory/view/${instance.id}/${holdingsRecord.id}/${data.id}`);
    });
  }

  deleteItem = (item) => {
    this.props.onCloseViewItem();
    this.props.mutator.items.DELETE(item);
  }

  handleAccordionToggle = ({ id }) => {
    this.setState((state) => {
      const newState = cloneDeep(state);
      newState.accordions[id] = !newState.accordions[id];
      return newState;
    });
  }

  handleExpandAll = (obj) => {
    this.setState((curState) => {
      const newState = cloneDeep(curState);
      newState.accordions = obj;
      return newState;
    });
  }

  onCopy(item) {
    this.setState((state) => {
      const newState = cloneDeep(state);
      newState.copiedItem = omit(item, ['id', 'hrid', 'barcode']);
      newState.copiedItem.status = { name: 'Available' };
      return newState;
    });

    this.props.updateLocation({ layer: 'copyItem' });
  }

  handleConfirm = (item, requestRecords) => {
    const newItem = cloneDeep(item);
    set(newItem, ['status', 'name'], 'Missing');

    if (requestRecords.length) {
      const newRequestRecord = cloneDeep(requestRecords[0]);
      const itemStatus = get(newRequestRecord, ['item', 'status']);
      const holdShelfExpirationDate = get(newRequestRecord, ['holdShelfExpirationDate']);
      if (itemStatus === 'Awaiting pickup' && new Date(holdShelfExpirationDate) > new Date()) {
        this.props.mutator.requestOnItem.replace({ id: newRequestRecord.id });
        set(newRequestRecord, ['status'], 'Open - Not yet filled');
        this.props.mutator.requests.PUT(newRequestRecord);
      }
    }

    this.props.mutator.items.PUT(newItem)
      .then(() => this.setState({ itemMissingModal: false }));
  }

  hideMissingModal = () => {
    this.setState({ itemMissingModal: false });
  }

  hideconfirmDeleteItemModal = () => {
    this.setState({ confirmDeleteItemModal: false });
  }

  hideCannotDeleteItemModal = () => {
    this.setState({ cannotDeleteItemModal: false });
  }

  canDeleteItem = (item, request) => {
    const itemStatus = get(item, 'status.name');
    const { CHECKED_OUT, ON_ORDER } = itemStatuses;
    let messageId;
    if (itemStatus === CHECKED_OUT) {
      messageId = 'ui-inventory.noItemDeleteModal.checkoutMessage';
    } else if (itemStatus === ON_ORDER) {
      messageId = 'ui-inventory.noItemDeleteModal.orderMessage';
    } else if (request) {
      messageId = 'ui-inventory.noItemDeleteModal.requestMessage';
    }

    const state = (messageId) ?
      {
        cannotDeleteItemModal: true,
        cannotDeleteItemModalMessageId: messageId,
      } :
      {
        confirmDeleteItemModal: true,
      };

    this.setState(state);
  }

  getActionMenu = ({ onToggle }) => {
    const { resources } = this.props;
    const firstItem = get(resources, 'items.records[0]');
    const request = get(resources, 'requests.records[0]');

    const newRequestLink = firstItem.barcode
      ? `/requests?itemBarcode=${firstItem.barcode}&query=${firstItem.barcode}&layer=create`
      : `/requests?itemId=${firstItem.id}&query=${firstItem.id}&layer=create`;

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
        <Button
          id="clickable-delete-item"
          onClick={() => {
            onToggle();
            this.canDeleteItem(firstItem, request);
          }}
          buttonStyle="dropdownItem"
          data-test-inventory-delete-item-action
        >
          <Icon icon="trash">
            <FormattedMessage id="ui-inventory.deleteItem" />
          </Icon>
        </Button>
        {
          canMarkItemAsMissing(firstItem) &&
          <Button
            id="clickable-missing-item"
            onClick={() => {
              onToggle();
              this.setState({ itemMissingModal: true });
            }}
            buttonStyle="dropdownItem"
            data-test-mark-as-missing-item
          >
            <Icon icon="flag">
              <FormattedMessage id="ui-inventory.markAsMissing" />
            </Icon>
          </Button>
        }
        <Button
          to={newRequestLink}
          buttonStyle="dropdownItem"
          data-test-inventory-create-request-action
        >
          <Icon icon="plus-sign">
            <FormattedMessage id="ui-inventory.newRequest" />
          </Icon>
        </Button>
      </Fragment>
    );
  }

  isAwaitingResource = () => {
    const {
      items,
      holdingsRecords,
      instances1,
      materialTypes,
      loanTypes,
      callNumberTypes,
    } = this.props.resources;

    if (!items || !items.hasLoaded || !instances1 ||
      !instances1.hasLoaded || !holdingsRecords ||
      !holdingsRecords.hasLoaded) {
      return true;
    }

    if (!loanTypes || !loanTypes.hasLoaded ||
      !materialTypes || !materialTypes.hasLoaded ||
      !callNumberTypes || !callNumberTypes.hasLoaded) {
      return true;
    }

    return false;
  };

  render() {
    const {
      location,
      resources: {
        items,
        holdingsRecords,
        instances1,
        materialTypes,
        loanTypes,
        requests,
        callNumberTypes,
      },
      referenceTables,
      okapi,
      paneWidth,
    } = this.props;

    const {
      accordions,
      cannotDeleteItemModalMessageId,
      cannotDeleteItemModal,
    } = this.state;

    referenceTables.loanTypes = (loanTypes || {}).records || [];
    referenceTables.materialTypes = (materialTypes || {}).records || [];
    referenceTables.callNumberTypes = (callNumberTypes || {}).records || [];

    if (this.isAwaitingResource()) {
      return <FormattedMessage id="ui-inventory.waitingForResources" />;
    }

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
        <FormattedMessage id="ui-inventory.editItem">
          {ariaLabel => (
            <PaneHeaderIconButton
              icon="edit"
              id="clickable-edit-item"
              style={{ visibility: !item ? 'hidden' : 'visible' }}
              href={this.craftLayerUrl('editItem', location)}
              onClick={this.onClickEditItem}
              ariaLabel={ariaLabel}
            />
          )}
        </FormattedMessage>
      </PaneMenu>
    );

    const labelPermanentHoldingsLocation = get(permanentHoldingsLocation, ['name'], '');
    const labelCallNumber = holdingsRecord.callNumber || '';
    const itemIdOrBarcode = item.barcode || item.id;

    let requestLink = 0;
    const requestFiltersLink = 'requestStatus.Open%20-%20Awaiting%20pickup%2CrequestStatus.Open%20-%20In%20transit%2CrequestStatus.Open%20-%20Not%20yet%20filled';
    if (requestRecords.length && itemIdOrBarcode) {
      requestLink = <Link to={`/requests?filters=${requestFiltersLink}&query=${itemIdOrBarcode}&sort=Request%20Date`}>{requestRecords.length}</Link>;
    }

    let loanLink = item.status.name;
    let borrowerLink = '-';

    if (this.state.loan && this.state.borrower) {
      loanLink = <Link to={`/users/view/${this.state.loan.userId}?filters=&layer=loan&loan=${this.state.loan.id}&query=&sort=`}>{item.status.name}</Link>;
      borrowerLink = <Link to={`/users/view/${this.state.loan.userId}`}>{this.state.borrower.barcode}</Link>;
    }

    if (loanLink === 'Awaiting pickup') {
      loanLink = <Link to={`/requests?filters=${requestFiltersLink}&query=${itemIdOrBarcode}&sort=Request%20Date`}>{loanLink}</Link>;
    }

    let itemStatusDate = get(item, ['metadata', 'updatedDate']);
    if (this.state.loanStatusDate && this.state.loanStatusDate > itemStatusDate) {
      itemStatusDate = this.state.loanStatusDate;
    }

    const refLookup = (referenceTable, id) => {
      const ref = (referenceTable && id) ? referenceTable.find(record => record.id === id) : {};
      return ref || {};
    };

    const layoutNotes = (noteTypes, notes) => {
      return noteTypes
        .filter((noteType) => notes.find(note => note.itemNoteTypeId === noteType.id))
        .map((noteType, i) => {
          return (
            <Row key={i}>
              <Col xs={1}>
                <KeyValue
                  label={<FormattedMessage id="ui-inventory.staffOnly" />}
                  value={get(item, ['notes'], []).map((note, j) => {
                    if (note.itemNoteTypeId === noteType.id) {
                      return <div key={j}>{note.staffOnly ? 'Yes' : 'No'}</div>;
                    }
                    return null;
                  })}
                />
              </Col>
              <Col xs={11}>
                <KeyValue
                  label={noteType.name}
                  value={get(item, ['notes'], []).map((note, j) => {
                    if (note.itemNoteTypeId === noteType.id) {
                      return <div key={j}>{note.note}</div>;
                    }
                    return null;
                  })}
                />
              </Col>
            </Row>
          );
        });
    };

    const layoutCirculationNotes = (noteTypes, notes) => {
      return noteTypes
        .filter((noteType) => notes.find(note => note.noteType === noteType))
        .map((noteType, i) => {
          return (
            <Row key={i}>
              <Col xs={1}>
                <KeyValue
                  label={<FormattedMessage id="ui-inventory.staffOnly" />}
                  value={get(item, ['circulationNotes'], []).map((note, j) => {
                    if (note.noteType === noteType) {
                      return <div key={j}>{note.staffOnly ? 'Yes' : 'No'}</div>;
                    }
                    return null;
                  })}
                />
              </Col>
              <Col xs={11}>
                <KeyValue
                  label={`${noteType} note`}
                  value={get(item, ['circulationNotes'], []).map((note, j) => {
                    if (note.noteType === noteType) {
                      return <div key={j}>{note.note}</div>;
                    }
                    return null;
                  })}
                />
              </Col>
            </Row>
          );
        });
    };

    const missingModalMessage = (
      <SafeHTMLMessage
        id="ui-inventory.missingModal.message"
        values={{
          title: item.title,
          barcode: item.barcode,
          materialType: upperFirst(get(item, ['materialType', 'name'], ''))
        }}
      />
    );

    const confirmDeleteItemModalMessage = (
      <SafeHTMLMessage
        id="ui-inventory.confirmItemDeleteModal.message"
        values={{
          hrid: item.hrid,
          barcode: item.barcode
        }}
      />
    );

    const cannotDeleteItemFooter = (
      <Button
        data-test-cannot-delete-item-back-action
        onClick={this.hideCannotDeleteItemModal}
      >
        <FormattedMessage id="stripes-core.button.back" />
      </Button>
    );

    return (
      <IntlConsumer>
        {intl => (
          <div>
            <ConfirmationModal
              data-test-missingConfirmation-modal
              open={this.state.itemMissingModal}
              heading={<FormattedMessage id="ui-inventory.missingModal.heading" />}
              message={missingModalMessage}
              onConfirm={() => this.handleConfirm(item, requestRecords)}
              onCancel={this.hideMissingModal}
              confirmLabel={<FormattedMessage id="ui-inventory.missingModal.confirm" />}
            />
            <ConfirmationModal
              id="confirmDeleteItemModal"
              data-test-confirm-delete-item-modal
              open={this.state.confirmDeleteItemModal}
              heading={<FormattedMessage id="ui-inventory.confirmItemDeleteModal.heading" />}
              message={confirmDeleteItemModalMessage}
              onConfirm={() => { this.deleteItem(item); }}
              onCancel={this.hideconfirmDeleteItemModal}
              confirmLabel={<FormattedMessage id="stripes-core.button.delete" />}
            />
            {cannotDeleteItemModal &&
              <Modal
                id="cannotDeleteItemModal"
                data-test-cannot-delete-item-modal
                label={<FormattedMessage id="ui-inventory.confirmItemDeleteModal.heading" />}
                open={cannotDeleteItemModal}
                footer={cannotDeleteItemFooter}
              >
                <SafeHTMLMessage
                  id={cannotDeleteItemModalMessageId}
                  values={{
                    hrid: item.hrid,
                    barcode: item.barcode,
                    status: item.status.name
                  }}
                />
              </Modal>
            }
            <Layer
              isOpen
              contentLabel={intl.formatMessage({ id: 'ui-inventory.viewItem' })}
            >
              <Pane
                data-test-item-view-page
                defaultWidth={paneWidth}
                appIcon={<AppIcon app="inventory" iconKey="item" />}
                paneTitle={
                  <span data-test-header-item-title>
                    <FormattedMessage
                      id="ui-inventory.itemDotStatus"
                      values={{
                        barcode: get(item, 'barcode', ''),
                        status: get(item, 'status.name', '')
                      }}
                    />
                  </span>
                }
                lastMenu={detailMenu}
                dismissible
                onClose={this.props.onCloseViewItem}
                actionMenu={this.getActionMenu}
              >
                <Row center="xs">
                  <Col sm={6}>
                    <FormattedMessage id="ui-inventory.instanceTitle" values={{ title: instance.title }} />
                    {(instance.publication && instance.publication.length > 0) &&
                      <span>
                        <em>
                          {` ${instance.publication[0].publisher}`}
                          {instance.publication[0].dateOfPublication ? `, ${instance.publication[0].dateOfPublication}` : ''}
                        </em>
                      </span>
                    }
                    <div>
                      <FormattedMessage
                        id="ui-inventory.holdingsTitle"
                        values={{
                          location: labelPermanentHoldingsLocation,
                          callNumber: labelCallNumber,
                        }}
                      />
                    </div>
                  </Col>
                </Row>
                <hr />
                <Row>
                  <Col sm={12}>
                    <AppIcon
                      app="inventory"
                      iconKey="item"
                      size="small"
                    />
                    {' '}
                    <FormattedMessage id="ui-inventory.itemRecord" />
                    {' '}
                    <AppIcon
                      app="inventory"
                      iconKey="material-type"
                      size="small"
                    />
                    {' '}
                    {get(item, ['materialType', 'name'], '')}
                    {' '}
                    <AppIcon
                      app="inventory"
                      iconKey="item-status"
                      size="small"
                    />
                    {' '}
                    {get(item, ['status', 'name'], '')}
                  </Col>
                </Row>
                <br />
                <Row end="xs">
                  <Col xs>
                    <ExpandAllButton
                      accordionStatus={this.state.accordions}
                      onToggle={this.handleExpandAll}
                    />
                  </Col>
                </Row>
                <br />
                <Accordion
                  open={accordions.acc01}
                  id="acc01"
                  onToggle={this.handleAccordionToggle}
                  label={<FormattedMessage id="ui-inventory.administrativeData" />}
                >
                  <this.cViewMetaData metadata={item.metadata} />
                  <Row>
                    <Col xs={12}>
                      {instance.discoverySuppress && <FormattedMessage id="ui-inventory.discoverySuppress" />}
                    </Col>
                  </Row>
                  {instance.discoverySuppress && <br />}
                  <Row>
                    <Col xs={2}>
                      <KeyValue
                        label={<FormattedMessage id="ui-inventory.itemHrid" />}
                        value={get(item, ['hrid'], '')}
                      />
                    </Col>
                    {(item.barcode) &&
                      <Col xs={2}>
                        <KeyValue
                          label={<FormattedMessage id="ui-inventory.itemBarcode" />}
                          value={get(item, ['barcode'], '')}
                        />
                      </Col>
                    }
                    {(item.accessionNumber) &&
                      <Col xs={2}>
                        <KeyValue
                          label={<FormattedMessage id="ui-inventory.accessionNumber" />}
                          value={get(item, ['accessionNumber'], '')}
                        />
                      </Col>
                    }
                  </Row>
                  <Row>
                    <Col xs={2}>
                      <KeyValue
                        label={<FormattedMessage id="ui-inventory.itemIdentifier" />}
                        value={get(item, ['itemIdentifier'], '')}
                      />
                    </Col>
                    {(item.formerIds && item.formerIds.length > 0) &&
                      <Col smOffset={0} sm={2}>
                        <KeyValue
                          label={<FormattedMessage id="ui-inventory.formerId" />}
                          value={get(item, ['formerIds'], []).map((line, i) => <div key={i}>{line}</div>)}
                        />
                      </Col>
                    }
                  </Row>
                  <Row>
                    {(item.statisticalCodeIds && item.statisticalCodeIds.length > 0) && (
                      <MultiColumnList
                        id="list-statistical-codes"
                        contentData={item.statisticalCodeIds.map((id) => { return { 'codeId': id }; })}
                        visibleColumns={['Statistical code type', 'Statistical code']}
                        columnMapping={{
                          'Statistical code type': intl.formatMessage({ id: 'ui-inventory.statisticalCodeType' }),
                          'Statistical code': intl.formatMessage({ id: 'ui-inventory.statisticalCode' }),
                        }}
                        formatter={{
                          'Statistical code type':
                            x => refLookup(referenceTables.statisticalCodeTypes,
                              refLookup(referenceTables.statisticalCodes, get(x, ['codeId'])).statisticalCodeTypeId).name,
                          'Statistical code':
                            x => refLookup(referenceTables.statisticalCodes, get(x, ['codeId'])).name,
                        }}
                        ariaLabel={intl.formatMessage({ id: 'ui-inventory.statisticalCodes' })}
                        containerRef={(ref) => { this.resultsList = ref; }}
                      />
                    )}
                  </Row>
                </Accordion>
                <Accordion
                  open={accordions.acc02}
                  id="acc02"
                  onToggle={this.handleAccordionToggle}
                  label={<FormattedMessage id="ui-inventory.itemData" />}
                >
                  <Row>
                    <Col smOffset={0} sm={4}>
                      <strong>
                        <FormattedMessage id="ui-inventory.materialType" />
                      </strong>
                    </Col>
                  </Row>
                  <Row>
                    <Col sm={3}>
                      <KeyValue value={get(item, ['materialType', 'name'], '')} />
                    </Col>
                  </Row>
                  <Row>
                    <Col smOffset={0} sm={4}>
                      <strong>
                        <FormattedMessage id="ui-inventory.itemCallNumber" />
                      </strong>
                    </Col>
                  </Row>
                  <Row>
                    <Col sm={2}>
                      <KeyValue
                        label={<FormattedMessage id="ui-inventory.callNumberType" />}
                        value={refLookup(referenceTables.callNumberTypes, get(item, ['itemLevelCallNumberTypeId'])).name}
                      />
                    </Col>
                    <Col sm={2}>
                      <KeyValue
                        label={<FormattedMessage id="ui-inventory.callNumberPrefix" />}
                        value={item.itemLevelCallNumberPrefix}
                      />
                    </Col>
                    <Col sm={2}>
                      <KeyValue
                        label={<FormattedMessage id="ui-inventory.callNumber" />}
                        value={item.itemLevelCallNumber}
                      />
                    </Col>
                    <Col sm={2}>
                      <KeyValue
                        label={<FormattedMessage id="ui-inventory.callNumberSuffix" />}
                        value={item.itemLevelCallNumberSuffix}
                      />
                    </Col>
                  </Row>
                  <Row>
                    {(item.copyNumbers && item.copyNumbers.length > 0) &&
                      <Col smOffset={0} sm={2}>
                        <KeyValue
                          label={<FormattedMessage id="ui-inventory.copyNumber" />}
                          value={get(item, 'copyNumbers[0]', '')}
                        />
                      </Col>
                    }
                    {(item.numberOfPieces) &&
                      <Col smOffset={0} sm={2}>
                        <KeyValue
                          label={<FormattedMessage id="ui-inventory.numberOfPieces" />}
                          value={get(item, ['numberOfPieces'], '-')}
                        />
                      </Col>
                    }
                    <Col smOffset={0} sm={4}>
                      <KeyValue
                        label={<FormattedMessage id="ui-inventory.descriptionOfPieces" />}
                        value={get(item, ['descriptionOfPieces'], '-')}
                      />
                    </Col>
                  </Row>
                </Accordion>
                <Accordion
                  open={accordions.acc03}
                  id="acc03"
                  onToggle={this.handleAccordionToggle}
                  label={<FormattedMessage id="ui-inventory.enumerationData" />}
                >
                  <Row>
                    {(item.enumeration) &&
                      <Col smOffset={0} sm={4}>
                        <KeyValue
                          label={<FormattedMessage id="ui-inventory.enumeration" />}
                          value={get(item, ['enumeration'], '')}
                        />
                      </Col>
                    }
                    {(item.chronology) &&
                      <Col smOffset={0} sm={4}>
                        <KeyValue
                          label={<FormattedMessage id="ui-inventory.chronology" />}
                          value={get(item, ['chronology'], '')}
                        />
                      </Col>
                    }
                  </Row>
                  <Row>
                    {(item.volume) &&
                      <Col smOffset={0} sm={4}>
                        <KeyValue
                          label={<FormattedMessage id="ui-inventory.volume" />}
                          value={get(item, ['volume'], '')}
                        />
                      </Col>
                    }
                  </Row>
                  <Row>
                    {(item.yearCaption && item.yearCaption.length > 0) &&
                      <Col smOffset={0} sm={8}>
                        <KeyValue
                          label={<FormattedMessage id="ui-inventory.yearCaption" />}
                          value={get(item, ['yearCaption'], []).map((line, i) => <div key={i}>{line}</div>)}
                        />
                      </Col>
                    }
                  </Row>
                </Accordion>
                <Accordion
                  open={accordions.acc04}
                  id="acc04"
                  onToggle={this.handleAccordionToggle}
                  label={<FormattedMessage id="ui-inventory.condition" />}
                >
                  <Row>
                    {(item.numberOfMissingPieces) &&
                      <Col smOffset={0} sm={4}>
                        <KeyValue
                          label={<FormattedMessage id="ui-inventory.numberOfMissingPieces" />}
                          value={get(item, ['numberOfMissingPieces'], '')}
                        />
                      </Col>
                    }
                    {(item.missingPieces) &&
                      <Col smOffset={0} sm={4}>
                        <KeyValue
                          label={<FormattedMessage id="ui-inventory.missingPieces" />}
                          value={get(item, ['missingPieces'], '')}
                        />
                      </Col>
                    }
                    {(item.missingPiecesDate) &&
                      <Col smOffset={0} sm={4}>
                        <KeyValue
                          label={<FormattedMessage id="ui-inventory.date" />}
                          value={get(item, ['missingPiecesDate'], '')}
                        />
                      </Col>
                    }
                  </Row>
                  <Row>
                    {(item.itemDamagedStatusId) &&
                      <Col smOffset={0} sm={4}>
                        <KeyValue
                          label={<FormattedMessage id="ui-inventory.itemDamagedStatus" />}
                          value={refLookup(referenceTables.itemDamagedStatuses, get(item, ['itemDamagedStatusId'])).name}
                        />
                      </Col>
                    }
                    {(item.itemDamagedStatusDate) &&
                      <Col smOffset={0} sm={4}>
                        <KeyValue
                          label={<FormattedMessage id="ui-inventory.date" />}
                          value={<FormattedDate value={item.itemDamagedStatusDate} />}
                        />
                      </Col>
                    }
                  </Row>
                </Accordion>
                <Accordion
                  open={accordions.acc05}
                  id="acc05"
                  onToggle={this.handleAccordionToggle}
                  label={<FormattedMessage id="ui-inventory.itemNotes" />}
                >
                  {layoutNotes(referenceTables.itemNoteTypes, get(item, ['notes'], []))}
                </Accordion>
                <Accordion
                  open={accordions.acc06}
                  id="acc06"
                  onToggle={this.handleAccordionToggle}
                  label={<FormattedMessage id="ui-inventory.item.loanAndAvailability" />}
                >
                  <Row>
                    {(item.permanentLoanType) &&
                      <Col smOffset={0} sm={4}>
                        <KeyValue
                          label={<FormattedMessage id="ui-inventory.permanentLoantype" />}
                          value={get(item, ['permanentLoanType', 'name'], '')}
                        />
                      </Col>
                    }
                    {(item.temporaryLoanType) &&
                      <Col smOffset={0} sm={4}>
                        <KeyValue
                          label={<FormattedMessage id="ui-inventory.temporaryLoantype" />}
                          value={get(item, ['temporaryLoanType', 'name'], '')}
                        />
                      </Col>
                    }
                  </Row>
                  <Row>
                    <Col smOffset={0} sm={4}>
                      <KeyValue
                        label={<FormattedMessage id="ui-inventory.item.availability.itemStatus" />}
                        value={loanLink}
                      />
                    </Col>
                    <Col smOffset={0} sm={4}>
                      <KeyValue label={<FormattedMessage id="ui-inventory.item.availability.itemStatusDate" />}>
                        {itemStatusDate ? <FormattedTime value={itemStatusDate} day="numeric" month="numeric" year="numeric" /> : '-'}
                      </KeyValue>
                    </Col>
                    <Col smOffset={0} sm={4}>
                      <KeyValue
                        label={<FormattedMessage id="ui-inventory.item.availability.requests" />}
                        value={requestLink}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col smOffset={0} sm={4}>
                      <KeyValue
                        label={<FormattedMessage id="ui-inventory.item.availability.borrower" />}
                        value={borrowerLink}
                      />
                    </Col>
                    <Col smOffset={0} sm={4}>
                      <KeyValue label={<FormattedMessage id="ui-inventory.item.availability.loanDate" />}>
                        {this.state.loan ? <FormattedTime value={this.state.loan.loanDate} day="numeric" month="numeric" year="numeric" /> : '-'}
                      </KeyValue>
                    </Col>
                    <Col smOffset={0} sm={4}>
                      <KeyValue label={<FormattedMessage id="ui-inventory.item.availability.dueDate" />}>
                        {this.state.loan ? <FormattedTime value={this.state.loan.dueDate} day="numeric" month="numeric" year="numeric" /> : '-'}
                      </KeyValue>
                    </Col>
                  </Row>
                  {layoutCirculationNotes(['Check out', 'Check in'], get(item, ['circulationNotes'], []))}
                </Accordion>
                <Accordion
                  open={accordions.acc07}
                  id="acc07"
                  onToggle={this.handleAccordionToggle}
                  label={<FormattedMessage id="ui-inventory.location" />}
                >
                  <Row>
                    <Col smOffset={0} sm={4}>
                      <strong>
                        <FormattedMessage id="ui-inventory.holdingsLocation" />
                      </strong>
                    </Col>
                  </Row>
                  <br />
                  <Row>
                    <Col smOffset={0} sm={4}>
                      <KeyValue
                        label={<FormattedMessage id="ui-inventory.permanentLocation" />}
                        value={get(permanentHoldingsLocation, ['name'], '')}
                      />
                    </Col>
                    <Col sm={4}>
                      <KeyValue
                        label={<FormattedMessage id="ui-inventory.temporaryLocation" />}
                        value={get(temporaryHoldingsLocation, ['name'], '-')}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col smOffset={0} sm={4}>
                      <strong>
                        <FormattedMessage id="ui-inventory.itemLocation" />
                      </strong>
                    </Col>
                  </Row>
                  <br />
                  <Row>
                    <Col smOffset={0} sm={4}>
                      <KeyValue
                        label={<FormattedMessage id="ui-inventory.permanentLocation" />}
                        value={get(item, ['permanentLocation', 'name'], '-')}
                      />
                    </Col>
                    <Col sm={4}>
                      <KeyValue
                        label={<FormattedMessage id="ui-inventory.temporaryLocation" />}
                        value={get(item, ['temporaryLocation', 'name'], '-')}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col smOffset={0} sm={4}>
                      <strong>
                        <FormattedMessage id="ui-inventory.effectiveLocation" />
                      </strong>
                    </Col>
                  </Row>
                  <br />
                  <Row>
                    <Col smOffset={0} sm={4}>
                      {get(item, ['effectiveLocation', 'name'], '')}
                    </Col>
                  </Row>
                </Accordion>
                <Accordion
                  open={accordions.acc08}
                  id="acc08"
                  onToggle={this.handleAccordionToggle}
                  label={<FormattedMessage id="ui-inventory.electronicAccess" />}
                >
                  {(item.electronicAccess && item.electronicAccess.length > 0) && (
                    <MultiColumnList
                      id="list-electronic-access"
                      contentData={item.electronicAccess}
                      visibleColumns={['URL relationship', 'URI', 'Link text', 'Materials specified', 'URL public note']}
                      columnMapping={{
                        'URL relationship': intl.formatMessage({ id: 'ui-inventory.URLrelationship' }),
                        'URI': intl.formatMessage({ id: 'ui-inventory.uri' }),
                        'Link text': intl.formatMessage({ id: 'ui-inventory.linkText' }),
                        'Materials specified': intl.formatMessage({ id: 'ui-inventory.materialsSpecification' }),
                        'URL public note': intl.formatMessage({ id: 'ui-inventory.urlPublicNote' }),
                      }}
                      formatter={{
                        'URL relationship': x => refLookup(referenceTables.electronicAccessRelationships, get(x, ['relationshipId'])).name,
                        'URI': x => <a href={get(x, ['uri'])}>{get(x, ['uri'])}</a>,
                        'Link text': x => get(x, ['linkText']) || '',
                        'Materials specified': x => get(x, ['materialsSpecification']) || '',
                        'URL public note': x => get(x, ['publicNote']) || '',
                      }}
                      ariaLabel={intl.formatMessage({ id: 'ui-inventory.electronicAccess' })}
                      containerRef={(ref) => { this.resultsList = ref; }}
                    />
                  )}
                </Accordion>

              </Pane>
            </Layer>
            <Layer
              isOpen={query.layer ? query.layer === 'editItem' : false}
              contentLabel={intl.formatMessage({ id: 'ui-inventory.editItemDialog' })}
            >
              <ItemForm
                form={`itemform_${item.id}`}
                onSubmit={(record) => { this.saveItem(record); }}
                initialValues={item}
                onCancel={this.onClickCloseEditItem}
                okapi={okapi}
                instance={instance}
                holdingsRecord={holdingsRecord}
                referenceTables={referenceTables}
                stripes={this.props.stripes}
              />
            </Layer>
            <Layer
              isOpen={query.layer === 'copyItem'}
              contentLabel={intl.formatMessage({ id: 'ui-inventory.copyItemDialog' })}
            >
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
                stripes={this.props.stripes}
              />
            </Layer>
          </div>
        )
      }
      </IntlConsumer>
    );
  }
}

ViewItem.propTypes = {
  stripes: PropTypes.shape({
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
    items: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object),
    }),
    holdingsRecords: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object),
    }),
    callNumberTypes: PropTypes.shape({
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
      DELETE: PropTypes.func.isRequired,
    }),
    requests: PropTypes.shape({
      PUT: PropTypes.func.isRequired,
    }),
    requestOnItem: PropTypes.shape({
      replace: PropTypes.func.isRequired,
    }),
    query: PropTypes.object.isRequired,
  }),
  onCloseViewItem: PropTypes.func.isRequired,
  updateLocation: PropTypes.func.isRequired,
  goTo: PropTypes.func.isRequired,
};

export default withLocation(stripesConnect(ViewItem));
