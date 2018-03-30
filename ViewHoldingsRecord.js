import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import queryString from 'query-string';

import Layer from '@folio/stripes-components/lib/Layer';
import Pane from '@folio/stripes-components/lib/Pane';
import PaneMenu from '@folio/stripes-components/lib/PaneMenu';
import { Accordion } from '@folio/stripes-components/lib/Accordion';
import KeyValue from '@folio/stripes-components/lib/KeyValue';
import { Row, Col } from '@folio/stripes-components/lib/LayoutGrid';
import Headline from '@folio/stripes-components/lib/Headline';
import IconButton from '@folio/stripes-components/lib/IconButton';
import AppIcon from '@folio/stripes-components/lib/AppIcon';

import craftLayerUrl from '@folio/stripes-components/util/craftLayerUrl';

import HoldingsForm from './edit/holdings/HoldingsForm';

class ViewHoldingsRecord extends React.Component {
  static manifest = Object.freeze({
    query: {},
    holdingsRecords: {
      type: 'okapi',
      path: 'holdings-storage/holdings/:{holdingsrecordid}',
      POST: {
        path: 'holdings-storage/holdings',
      },
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

  constructor(props) {
    super(props);
    this.state = {
      accordions: {
        holdingsAccordion: true,
      },
    };
    this.craftLayerUrl = craftLayerUrl.bind(this);
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
    if (holdings.platformId === '') delete holdings.platformId;
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

  onCopy(record) {
    this.setState((state) => {
      const newState = _.cloneDeep(state);
      newState.copiedRecord = _.omit(record, ['id']);
      return newState;
    });

    this.props.mutator.query.update({ layer: 'copyHoldingsRecord' });
  }

  render() {
    const { location, resources: { holdingsRecords, instances1, shelfLocations, platforms }, referenceTables, okapi } = this.props;

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
        <IconButton
          id="clickable-copy-holdingsrecord"
          onClick={() => this.onCopy(holdingsRecord)}
          title="Copy Holding"
          icon="duplicate"
        />
        <IconButton
          icon="edit"
          id="clickable-edit-holdingsrecord"
          style={{ visibility: !holdingsRecord ? 'hidden' : 'visible' }}
          href={this.craftLayerUrl('editHoldingsRecord')}
          onClick={this.onClickEditHoldingsRecord}
          title="Edit Holdings"
        />
      </PaneMenu>
    );

    return (
      <div>
        <Layer isOpen label="View Holdings Record">
          <Pane
            defaultWidth={this.props.paneWidth}
            paneTitle={
              <div style={{ textAlign: 'center' }}>
                <AppIcon app="inventory" iconKey="holdings" size="small" /> <strong>{holdingsRecord.permanentLocationId ? locations.find(loc => holdingsRecord.permanentLocationId === loc.id).name : null} &gt; {_.get(holdingsRecord, ['callNumber'], '')}</strong>
                <div>
                  Holdings
                </div>
              </div>
            }
            lastMenu={detailMenu}
            dismissible
            onClose={this.props.onCloseViewHoldingsRecord}
          >
            <Row center="xs">
              <Col sm={6}>
                Instance: {instance.title}
                {(instance.publication && instance.publication.length > 0) &&
                <span><em>, </em><em>{instance.publication[0].publisher}{instance.publication[0].dateOfPublication ? `, ${instance.publication[0].dateOfPublication}` : ''}</em></span>
                }
              </Col>
            </Row>

            <Accordion
              open={this.state.accordions.holdingsAccordion}
              id="holdingsAccordion"
              onToggle={this.handleAccordionToggle}
              label="Holdings data"
            >
              <Row>
                <Col sm={12}>
                  <AppIcon app="inventory" iconKey="holdings" size="small" /> Holdings record
                </Col>
              </Row>
              <br />
              <Row>
                <Col sm={12}>
                  <Headline size="medium" margin="medium">
                    {holdingsRecord.permanentLocationId ? locations.find(loc => holdingsRecord.permanentLocationId === loc.id).name : null} &gt; {_.get(holdingsRecord, ['callNumber'], '')}
                  </Headline>
                </Col>
              </Row>
              <Row>
                <Col smOffset={1} sm={4}>
                  <KeyValue label="Holdings ID" value={_.get(holdingsRecord, ['id'], '')} />
                </Col>
              </Row>
              { (holdingsRecord.electronicLocation && holdingsRecord.electronicLocation.platformId) &&
                <Row>
                  <Col smOffset={1} sm={4}>
                    <KeyValue label="Platform" value={_.get(holdingsRecord, ['electronicLocation', 'platformId'], '') ? platforms.records.find(platform => _.get(holdingsRecord, ['electronicLocation', 'platformId']) === platform.id).name : null} />
                  </Col>
                </Row>
              }
              { (holdingsRecord.electronicLocation && holdingsRecord.electronicLocation.uri) &&
                <Row>
                  <Col smOffset={1} sm={4}>
                    <KeyValue label="URI" value={_.get(holdingsRecord, ['electronicLocation', 'uri'], '')} />
                  </Col>
                </Row>
              }
              { (holdingsRecord.holdingsStatements.length > 0) &&
                <Row>
                  <Col smOffset={1} sm={4}>
                    <KeyValue label="Holdings statements" value={_.get(holdingsRecord, ['holdingsStatements'], []).map((line, i) => <div key={i}>{line}</div>)} />
                  </Col>
                </Row>
              }
            </Accordion>
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
        <Layer isOpen={query.layer ? (query.layer === 'copyHoldingsRecord') : false} label="Copy Holdings Record Dialog">
          <HoldingsForm
            initialValues={this.state.copiedRecord}
            onSubmit={(record) => { that.copyHoldingsRecord(record); }}
            onCancel={this.onClickCloseEditHoldingsRecord}
            okapi={okapi}
            instance={instance}
            copy
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
  }),
  onCloseViewHoldingsRecord: PropTypes.func.isRequired,
};


export default ViewHoldingsRecord;
