import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import queryString from 'query-string';

import Pane from '@folio/stripes-components/lib/Pane';
import PaneMenu from '@folio/stripes-components/lib/PaneMenu';
import { Accordion, ExpandAllButton } from '@folio/stripes-components/lib/Accordion';
import KeyValue from '@folio/stripes-components/lib/KeyValue';
import { Row, Col } from '@folio/stripes-components/lib/LayoutGrid';
import Layer from '@folio/stripes-components/lib/Layer';
import Button from '@folio/stripes-components/lib/Button';
import IconButton from '@folio/stripes-components/lib/IconButton';
import Icon from '@folio/stripes-components/lib/Icon';
import MetaSection from '@folio/stripes-components/lib/MetaSection';
import Headline from '@folio/stripes-components/lib/Headline';

import transitionToParams from '@folio/stripes-components/util/transitionToParams';
import removeQueryParam from '@folio/stripes-components/util/removeQueryParam';
import craftLayerUrl from '@folio/stripes-components/util/craftLayerUrl';

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
        instanceAccordion: true,
      },
    };
    this.cHoldings = this.props.stripes.connect(Holdings);
    this.cViewHoldingsRecord = this.props.stripes.connect(ViewHoldingsRecord);
    this.cViewItem = this.props.stripes.connect(ViewItem);

    this.transitionToParams = transitionToParams.bind(this);
    this.removeQueryParam = removeQueryParam.bind(this);
    this.craftLayerUrl = craftLayerUrl.bind(this);
  }

  // Edit Instance Handlers
  onClickEditInstance = (e) => {
    if (e) e.preventDefault();
    this.transitionToParams({ layer: 'edit' });
  }

  onClickAddNewHoldingsRecord = (e) => {
    if (e) e.preventDefault();
    this.log('clicked "add new holdings record"');
    this.transitionToParams({ layer: 'createHoldingsRecord' });
  }

  onClickCloseNewHoldingsRecord = (e) => {
    if (e) e.preventDefault();
    this.log('clicked "close new holdings record"');
    this.removeQueryParam('layer');
  }

  update(instance) {
    this.props.mutator.selectedInstance.PUT(instance).then(() => {
      this.closeEditInstance();
    });
  }

  closeEditInstance = (e) => {
    if (e) e.preventDefault();
    this.removeQueryParam('layer');
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
    // POST holdings record
    this.log(`Creating new holdings record: ${JSON.stringify(holdingsRecord)}`);
    this.props.mutator.holdings.POST(holdingsRecord).then(() => {
      this.onClickCloseNewHoldingsRecord();
    });
  }

  handleAccordionToggle = ({ id }) => {
    this.setState((state) => {
      const newState = _.cloneDeep(state);
      if (!_.has(newState.accordions, id)) newState.accordions[id] = true;
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

  render() {
    const { okapi, resources: { selectedInstance }, match: { params: { id, holdingsrecordid, itemid } }, location, referenceTables, stripes, onCopy } = this.props;
    const query = location.search ? queryString.parse(location.search) : emptyObj;
    const selInstance = (selectedInstance || emptyObj).records || emptyArr;


    const instance = (selInstance && id) ? selInstance.find(i => i.id === id) : null;

    const detailMenu = (
      <PaneMenu>
        <IconButton
          id="clickable-copy-instance"
          onClick={() => onCopy(instance)}
          title="Copy Instance"
          icon="duplicate"
        />
        <IconButton
          id="clickable-edit-instance"
          style={{ visibility: !instance ? 'hidden' : 'visible' }}
          href={this.craftLayerUrl('edit')}
          onClick={this.onClickEditInstance}
          title="Edit Instance"
          icon="edit"
        />
        <IconButton
          id="clickable-show-notes"
          style={{ visibility: !instance ? 'hidden' : 'visible' }}
          onClick={this.props.notesToggle}
          title="Show Notes"
          icon="comment"
        />
      </PaneMenu>
    );

    if (!instance) {
      return (
        <Pane id="pane-instancedetails" defaultWidth={this.props.paneWidth} paneTitle="Instance Details" lastMenu={detailMenu} dismissible onClose={this.props.onClose}>
          <div style={{ paddingTop: '1rem' }}><Icon icon="spinner-ellipsis" width="100px" /></div>
        </Pane>
      );
    }

    const instanceSub = () => {
      if (instance.publication && instance.publication.length > 0) {
        return `${instance.publication[0].publisher}${instance.publication[0].dateOfPublication ? `, ${instance.publication[0].dateOfPublication}` : ''}`;
      }
      return null;
    };

    const newHoldingsRecordButton = (
      <div>
        <Button
          id="clickable-new-holdings-record"
          href={this.craftLayerUrl('createHoldingsRecord')}
          onClick={this.onClickAddNewHoldingsRecord}
          title="+ Holdings"
          buttonStyle="primary"
          fullWidth
        >+ Add holdings</Button>
      </div>
    );

    return instance ? (
      <Pane
        defaultWidth={this.props.paneWidth}
        paneTitle={instance.title}
        paneSub={instanceSub()}
        lastMenu={detailMenu}
        dismissible
        onClose={this.props.onClose}
      >
        <Row end="xs"><Col xs><ExpandAllButton accordionStatus={this.state.accordions} onToggle={this.handleExpandAll} /></Col></Row>
        <Accordion
          open={this.state.accordions.instanceAccordion}
          id={'instanceAccordion'}
          onToggle={this.handleAccordionToggle}
          label="Instance data"
        >
          <Row>
            <Col xs={12}>
              Instance record {formatters.instanceTypesFormatter(instance, referenceTables.instanceTypes)}
            </Col>
          </Row>
          <br />
          <Row>
            <Col xs={12}>
              <Headline size="medium" margin="medium">
                {instance.title}
              </Headline>
            </Col>
          </Row>
          <br />
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
          { (instance.metadata && instance.metadata.createdDate) &&
            <MetaSection
              id="instanceRecordMeta"
              contentId="instanceRecordMetaContent"
              lastUpdatedDate={instance.metadata.updatedDate}
              createdDate={instance.metadata.createdDate}
            />
          }
        </ Accordion>
        { (!holdingsrecordid && !itemid) ?
          <this.cHoldings
            dataKey={id}
            id={id}
            accordionToggle={this.handleAccordionToggle}
            accordionStates={this.state.accordions}
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
        <Row>
          <Col sm={12}>{newHoldingsRecordButton}</Col>
        </Row>
        <Layer isOpen={query.layer ? query.layer === 'edit' : false} label="Edit Instance Dialog">
          <InstanceForm
            onSubmit={(record) => { this.update(record); }}
            initialValues={instance}
            onCancel={this.closeEditInstance}
            referenceTables={referenceTables}
          />
        </Layer>
        <Layer isOpen={query.layer ? query.layer === 'createHoldingsRecord' : false} label="Add New Holdings Dialog">
          <HoldingsForm
            form={instance.id}
            id={instance.id}
            key={instance.id}
            initialValues={{ instanceId: instance.id }}
            onSubmit={(record) => { this.createHoldingsRecord(record); }}
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
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
    search: PropTypes.string,
  }).isRequired,
  history: PropTypes.object,
  referenceTables: PropTypes.object.isRequired,
  mutator: PropTypes.shape({
    selectedInstance: PropTypes.shape({
      PUT: PropTypes.func.isRequired,
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
