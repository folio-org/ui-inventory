import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import queryString from 'query-string';

import Pane from '@folio/stripes-components/lib/Pane';
import PaneMenu from '@folio/stripes-components/lib/PaneMenu';
import KeyValue from '@folio/stripes-components/lib/KeyValue';
import { Row, Col } from 'react-flexbox-grid';
import Icon from '@folio/stripes-components/lib/Icon';
import Layer from '@folio/stripes-components/lib/Layer';
import Button from '@folio/stripes-components/lib/Button';

import transitionToParams from '@folio/stripes-components/util/transitionToParams';

import utils from './utils';
import formatters from './referenceFormatters';

import Holdings from './Holdings';
import InstanceForm from './edit/InstanceForm';
import HoldingsForm from './edit/holdings/HoldingsForm';
import ViewHoldingsRecord from './ViewHoldingsRecord';
import ViewItem from './ViewItem';

const emptyObj = {};
const emptyArr = [];


class ViewInstance extends React.Component {

  static manifest = Object.freeze({
    addHoldingsMode: { initialValue: { mode: false } },
    selectedInstance: {
      type: 'okapi',
      path: 'instance-storage/instances/:{id}',
      clear: false,
    },
    holdings: {
      type: 'okapi',
      records: 'holdingsRecords',
      path: 'holdings-storage/holdings',
      fetch: false,
    },
  });

  constructor(props) {
    super(props);

    const logger = props.stripes.logger;
    this.log = logger.log.bind(logger);

    this.state = {
      accordions: {
        itemsAccordion: true,
        holdingsAccordion: true,
      },
    };
    this.cHoldings = this.props.stripes.connect(Holdings);
    this.cViewHoldingsRecord = this.props.stripes.connect(ViewHoldingsRecord);
    this.cViewItem = this.props.stripes.connect(ViewItem);
  }

  // Edit Instance Handlers
  onClickEditInstance = (e) => {
    if (e) e.preventDefault();
    transitionToParams.bind(this)({ layer: 'edit' });
  }

  onClickAddNewHoldingsRecord = (e) => {
    if (e) e.preventDefault();
    this.log('clicked "add new holdings record"');
    this.props.mutator.addHoldingsMode.replace({ mode: true });
  }

  onClickCloseNewHoldingsRecord = (e) => {
    if (e) e.preventDefault();
    this.log('clicked "close new holdings record"');
    this.props.mutator.addHoldingsMode.replace({ mode: false });
  }

  update(instance) {
    this.props.mutator.selectedInstance.PUT(instance).then(() => {
      this.closeEditInstance();
    });
  }

  closeEditInstance = (e) => {
    if (e) e.preventDefault();
    utils.removeQueryParam('layer', this.props.location, this.props.history);
  }

  closeViewItem = (e) => {
    if (e) e.preventDefault();
    this.props.history.push(`/inventory/view/${this.props.match.params.id}${this.props.location.search}`);
  }

  closeViewHoldingsRecord = (e) => {
    if (e) e.preventDefault();
    this.props.history.push(`/inventory/view/${this.props.match.params.id}${this.props.location.search}`);
  }

  createHoldingsRecord = (holdingsRecord) => {
    // POST item record
    this.log(`Creating new holdings record: ${JSON.stringify(holdingsRecord)}`);
    this.props.mutator.holdings.POST(holdingsRecord);
    this.onClickCloseNewHoldingsRecord();
  }

  handleAccordionToggle = ({ id }) => {
    this.setState((state) => {
      const newState = _.cloneDeep(state);
      newState.accordions[id] = !newState.accordions[id];
      return newState;
    });
  }

  render() {
    const { okapi, resources: { addHoldingsMode, selectedInstance }, match: { params: { id, holdingsrecordid, itemid } }, location,
            referenceTables, stripes, onCopy } = this.props;
    const query = location.search ? queryString.parse(location.search) : emptyObj;
    const selInstance = (selectedInstance || emptyObj).records || emptyArr;

    if (!selInstance || !id) return <div />;
    const instance = selInstance.find(i => i.id === id);

    const detailMenu = (
      <PaneMenu>
        <button id="clickable-show-notes" style={{ visibility: !instance ? 'hidden' : 'visible' }} onClick={this.props.notesToggle} title="Show Notes"><Icon icon="comment" />Notes</button>
        <button id="clickable-copy-instance" onClick={() => onCopy(instance)} title="Copy Instance"><Icon icon="duplicate" />Copy</button>
        <button id="clickable-edit-instance" onClick={this.onClickEditInstance} title="Edit Instance"><Icon icon="edit" />Edit</button>
      </PaneMenu>
    );

    const that = this;

    const newHoldingsRecordButton = <div style={{ textAlign: 'right' }}><Button id="clickable-new-holdings-record" onClick={this.onClickAddNewHoldingsRecord} title="+ Holdings" buttonStyle="primary paneHeaderNewButton">+ New holdings</Button></div>;

    return instance ? (
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
        onClose={this.props.onClose}
      >
        <Row>
          <Col xs={12}>
            <KeyValue label="FOLIO ID" value={_.get(instance, ['id'], '')} />
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <KeyValue label="Metadata source" value="TBA" />
          </Col>
        </Row>
        { (instance.identifiers.length > 0) &&
          <Row>
            <Col xs={12}>
              <KeyValue label="Resource identifier" value={formatters.identifiersFormatter(instance, referenceTables.identifierTypes)} />
            </Col>
          </Row>
        }
        { (instance.instanceFormatId) &&
          <Row>
            <Col xs={12}>
              <KeyValue label="Format" value={formatters.instanceFormatsFormatter(instance, referenceTables.instanceFormats)} />
            </Col>
          </Row>
        }
        <Row>
          <Col xs={12}>
            <KeyValue label="Resource title" value={_.get(instance, ['title'], '')} />
          </Col>
        </Row>
        { (instance.alternativeTitles.length > 0) &&
          <Row>
            <Col xs={12}>
              <KeyValue label="Alternative titles" value={_.get(instance, ['alternativeTitles'], []).map((title, i) => <div key={i}>{title}</div>)} />
            </Col>
          </Row>
        }
        { (instance.contributors.length > 0) &&
          <Row>
            <Col xs={12}>
              <KeyValue label="Contributor" value={formatters.contributorsFormatter(instance, referenceTables.contributorTypes)} />
            </Col>
          </Row>
        }
        { (instance.publication.length > 0) &&
          <Row>
            <Col xs={12}>
              <KeyValue label="Publisher" value={formatters.publishersFormatter(instance)} />
            </Col>
          </Row>
        }
        <Row>
          <Col xs={12}>
            <KeyValue label="Resource type" value={formatters.instanceTypesFormatter(instance, referenceTables.instanceTypes)} />
          </Col>
        </Row>
        { (instance.physicalDescriptions.length > 0) &&
          <Row>
            <Col xs={12}>
              <KeyValue label="Physical description" value={_.get(instance, ['physicalDescriptions'], []).map((desc, i) => <div key={i}>{desc}</div>)} />
            </Col>
          </Row>
        }
        { (instance.languages.length > 0) &&
          <Row>
            <Col xs={12}>
              <KeyValue label="Language" value={formatters.languagesFormatter(instance)} />
            </Col>
          </Row>
        }
        { (instance.subjects.length > 0) &&
          <Row>
            <Col xs={12}>
              <KeyValue label="Subject headings" value={_.get(instance, ['subjects'], []).map((sub, i) => <div key={i}>{sub}</div>)} />
            </Col>
          </Row>
        }
        { (instance.classifications.length > 0) &&
          <Row>
            <Col xs={12}>
              <KeyValue label="Classification" value={formatters.classificationsFormatter(instance, referenceTables.classificationTypes)} />
            </Col>
          </Row>
        }
        { (instance.notes.length > 0) &&
          <Row>
            <Col xs={12}>
              <KeyValue label="Notes" value={_.get(instance, ['notes'], []).map((note, i) => <div key={i}>{note}</div>)} />
            </Col>
          </Row>
        }
        { (!!instance.edition) &&
          <Row>
            <Col xs={12}>
              <KeyValue label="Edition" value={_.get(instance, ['edition'], '')} />
            </Col>
          </Row>
        }
        { (instance.series.length > 0) &&
          <Row>
            <Col xs={12}>
              <KeyValue label="Series Statement" value={_.get(instance, ['series'], '')} />
            </Col>
          </Row>
        }
        { (instance.urls.length > 0) &&
          <Row>
            <Col xs={12}>
              <KeyValue label="URLs" value={_.get(instance, ['urls'], []).map((url, i) => <div key={i}>{url}</div>)} />
            </Col>
          </Row>
        }
        <br />
        <Row>
          <Col><h3>Holdings</h3></Col>
          <Col sm={10}>{newHoldingsRecordButton}</Col>
        </Row>
        <br />
        { (!holdingsrecordid && !itemid) ?
          <this.cHoldings
            dataKey={id}
            id={id}
            accordionExpanded={this.state.accordions.holdingsAccordion}
            accordionId="holdingsAccordion"
            accordionToggle={this.handleAccordionToggle}
            instance={instance}
            referenceTables={referenceTables}
            match={this.props.match}
            stripes={stripes}
            location={location}
            history={this.props.history}
          />
          : null
        }
        { (holdingsrecordid && !itemid) ?
          <this.cViewHoldingsRecord {...this.props} onCloseViewHoldingsRecord={this.closeViewHoldingsRecord} />
          : null
        }
        { (holdingsrecordid && itemid) ?
          <this.cViewItem {...this.props} onCloseViewItem={this.closeViewItem} />
         : null
        }
        <br />
        <Layer isOpen={query.layer ? query.layer === 'edit' : false} label="Edit Instance Dialog">
          <InstanceForm
            onSubmit={(record) => { this.update(record); }}
            initialValues={instance}
            onCancel={this.closeEditInstance}
            referenceTables={referenceTables}
          />
        </Layer>
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
      </Pane>
    ) : null;
  }
}

ViewInstance.propTypes = {
  stripes: PropTypes.shape({
    connect: PropTypes.func.isRequired,
    locale: PropTypes.string.isRequired,
    logger: PropTypes.object.isRequired,
  }).isRequired,
  resources: PropTypes.shape({
    selectedInstance: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object),
    }),
  }).isRequired,
  match: PropTypes.shape({
    path: PropTypes.string.isRequired,
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  }),
  location: PropTypes.object,
  history: PropTypes.object,
  referenceTables: PropTypes.object.isRequired,
  mutator: PropTypes.shape({
    selectedInstance: PropTypes.shape({
      PUT: PropTypes.func.isRequired,
    }),
    editMode: PropTypes.shape({
      replace: PropTypes.func,
    }),
    addHoldingsMode: PropTypes.shape({
      replace: PropTypes.func,
    }),
    holdings: PropTypes.shape({
      POST: PropTypes.func.isRequired,
    }),
  }),
  onClose: PropTypes.func,
  onCopy: PropTypes.func,
  notesToggle: PropTypes.func,
  paneWidth: PropTypes.string.isRequired,
  okapi: PropTypes.object,
};

export default ViewInstance;
