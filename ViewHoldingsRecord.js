import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import queryString from 'query-string';

import Layer from '@folio/stripes-components/lib/Layer';
import Pane from '@folio/stripes-components/lib/Pane';
import PaneMenu from '@folio/stripes-components/lib/PaneMenu';
import KeyValue from '@folio/stripes-components/lib/KeyValue';
import { Row, Col } from 'react-flexbox-grid';
import Icon from '@folio/stripes-components/lib/Icon';
import transitionToParams from '@folio/stripes-components/util/transitionToParams';

import utils from './utils';

import HoldingsForm from './edit/holdings/HoldingsForm';

class ViewHoldingsRecord extends React.Component {

  static manifest = Object.freeze({
    holdingsRecords: {
      type: 'okapi',
      path: 'holdings-storage/holdings/:{holdingsrecordid}',
    },
    instances1: {
      type: 'okapi',
      path: 'instance-storage/instances/:{id}',
    },
    shelfLocations: {
      type: 'okapi',
      records: 'shelflocations',
      path: 'shelf-locations',
    },
    platforms: {
      type: 'okapi',
      path: 'platforms',
      records: 'platforms',
    },
  });

  // Edit Holdings records handlers
  onClickEditHoldingsRecord = (e) => {
    if (e) e.preventDefault();
    transitionToParams.bind(this)({ layer: 'editHoldingsRecord' });
  }

  onClickCloseEditHoldingsRecord = (e) => {
    if (e) e.preventDefault();
    utils.removeQueryParam('layer', this.props.location, this.props.history);
  }

  updateHoldingsRecord = (holdingsRecord) => {
    const holdings = holdingsRecord;
    if (holdings.permanentLocationId === '') delete holdings.permanentLocationId;
    if (holdings.platformId === '') delete holdings.platformId;
    this.props.mutator.holdingsRecords.PUT(holdings).then(() => {
      this.onClickCloseEditHoldingsRecord();
    });
  }

  render() {
    const { resources: { holdingsRecords, instances1, shelfLocations, platforms },
        referenceTables,
        okapi } = this.props;

    if (!holdingsRecords || !holdingsRecords.hasLoaded
        || !instances1 || !instances1.hasLoaded
        || !shelfLocations || !shelfLocations.hasLoaded
        || !platforms || !platforms.hasLoaded) return <div>Awaiting resources</div>;

    const holdingsRecord = holdingsRecords.records[0];
    const instance = instances1.records[0];
    const locations = shelfLocations.records;
    referenceTables.shelfLocations = locations;
    referenceTables.platforms = platforms.records;

    const query = location.search ? queryString.parse(location.search) : {};
    const that = this;

    const detailMenu = (
      <PaneMenu>
        <button id="clickable-edit-holdingsrecord" onClick={this.onClickEditHoldingsRecord} title="Edit Holdings"><Icon icon="edit" />Edit</button>
      </PaneMenu>
    );

    return (
      <div>
        <Layer isOpen label="View Holdings Record">
          <Pane
            defaultWidth={this.props.paneWidth}
            paneTitle={
              <div style={{ textAlign: 'center' }}>
                <strong>{instance.title}</strong>
                {(instance.publication && instance.publication.length > 0) &&
                  <div>
                    <em>{instance.publication[0].publisher}{instance.publication[0].dateOfPublication ? `, ${instance.publication[0].dateOfPublication}` : ''}</em>
                  </div>
                }
              </div>
            }
            lastMenu={detailMenu}
            dismissible
            onClose={this.props.onCloseViewHoldingsRecord}
          >
            <Row>
              <Col sm={1}>
                <KeyValue label="Call number" value={_.get(holdingsRecord, ['callNumber'], '')} />
              </Col>
              <Col sm={1}>
                <KeyValue label="Permanent location" value={holdingsRecord.permanentLocationId ? locations.find(loc => holdingsRecord.permanentLocationId === loc.id).name : null} />
              </Col>
              <Col sm={1}>
                <KeyValue label="Platform" value={_.get(holdingsRecord, ['electronicLocation', 'platformId'], '') ? platforms.records.find(platform => _.get(holdingsRecord, ['electronicLocation', 'platformId']) === platform.id).name : null} />
              </Col>
              <Col sm={1}>
                <KeyValue label="URI" value={_.get(holdingsRecord, ['electronicLocation', 'uri'], '')} />
              </Col>
              <Col sm={2}>
                <KeyValue label="Holdings statements" value={_.get(holdingsRecord, ['holdingsStatements'], []).join(', ')} />
              </Col>
            </Row>
          </Pane>
        </Layer>
        <Layer isOpen={query.layer ? (query.layer === 'editHoldingsRecord') : false} label="Edit Holdings Record Dialog">
          <HoldingsForm
            initialValues={holdingsRecord}
            onSubmit={(record) => { that.updateHoldingsRecord(record); }}
            onCancel={this.onClickCloseEditHoldingsRecord}
            okapi={okapi}
            instance={instance}
            referenceTables={referenceTables}
          />
        </Layer>
      </div>
    );
  }
}

ViewHoldingsRecord.propTypes = {
  resources: PropTypes.shape({
    instances1: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object),
    }),
    holdingsRecords: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object),
    }),
    shelfLocations: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object),
    }),
    platforms: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object),
    }),
  }).isRequired,
  location: PropTypes.object,
  okapi: PropTypes.object,
  paneWidth: PropTypes.string,
  history: PropTypes.object,
  referenceTables: PropTypes.object.isRequired,
  mutator: PropTypes.shape({
    holdingsRecords: PropTypes.shape({
      PUT: PropTypes.func.isRequired,
    }),
  }),
  onCloseViewHoldingsRecord: PropTypes.func.isRequired,
};


export default ViewHoldingsRecord;
