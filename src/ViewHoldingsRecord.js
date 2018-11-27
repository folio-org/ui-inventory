import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { FormattedMessage } from 'react-intl';
import queryString from 'query-string';
import {
  Layer,
  Pane,
  PaneMenu,
  Row,
  Col,
  Accordion,
  ExpandAllButton,
  KeyValue,
  Headline,
  IconButton,
  AppIcon,
  MultiColumnList,
  Icon,
  Button,
} from '@folio/stripes/components';
import { ViewMetaData } from '@folio/stripes/smart-components';
import { craftLayerUrl } from './utils';
import HoldingsForm from './edit/holdings/HoldingsForm';

class ViewHoldingsRecord extends React.Component {
  static manifest = Object.freeze({
    query: {},
    permanentLocationQuery: {},
    temporaryLocationQuery: {},
    holdingsRecords: {
      type: 'okapi',
      path: 'holdings-storage/holdings/:{holdingsrecordid}',
      POST: {
        path: 'holdings-storage/holdings',
      },
    },
    instances1: {
      type: 'okapi',
      path: 'inventory/instances/:{id}',
    },
    permanentLocation: {
      type: 'okapi',
      path: 'locations/%{permanentLocationQuery.id}',
    },
    temporaryLocation: {
      type: 'okapi',
      path: 'locations/%{temporaryLocationQuery.id}',
    },
    illPolicies: {
      type: 'okapi',
      path: 'ill-policies',
      records: 'illPolicies',
    },
    holdingsTypes: {
      type: 'okapi',
      path: 'holdings-types',
      records: 'holdingsTypes',
    },
    callNumberTypes: {
      type: 'okapi',
      path: 'call-number-types',
      records: 'callNumberTypes',
    },
    holdingsNoteTypes: {
      type: 'okapi',
      path: 'holdings-note-types',
      records: 'holdingsNoteTypes',
    },
  });

  constructor(props) {
    super(props);
    this.state = {
      accordions: {
        accordion01: true,
        accordion02: true,
        accordion03: true,
        accordion04: true,
        accordion05: true,
        accordion06: true,
        accordion07: true,
      },
    };
    this.craftLayerUrl = craftLayerUrl.bind(this);
    this.cViewMetaData = props.stripes.connect(ViewMetaData);
  }

  static getDerivedStateFromProps(nextProps) {
    const { resources } = nextProps;
    const holdingsRecords = (resources.holdingsRecords || {}).records || [];
    const permanentLocationQuery = resources.permanentLocationQuery;
    const temporaryLocationQuery = resources.temporaryLocationQuery;
    const holding = holdingsRecords[0];

    if (holding && holding.permanentLocationId
      && (!permanentLocationQuery.id || permanentLocationQuery.id !== holding.permanentLocationId)) {
      nextProps.mutator.permanentLocationQuery.update({ id: holding.permanentLocationId });
    }
    if (holding && holding.temporaryLocationId
      && (!temporaryLocationQuery.id || temporaryLocationQuery.id !== holding.temporaryLocationId)) {
      nextProps.mutator.temporaryLocationQuery.update({ id: holding.temporaryLocationId });
    }

    return null;
  }

  // Edit Holdings records handlers
  onClickEditHoldingsRecord = (e) => {
    if (e) e.preventDefault();
    this.props.mutator.query.update({ layer: 'editHoldingsRecord' });
  }

  onClickCloseEditHoldingsRecord = (e) => {
    if (e) e.preventDefault();
    this.props.mutator.query.update({ layer: null });
  }

  updateHoldingsRecord = (holdingsRecord) => {
    const holdings = holdingsRecord;
    if (holdings.permanentLocationId === '') delete holdings.permanentLocationId;
    this.props.mutator.holdingsRecords.PUT(holdings).then(() => {
      this.onClickCloseEditHoldingsRecord();
    });
  }

  copyHoldingsRecord = (holdingsRecord) => {
    const { resources: { instances1 } } = this.props;
    const instance = instances1.records[0];

    this.props.mutator.holdingsRecords.POST(holdingsRecord).then((data) => {
      this.props.mutator.query.update({
        _path: `/inventory/view/${instance.id}/${data.id}`,
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

  onCopy(record) {
    this.setState((state) => {
      const newState = _.cloneDeep(state);
      newState.copiedRecord = _.omit(record, ['id']);
      return newState;
    });

    this.props.mutator.query.update({ layer: 'copyHoldingsRecord' });
  }

  refLookup = (referenceTable, id) => {
    const ref = (referenceTable && id) ? referenceTable.find(record => record.id === id) : {};
    return ref || {};
  }

  getPaneHeaderActionMenu = ({ onToggle }) => {
    const {
      resources,
    } = this.props;

    const firstRecordOfHoldings = resources.holdingsRecords.records[0];

    return (
      <Fragment>
        <Button
          id="edit-holdings"
          onClick={() => {
            onToggle();
            this.onClickEditHoldingsRecord();
          }}
          href={this.craftLayerUrl('editHoldingsRecord')}
          buttonStyle="dropdownItem"
        >
          <Icon icon="edit">
            <FormattedMessage id="ui-inventory.editHoldings" />
          </Icon>
        </Button>
        <Button
          id="copy-holdings"
          onClick={() => {
            onToggle();
            this.onCopy(firstRecordOfHoldings);
          }}
          buttonStyle="dropdownItem"
        >
          <Icon icon="duplicate">
            <FormattedMessage id="ui-inventory.duplicateHoldings" />
          </Icon>
        </Button>
      </Fragment>
    );
  }

  render() {
    const { location, resources: { holdingsRecords, instances1, illPolicies, holdingsTypes, callNumberTypes, holdingsNoteTypes, permanentLocation, temporaryLocation }, referenceTables, okapi } = this.props;

    if (!holdingsRecords || !holdingsRecords.hasLoaded) return <div>Awaiting resources</div>;

    const holdingsRecord = holdingsRecords.records[0];

    if (!instances1 || !instances1.hasLoaded
        || (holdingsRecord.permanentLocationId && (!permanentLocation || !permanentLocation.hasLoaded))
        || (holdingsRecord.temporaryLocationId && (!temporaryLocation || !temporaryLocation.hasLoaded))
        || !illPolicies || !illPolicies.hasLoaded
        || !holdingsTypes || !holdingsTypes.hasLoaded
        || !callNumberTypes || !callNumberTypes.hasLoaded
        || !holdingsNoteTypes || !holdingsNoteTypes.hasLoaded) return <div>Awaiting resources</div>;

    const instance = instances1.records[0];
    const holdingsPermanentLocation = holdingsRecord.permanentLocationId ? permanentLocation.records[0] : null;
    const holdingsTemporaryLocation = holdingsRecord.temporaryLocationId ? temporaryLocation.records[0] : null;

    referenceTables.illPolicies = illPolicies.records;
    referenceTables.holdingsTypes = holdingsTypes.records;
    referenceTables.callNumberTypes = callNumberTypes.records;
    referenceTables.holdingsNoteTypes = holdingsNoteTypes.records;

    const query = location.search ? queryString.parse(location.search) : {};
    const that = this;
    const formatMsg = this.props.stripes.intl.formatMessage;

    const detailMenu = (
      <PaneMenu>
        <IconButton
          icon="edit"
          id="clickable-edit-holdingsrecord"
          style={{ visibility: !holdingsRecord ? 'hidden' : 'visible' }}
          href={this.craftLayerUrl('editHoldingsRecord')}
          onClick={this.onClickEditHoldingsRecord}
          title={formatMsg({ id: 'ui-inventory.editHoldings' })}
        />
      </PaneMenu>
    );

    return (
      <div>
        <Layer isOpen label={formatMsg({ id: 'ui-inventory.viewHoldingsRecord' })}>
          <div data-test-holdings-view-page>
            <Pane
              defaultWidth={this.props.paneWidth}
              paneTitle={
                <div
                  style={{ textAlign: 'center' }}
                  data-test-header-title
                >
                  <AppIcon app="inventory" iconKey="holdings" size="small" />
                  <strong>
                    {holdingsRecord.permanentLocationId ? `${holdingsPermanentLocation.name} >` : null}
                    {' '}
                    {_.get(holdingsRecord, ['callNumber'], '')}
                  </strong>
                  &nbsp;
                  <div>
                    {formatMsg({ id: 'ui-inventory.holdings' })}
                  </div>
                </div>
              }
              lastMenu={detailMenu}
              dismissible
              onClose={this.props.onCloseViewHoldingsRecord}
              actionMenu={this.getPaneHeaderActionMenu}
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
                </Col>
              </Row>
              <hr />
              <Row end="xs"><Col xs><ExpandAllButton accordionStatus={this.state.accordions} onToggle={this.handleExpandAll} /></Col></Row>
              <Accordion
                open={this.state.accordions.accordion01}
                id="accordion01"
                onToggle={this.handleAccordionToggle}
                label={formatMsg({ id: 'ui-inventory.administrativeData' })}
              >
                { (holdingsRecord.metadata && holdingsRecord.metadata.createdDate) &&
                <this.cViewMetaData metadata={holdingsRecord.metadata} />
                }
                <Row>
                  <Col sm={12}>
                    <AppIcon app="inventory" iconKey="holdings" size="small" />
                    {' '}
                    {formatMsg({ id: 'ui-inventory.holdingsRecord' })}
                  </Col>
                </Row>
                <Row>
                  <Col sm={12}>
                    <Headline size="small" margin="small">
                      {holdingsRecord.permanentLocationId ? holdingsPermanentLocation.name : null}
                      {' '}
                      &gt;
                      {_.get(holdingsRecord, ['callNumber'], '')}
                    </Headline>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12}>
                    {holdingsRecord.discoverySuppress && formatMsg({ id: 'ui-inventory.discoverySuppress' })}
                  </Col>
                </Row>
                <br />
                <Row>
                  <Col smOffset={0} sm={4}>
                    <KeyValue label={formatMsg({ id: 'ui-inventory.holdingsHrid' })} value={_.get(holdingsRecord, ['hrid'], '')} />
                  </Col>
                  <Col>
                    <KeyValue label={formatMsg({ id: 'ui-inventory.formerHoldingsId' })} value={_.get(holdingsRecord, ['formerIds'], []).map((hid, i) => <div key={i}>{hid}</div>)} />
                  </Col>
                </Row>
                <Row>
                  <Col sm={4}>
                    <KeyValue
                      label={formatMsg({ id: 'ui-inventory.holdingsType' })}
                      value={this.refLookup(referenceTables.holdingsTypes, _.get(holdingsRecord, ['holdingsTypeId'])).name}
                    />
                  </Col>
                </Row>
              </Accordion>
              <Accordion
                open={this.state.accordions.accordion02}
                id="accordion02"
                onToggle={this.handleAccordionToggle}
                label={formatMsg({ id: 'ui-inventory.locations' })}
              >
                <Row>
                  <Col smOffset={0} sm={4}>
                    <strong>{formatMsg({ id: 'ui-inventory.holdingsLocation' })}</strong>
                  </Col>
                </Row>
                <br />
                { ((holdingsRecord.permanentLocationId) || (holdingsRecord.temporaryLocationId)) &&
                  <Row>
                    <Col smOffset={0} sm={4}>
                      <KeyValue label={formatMsg({ id: 'ui-inventory.permanent' })} value={holdingsPermanentLocation.name} />
                    </Col>
                    <Col>
                      <KeyValue label={formatMsg({ id: 'ui-inventory.temporary' })} value={holdingsTemporaryLocation ? holdingsTemporaryLocation.name : '-'} />
                    </Col>
                  </Row>
                }
                <Row>
                  <Col sm={2}>
                    <KeyValue label={formatMsg({ id: 'ui-inventory.shelvingOrder' })} value={holdingsRecord.shelvingOrder} />
                  </Col>
                  <Col>
                    <KeyValue label={formatMsg({ id: 'ui-inventory.shelvingTitle' })} value={holdingsRecord.shelvingTitle} />
                  </Col>
                </Row>
                <Row>
                  <Col smOffset={0} sm={4}>
                    <strong>{formatMsg({ id: 'ui-inventory.holdingsCallNumber' })}</strong>
                  </Col>
                </Row>
                <Row>
                  <Col sm={2}>
                    <KeyValue label={formatMsg({ id: 'ui-inventory.copyNumber' })} value={holdingsRecord.copyNumber} />
                  </Col>
                  <Col sm={2}>
                    <KeyValue
                      label={formatMsg({ id: 'ui-inventory.callNumberType' })}
                      value={this.refLookup(referenceTables.callNumberTypes, _.get(holdingsRecord, ['callNumberTypeId'])).name}
                    />
                  </Col>
                  <Col sm={2}>
                    <KeyValue label={formatMsg({ id: 'ui-inventory.callNumberPrefix' })} value={holdingsRecord.callNumberPrefix} />
                  </Col>
                  <Col sm={2}>
                    <KeyValue label={formatMsg({ id: 'ui-inventory.callNumber' })} value={holdingsRecord.callNumber} />
                  </Col>
                  <Col sm={2}>
                    <KeyValue label={formatMsg({ id: 'ui-inventory.callNumberSuffix' })} value={holdingsRecord.callNumberSuffix} />
                  </Col>
                </Row>
              </Accordion>
              <Accordion
                open={this.state.accordions.accordion03}
                id="accordion03"
                onToggle={this.handleAccordionToggle}
                label={formatMsg({ id: 'ui-inventory.holdingsDetails' })}
              >
                <KeyValue label={formatMsg({ id: 'ui-inventory.numberOfItems' })} value={_.get(holdingsRecord, ['numberOfItems'], [])} />
                { (holdingsRecord.holdingsStatements.length > 0) &&
                  <MultiColumnList
                    id="list-holdingsstatements"
                    contentData={holdingsRecord.holdingsStatements.map((stmt) => { return { 'statement': stmt }; })}
                    visibleColumns={['Holdings statement', 'Holdings statement note']}
                    formatter={{
                      'Holdings statement': x => _.get(x, ['statement']) || '',
                      'Holdings statement note': x => _.get(x, ['note']) || '',
                    }}
                    ariaLabel={formatMsg({ id: 'ui-inventory.holdingsStatements' })}
                    containerRef={(ref) => { this.resultsList = ref; }}
                  />
                }
                { (holdingsRecord.holdingsStatementsForSupplements.length > 0) &&
                  <MultiColumnList
                    id="list-holdingsstatementsforsupplements"
                    contentData={holdingsRecord.holdingsStatementsForSupplements}
                    visibleColumns={['Holdings statement for supplements', 'Holdings statement for supplements note']}
                    formatter={{
                      'Holdings statement for supplements': x => _.get(x, ['statement']) || '',
                      'Holdings statement for supplements note': x => _.get(x, ['note']) || '',
                    }}
                    ariaLabel={formatMsg({ id: 'ui-inventory.holdingsStatementForSupplements' })}
                    containerRef={(ref) => { this.resultsList = ref; }}
                  />
                }

                { (holdingsRecord.holdingsStatementsForIndexes.length > 0) &&
                  <MultiColumnList
                    id="list-holdingsstatementsforindexes"
                    contentData={holdingsRecord.holdingsStatementsForIndexes}
                    visibleColumns={['Holdings statement for indexes', 'Holdings statement for indexes note']}
                    formatter={{
                      'Holdings statement for indexes': x => _.get(x, ['statement']) || '',
                      'Holdings statement for indexes note': x => _.get(x, ['note']) || '',
                    }}
                    ariaLabel={formatMsg({ id: 'ui-inventory.holdingsStatementForIndexes' })}
                    containerRef={(ref) => { this.resultsList = ref; }}
                  />
                }
                <Row>
                  <Col sm={3}>
                    <KeyValue
                      label={formatMsg({ id: 'ui-inventory.illPolicy' })}
                      value={this.refLookup(referenceTables.illPolicies, _.get(holdingsRecord, ['illPolicyId'])).name}
                    />
                  </Col>
                  <Col sm={3}>
                    <KeyValue
                      label={formatMsg({ id: 'ui-inventory.digitizationPolicy' })}
                      value={_.get(holdingsRecord, ['digitizationPolicy'], '')}
                    />
                  </Col>
                  <Col sm={3}>
                    <KeyValue
                      label={formatMsg({ id: 'ui-inventory.retentionPolicy' })}
                      value={_.get(holdingsRecord, ['retentionPolicy'], '')}
                    />
                  </Col>
                </Row>
              </Accordion>
              <Accordion
                open={this.state.accordions.accordion04}
                id="accordion04"
                onToggle={this.handleAccordionToggle}
                label={formatMsg({ id: 'ui-inventory.notes' })}
              >
                <Row>
                  <Col smOffset={0} sm={4}>
                    <strong>{formatMsg({ id: 'ui-inventory.holdingsNotes' })}</strong>
                  </Col>
                </Row>
                <Row>
                  <Col sm={3}>
                    <KeyValue
                      label={formatMsg({ id: 'ui-inventory.publicNote' })}
                      value={_.get(holdingsRecord, ['notes'], []).map((note, i) => { if (note.type === 'Note' && !note.staffOnly) return <div key={i}>{note.note}</div>; else return ''; })}
                    />
                  </Col>
                  <Col sm={3}>
                    <KeyValue
                      label={formatMsg({ id: 'ui-inventory.nonPublicNote' })}
                      value={_.get(holdingsRecord, ['notes'], []).map((note, i) => { if (note.type === 'Note' && note.staffOnly) return <div key={i}>{note.note}</div>; else return ''; })}
                    />
                  </Col>
                  <Col sm={3}>
                    <KeyValue
                      label={formatMsg({ id: 'ui-inventory.actionNote' })}
                      value={_.get(holdingsRecord, ['notes'], []).map((note, i) => { if (note.type === 'action note') return <div key={i}>{note.note}</div>; else return ''; })}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col sm={3}>
                    <KeyValue
                      label={formatMsg({ id: 'ui-inventory.reproductionNote' })}
                      value={_.get(holdingsRecord, ['notes'], []).map((note, i) => { if (note.type === 'reproduction') return <div key={i}>{note.note}</div>; else return ''; })}
                    />
                  </Col>
                  <Col sm={3}>
                    <KeyValue
                      label={formatMsg({ id: 'ui-inventory.binding' })}
                      value={_.get(holdingsRecord, ['notes'], []).map((note, i) => { if (note.type === 'binding') return <div key={i}>{note.note}</div>; else return ''; })}
                    />
                  </Col>
                  <Col sm={3}>
                    <KeyValue
                      label={formatMsg({ id: 'ui-inventory.provenance' })}
                      value={_.get(holdingsRecord, ['notes'], []).map((note, i) => { if (note.type === 'provenance') return <div key={i}>{note.note}</div>; else return ''; })}
                    />
                  </Col>
                  <Col sm={3}>
                    <KeyValue
                      label={formatMsg({ id: 'ui-inventory.copyNotes' })}
                      value={_.get(holdingsRecord, ['notes'], []).map((note, i) => { if (note.type === 'copy note') return <div key={i}>{note.note}</div>; else return ''; })}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col sm={3}>
                    <KeyValue
                      label={formatMsg({ id: 'ui-inventory.acquisitionMethod' })}
                      value={_.get(holdingsRecord, ['acquisitionMethod'], '')}
                    />
                  </Col>
                  <Col sm={3}>
                    <KeyValue
                      label={formatMsg({ id: 'ui-inventory.acquisitionFormat' })}
                      value={_.get(holdingsRecord, ['acquisitionFormat'], '')}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col sm={3}>
                    <KeyValue
                      label={formatMsg({ id: 'ui-inventory.electronicBookplate' })}
                      value={_.get(holdingsRecord, ['notes'], []).map((note, i) => { if (note.type === 'electronic bookplate') return <div key={i}>{note.note}</div>; else return ''; })}
                    />
                  </Col>
                  <Col sm={3}>
                    <KeyValue label={formatMsg({ id: 'ui-inventory.receiptStatus' })} value={_.get(holdingsRecord, ['receiptStatus'], '')} />
                  </Col>
                </Row>
              </Accordion>
              <Accordion
                open={this.state.accordions.accordion05}
                id="accordion05"
                onToggle={this.handleAccordionToggle}
                label={formatMsg({ id: 'ui-inventory.acquisitions' })}
              />
              <Accordion
                open={this.state.accordions.accordion06}
                id="accordion06"
                onToggle={this.handleAccordionToggle}
                label={formatMsg({ id: 'ui-inventory.electronicAccess' })}
              >
                {(holdingsRecord.electronicAccess.length > 0) &&
                  <MultiColumnList
                    id="list-electronic-access"
                    contentData={holdingsRecord.electronicAccess}
                    visibleColumns={['URL relationship', 'URI', 'Link text', 'Materials specified', 'URL public note']}
                    formatter={{
                      'URL relationship': x => this.refLookup(referenceTables.electronicAccessRelationships, _.get(x, ['relationshipId'])).name,
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
              <Accordion
                open={this.state.accordions.accordion07}
                id="accordion07"
                onToggle={this.handleAccordionToggle}
                label={formatMsg({ id: 'ui-inventory.receivingHistory' })}
              />
            </Pane>
          </div>
        </Layer>
        <Layer isOpen={query.layer ? (query.layer === 'editHoldingsRecord') : false} label={formatMsg({ id: 'ui-inventory.editHoldingsRecordDialog' })}>
          <HoldingsForm
            initialValues={holdingsRecord}
            onSubmit={(record) => { that.updateHoldingsRecord(record); }}
            onCancel={this.onClickCloseEditHoldingsRecord}
            okapi={okapi}
            formatMsg={formatMsg}
            instance={instance}
            referenceTables={referenceTables}
            stripes={this.props.stripes}
          />
        </Layer>
        <Layer isOpen={query.layer ? (query.layer === 'copyHoldingsRecord') : false} label={formatMsg({ id: 'ui-inventory.copyHoldingsRecordDialog' })}>
          <HoldingsForm
            initialValues={this.state.copiedRecord}
            onSubmit={(record) => { that.copyHoldingsRecord(record); }}
            onCancel={this.onClickCloseEditHoldingsRecord}
            okapi={okapi}
            formatMsg={formatMsg}
            instance={instance}
            copy
            referenceTables={referenceTables}
            stripes={this.props.stripes}
          />
        </Layer>
      </div>
    );
  }
}

ViewHoldingsRecord.propTypes = {
  stripes: PropTypes.shape({
    connect: PropTypes.func.isRequired,
    intl: PropTypes.shape({
      formatMessage: PropTypes.func.isRequired,
    }),
  }).isRequired,
  resources: PropTypes.shape({
    instances1: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object),
    }),
    holdingsRecords: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object),
    }),
    locations: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object),
    }),
    permanentLocation: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object),
    }),
    temporaryLocation: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object),
    }),
    illPolicies: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object),
    }),
    holdingsTypes: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object),
    }),
  }).isRequired,
  okapi: PropTypes.object,
  location: PropTypes.object,
  paneWidth: PropTypes.string,
  referenceTables: PropTypes.object.isRequired,
  mutator: PropTypes.shape({
    holdingsRecords: PropTypes.shape({
      PUT: PropTypes.func.isRequired,
      POST: PropTypes.func.isRequired,
    }),
    query: PropTypes.object.isRequired,
    permanentLocationQuery: PropTypes.object.isRequired,
    temporaryLocationQuery: PropTypes.object.isRequired,
  }),
  onCloseViewHoldingsRecord: PropTypes.func.isRequired,
};


export default ViewHoldingsRecord;
