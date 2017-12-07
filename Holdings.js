import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { Row, Col } from '@folio/stripes-components/lib/LayoutGrid';
import KeyValue from '@folio/stripes-components/lib/KeyValue';
import Layer from '@folio/stripes-components/lib/Layer';
import Button from '@folio/stripes-components/lib/Button';

import HoldingsForm from './edit/holdings/HoldingsForm';
import ItemsPerHoldingsRecord from './ItemsPerHoldingsRecord';

class Holdings extends React.Component {

  static manifest = Object.freeze({
    addHoldingsMode: { initialValue: { mode: false } },
    holdings: {
      type: 'okapi',
      records: 'holdingsRecords',
      path: 'holdings-storage/holdings?query=(instanceId=:{instanceid})',
    },
    shelfLocations: {
      type: 'okapi',
      records: 'shelflocations',
      path: 'shelf-locations',
    },
    platforms: {
      type: 'okapi',
      records: 'platforms',
      path: 'platforms',
    },
  });

  constructor(props) {
    super(props);
    this.cItems = this.props.stripes.connect(ItemsPerHoldingsRecord);
  }

  onClickAddNewHoldingsRecord = (e) => {
    if (e) e.preventDefault();
    console.log('clicked "add new holdings record"');
    this.props.mutator.addHoldingsMode.replace({ mode: true });
  }

  onClickCloseNewHoldingsRecord = (e) => {
    if (e) e.preventDefault();
    console.log('clicked "close new holdings record"');
    this.props.mutator.addHoldingsMode.replace({ mode: false });
  }

  createHoldingsRecord = (holdingsRecord) => {
    // POST item record
    console.log(`Creating new holdings record: ${JSON.stringify(holdingsRecord)}`);
    this.props.mutator.holdings.POST(holdingsRecord);
    this.onClickCloseNewHoldingsRecord();
  }


  render() {
    const { okapi, resources: { holdings, addHoldingsMode, shelfLocations, platforms }, instance } = this.props;

    if (!holdings || !holdings.hasLoaded || !shelfLocations || !shelfLocations.hasLoaded) return <div />;

    const holdingsRecords = holdings.records;

    const referenceTables = this.props.referenceTables;
    referenceTables.shelfLocations = (shelfLocations || {}).records || [];
    referenceTables.platforms = (platforms || {}).records || [];

    const that = this;
    const newHoldingsRecordButton = <div style={{ textAlign: 'right' }}><Button id="clickable-new-holdings-record" onClick={this.onClickAddNewHoldingsRecord} title="+ Holdings" buttonStyle="primary paneHeaderNewButton">+ New holdings</Button></div>;


    return (
      <div>
        {newHoldingsRecordButton}
        {holdingsRecords.map(record =>
          <div key={`holdingsrecord_${record.id}`}>
            <Row>
              <Col sm={3}>
                <KeyValue label="Callnumber" value={record.callNumber} />
              </Col>
              { record.permanentLocationId ?
                <Col sm={7}>
                  <KeyValue label="Permanent location" value={referenceTables.shelfLocations.find(loc => record.permanentLocationId === loc.id).name} />
                </Col>
                :
                <Col sm={7}>
                  <KeyValue
                    label="Platform"
                    value={_.get(record, ['electronicLocation', 'platformId'], null) ?
                           (referenceTables.platforms.find(platform => _.get(record, ['electronicLocation', 'platformId'], '') === platform.id).name)
                           :
                           null}
                  />
                  <KeyValue label="URI" value={_.get(record, ['electronicLocation', 'uri'], '')} />
                </Col>
               }

            </Row>
            {_.get(record, ['holdingsStatements']).length ?
              <Row>
                <Col xs={12} smOffset={1}>
                  <KeyValue label="Statements" value={_.get(record, ['holdingsStatements'], '')} />
                </Col>
              </Row>
              :
              null}
            <Row>
              <Col sm={11} smOffset={1}>
                <that.cItems key={`items_${record.id}`} holdingsRecord={record} {...that.props} />
              </Col>
            </Row>
            <br />
          </div>,
        )}
        <Layer isOpen={addHoldingsMode ? addHoldingsMode.mode : false} label="Add New Holdings Dialog">
          <HoldingsForm
            initialValues={{ instanceId: instance.id }}
            onSubmit={(record) => { that.createHoldingsRecord(record); }}
            onCancel={this.onClickCloseNewHoldingsRecord}
            okapi={okapi}
            instance={instance}
            referenceTables={referenceTables}
          />
        </Layer>

      </div>
    );
  }
}

Holdings.propTypes = {
  resources: PropTypes.shape({
    holdings: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object),
    }),
  }),
  instance: PropTypes.object,
  referenceTables: PropTypes.object.isRequired,
  stripes: PropTypes.shape({
    connect: PropTypes.func.isRequired,
    locale: PropTypes.string.isRequired,
  }).isRequired,
  mutator: PropTypes.shape({
    addHoldingsMode: PropTypes.shape({
      replace: PropTypes.func,
    }),
    holdings: PropTypes.shape({
      POST: PropTypes.func,
    }),
  }),
  okapi: PropTypes.object,
};

export default Holdings;
