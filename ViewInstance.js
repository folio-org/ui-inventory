import _ from 'lodash';
import React from 'react';
import { Link, Route, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';
import queryString from 'query-string';

import TitleManager from '@folio/stripes-core/src/components/TitleManager';
import Pane from '@folio/stripes-components/lib/Pane';
import PaneMenu from '@folio/stripes-components/lib/PaneMenu';
import { Accordion, ExpandAllButton } from '@folio/stripes-components/lib/Accordion';
import KeyValue from '@folio/stripes-components/lib/KeyValue';
import { Row, Col } from '@folio/stripes-components/lib/LayoutGrid';
import Layer from '@folio/stripes-components/lib/Layer';
import Button from '@folio/stripes-components/lib/Button';
import IconButton from '@folio/stripes-components/lib/IconButton';
import AppIcon from '@folio/stripes-components/lib/AppIcon';
import Icon from '@folio/stripes-components/lib/Icon';
import Headline from '@folio/stripes-components/lib/Headline';
import ViewMetaData from '@folio/stripes-smart-components/lib/ViewMetaData';

import craftLayerUrl from '@folio/stripes-components/util/craftLayerUrl';

import formatters from './referenceFormatters';

import Holdings from './Holdings';
import InstanceForm from './edit/InstanceForm';
import HoldingsForm from './edit/holdings/HoldingsForm';
import ViewHoldingsRecord from './ViewHoldingsRecord';
import ViewItem from './ViewItem';
import ViewMarc from './ViewMarc';
import makeConnectedInstance from './ConnectedInstance';

const emptyObj = {};


class ViewInstance extends React.Component {
  static manifest = Object.freeze({
    query: {},
    selectedInstance: {
      type: 'okapi',
      path: 'inventory/instances/:{id}',
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
        titleAccordion: true,
        descriptiveAccordion: true,
        notesAccordion: true,
        identifiersAccordion: true,
        classificationAccordion: true,
        electronicAccessAccordion: true,
        contributorsAccordion: true,
        subjectsAccordion: true,
      },
    };
    this.cHoldings = this.props.stripes.connect(Holdings);
    this.cViewHoldingsRecord = this.props.stripes.connect(ViewHoldingsRecord);
    this.cViewItem = this.props.stripes.connect(ViewItem);
    this.cViewMetaData = this.props.stripes.connect(ViewMetaData);
    this.cViewMarc = this.props.stripes.connect(ViewMarc);

    this.craftLayerUrl = craftLayerUrl.bind(this);
  }

  // Edit Instance Handlers
  onClickEditInstance = (e) => {
    if (e) e.preventDefault();
    this.props.mutator.query.update({ layer: 'edit' });
  }

  onClickAddNewHoldingsRecord = (e) => {
    if (e) e.preventDefault();
    this.log('clicked "add new holdings record"');
    this.props.mutator.query.update({ layer: 'createHoldingsRecord' });
  }

  onClickCloseNewHoldingsRecord = (e) => {
    if (e) e.preventDefault();
    this.log('clicked "close new holdings record"');
    this.props.mutator.query.update({ layer: null });
  }

  update(instance) {
    this.props.mutator.selectedInstance.PUT(instance).then(() => {
      this.closeEditInstance();
    });
  }

  closeEditInstance = (e) => {
    if (e) e.preventDefault();
    this.props.mutator.query.update({ layer: null });
  }

  closeViewItem = (e) => {
    if (e) e.preventDefault();
    this.props.mutator.query.update({ _path: `/inventory/view/${this.props.match.params.id}` });
  }

  closeViewMarc = (e) => {
    if (e) e.preventDefault();
    this.props.mutator.query.update({ _path: `/inventory/view/${this.props.match.params.id}` });
  }

  closeViewHoldingsRecord = (e) => {
    if (e) e.preventDefault();
    this.props.mutator.query.update({ _path: `/inventory/view/${this.props.match.params.id}` });
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
    const { okapi, match: { params: { id, holdingsrecordid, itemid } }, location, referenceTables, stripes, onCopy } = this.props;
    const query = location.search ? queryString.parse(location.search) : emptyObj;
    const formatMsg = this.props.stripes.intl.formatMessage;
    const ci = makeConnectedInstance(this.props, this.props.stripes.logger);
    const instance = ci.instance();

    const detailMenu = (
      <PaneMenu>
        <IconButton
          id="clickable-copy-instance"
          onClick={() => onCopy(instance)}
          title={formatMsg({ id: 'ui-inventory.copyInstance' })}
          icon="duplicate"
        />
        <IconButton
          id="clickable-edit-instance"
          style={{ visibility: !instance ? 'hidden' : 'visible' }}
          href={this.craftLayerUrl('edit')}
          onClick={this.onClickEditInstance}
          title={formatMsg({ id: 'ui-inventory.editInstance' })}
          icon="edit"
        />
        <IconButton
          id="clickable-show-notes"
          style={{ visibility: !instance ? 'hidden' : 'visible' }}
          onClick={this.props.notesToggle}
          title={formatMsg({ id: 'ui-inventory.showNotes' })}
          icon="comment"
        />
      </PaneMenu>
    );

    if (!instance) {
      return (
        <Pane id="pane-instancedetails" defaultWidth={this.props.paneWidth} paneTitle={formatMsg({ id: 'ui-inventory.instanceDetails' })} lastMenu={detailMenu} dismissible onClose={this.props.onClose}>
          <div style={{ paddingTop: '1rem' }}><Icon icon="spinner-ellipsis" width="100px" /></div>
        </Pane>
      );
    }

    const instanceSub = () => {
      if (instance.publication && instance.publication.length > 0 && instance.publication[0]) {
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
          title={formatMsg({ id: 'ui-inventory.addHoldings' })}
          buttonStyle="primary"
          fullWidth
        >{formatMsg({ id: 'ui-inventory.addHoldings' })}
        </Button>
      </div>
    );
    const viewSourceLink = `${location.pathname.replace('/view/', '/viewsource/')}${location.search}`;
    const viewSourceButton = <Link to={viewSourceLink}><Button id="clickable-view-source" >{formatMsg({ id: 'ui-inventory.viewSource' })}</Button></Link>;

    return instance ? (
      <Pane
        defaultWidth={this.props.paneWidth}
        paneTitle={instance.title}
        paneSub={instanceSub()}
        lastMenu={detailMenu}
        dismissible
        onClose={this.props.onClose}
      >
        <TitleManager record={instance.title} />
        <Row end="xs"><Col xs><ExpandAllButton accordionStatus={this.state.accordions} onToggle={this.handleExpandAll} /></Col></Row>
        <hr />
        <Row>
          <Col xs={12}>
            <AppIcon app="inventory" iconKey="instance" size="small" /> {formatMsg({ id: 'ui-inventory.instanceRecord' })} <AppIcon app="inventory" iconKey="resource-type" size="small" /> {formatters.instanceTypesFormatter(instance, referenceTables.instanceTypes)}
            { (!!instance.sourceRecordFormat) && <span style={{ 'float': 'right' }}>{viewSourceButton}</span> }
          </Col>
        </Row>
        <br />
        <Row>
          <Col xs={12}>
            <Headline size="small" margin="small">
              {instance.title}
            </Headline>
          </Col>
        </Row>
        { (instance.childInstances.length > 0) &&
          <Row>
            <Col xs={12}>
              <KeyValue label={referenceTables.instanceRelationshipTypes.find(irt => irt.id === instance.childInstances[0].instanceRelationshipTypeId).name + ' (M)'} value={formatters.childInstancesFormatter(instance, referenceTables.instanceRelationshipTypes, location)} />
            </Col>
          </Row>
        }
        { (instance.parentInstances.length > 0) &&
          <Row>
            <Col xs={12}>
              <KeyValue label={referenceTables.instanceRelationshipTypes.find(irt => irt.id === instance.parentInstances[0].instanceRelationshipTypeId).name} value={formatters.parentInstancesFormatter(instance, referenceTables.instanceRelationshipTypes, location)} />
            </Col>
          </Row>
        }

        <Accordion
          open={this.state.accordions.instanceAccordion}
          id="instanceAccordion"
          onToggle={this.handleAccordionToggle}
          label={formatMsg({ id: 'ui-inventory.instanceData' })}
        >
          { (instance.metadata && instance.metadata.createdDate) &&
            <this.cViewMetaData metadata={instance.metadata} />
          }
          <Row>
            <Col xs={6}>
              <KeyValue label={formatMsg({ id: 'ui-inventory.instanceHrid' })} value={_.get(instance, ['hrid'], '')} />
            </Col>
            <Col xs={6}>
              <KeyValue label={formatMsg({ id: 'ui-inventory.metadataSource' })} value={_.get(instance, ['source'], '')} />
            </Col>
          </Row>
          <Row>
            { (instance.series.length > 0) &&
              <Col xs={12}>
                <KeyValue label={formatMsg({ id: 'ui-inventory.seriesStatement' })} value={_.get(instance, ['series'], '')} />
              </Col>
            }
          </Row>
          <Row>
            <Col xs={6}>
              <KeyValue label={formatMsg({ id: 'ui-inventory.catalogedDate' })} value={_.get(instance, ['catalogedDate'], '')} />
            </Col>
            <Col xs={6}>
            </Col>
          </Row>
          <Row>
            <Col xs={6}>
              <KeyValue label={formatMsg({ id: 'ui-inventory.instanceStatusTerm' })} value={formatters.instanceStatusesFormatter(instance, referenceTables.instanceStatuses)} />
            </Col>
          </Row>
          <Row>
            <Col xs={6}>
              <KeyValue label={formatMsg({ id: 'ui-inventory.modeOfIssuance' })} value={formatters.modesOfIssuanceFormatter(instance, referenceTables.modesOfIssuance)} />
            </Col>
          </Row>
        </Accordion>
        <Accordion
          open={this.state.accordions.titleAccordion}
          id="titleAccordion"
          onToggle={this.handleAccordionToggle}
          label={formatMsg({ id: 'ui-inventory.titleData' })}
        >
          <Row>
            <Col xs={12}>
              <KeyValue label={formatMsg({ id: 'ui-inventory.resourceTitle' })} value={_.get(instance, ['title'], '')} />
            </Col>
          </Row>
          { (instance.alternativeTitles.length > 0) &&
          <Row>
            <Col xs={12}>
              <KeyValue label={formatMsg({ id: 'ui-inventory.alternativeTitles' })} value={_.get(instance, ['alternativeTitles'], []).map((title, i) => <div key={i}>{title}</div>)} />
            </Col>
          </Row>
          }
        </Accordion>
        <Accordion
          open={this.state.accordions.identifiersAccordion}
          id="identifiersAccordion"
          onToggle={this.handleAccordionToggle}
          label={formatMsg({ id: 'ui-inventory.identifiers' })}
        >
          { (instance.identifiers.length > 0) &&
          <Row>
            <Col xs={12}>
              <KeyValue label={formatMsg({ id: 'ui-inventory.resourceIdentifier' })} value={formatters.identifiersFormatter(instance, referenceTables.identifierTypes)} />
            </Col>
          </Row>
        }
        </Accordion>
        <Accordion
          open={this.state.accordions.contributorsAccordion}
          id="contributorsAccordion"
          onToggle={this.handleAccordionToggle}
          label={formatMsg({ id: 'ui-inventory.contributors' })}
        >
          { (instance.contributors.length > 0) &&
          <Row>
            <Col xs={12}>
              <KeyValue label={formatMsg({ id: 'ui-inventory.contributor' })} value={formatters.contributorsFormatter(instance, referenceTables.contributorTypes)} />
            </Col>
          </Row>
          }
        </Accordion>
        <Accordion
          open={this.state.accordions.descriptiveAccordion}
          id="descriptiveAccordion"
          onToggle={this.handleAccordionToggle}
          label={formatMsg({ id: 'ui-inventory.descriptiveData' })}
        >
          { (instance.publication.length > 0) &&
          <Row>
            <Col xs={12}>
              <KeyValue label={formatMsg({ id: 'ui-inventory.publisher' })} value={formatters.publishersFormatter(instance)} />
            </Col>
          </Row>
          }
          <Row>
            { (!!instance.edition) &&
              <Col xs={3}>
                <KeyValue label={formatMsg({ id: 'ui-inventory.edition' })} value={_.get(instance, ['edition'], '')} />
              </Col>
            }
            { (instance.physicalDescriptions.length > 0) &&
              <Col xs={3}>
                <KeyValue label={formatMsg({ id: 'ui-inventory.physicalDescription' })} value={_.get(instance, ['physicalDescriptions'], []).map((desc, i) => <div key={i}>{desc}</div>)} />
              </Col>
            }
          </Row>
          <Row>
            <Col xs={3}>
              <KeyValue label={formatMsg({ id: 'ui-inventory.resourceType' })} value={formatters.instanceTypesFormatter(instance, referenceTables.instanceTypes)} />
            </Col>
          </Row>
          <Row>
            { (instance.instanceFormatId) &&
              <Col xs={3}>
                <KeyValue label={formatMsg({ id: 'ui-inventory.format' })} value={formatters.instanceFormatsFormatter(instance, referenceTables.instanceFormats)} />
              </Col>
            }
          </Row>
          { (instance.languages.length > 0) &&
          <Row>
            <Col xs={12}>
              <KeyValue label={formatMsg({ id: 'ui-inventory.language' })} value={formatters.languagesFormatter(instance)} />
            </Col>
          </Row>
          }
          <Row>
            <Col xs={6}>
              <KeyValue label={formatMsg({ id: 'ui-inventory.publicationFrequency' })} value={_.get(instance, ['publicationFrequency'], []).map((desc, i) => <div key={i}>{desc}</div>)} />
            </Col>
            <Col xs={6}>
              <KeyValue label={formatMsg({ id: 'ui-inventory.publicationRange' })} value={_.get(instance, ['publicationRange'], []).map((desc, i) => <div key={i}>{desc}</div>)} />
            </Col>
          </Row>
        </Accordion>
        <Accordion
          open={this.state.accordions.notesAccordion}
          id="notesAccordion"
          onToggle={this.handleAccordionToggle}
          label={formatMsg({ id: 'ui-inventory.notes' })}
        >
          { (instance.notes.length > 0) &&
          <Row>
            <Col xs={12}>
              <KeyValue label={formatMsg({ id: 'ui-inventory.notes' })} value={_.get(instance, ['notes'], []).map((note, i) => <div key={i}>{note}</div>)} />
            </Col>
          </Row>
          }
        </Accordion>
        <Accordion
          open={this.state.accordions.electronicAccessAccordion}
          id="electronicAccessAccordion"
          onToggle={this.handleAccordionToggle}
          label={formatMsg({ id: 'ui-inventory.electronicAccess' })}
        >
          { (instance.urls.length > 0) &&
          <Row>
            <Col xs={12}>
              <KeyValue label={formatMsg({ id: 'ui-inventory.urls' })} value={_.get(instance, ['urls'], []).map((url, i) => <div key={i}>{url}</div>)} />
            </Col>
          </Row>
          }
        </Accordion>
        <Accordion
          open={this.state.accordions.subjectsAccordion}
          id="subjectsAccordion"
          onToggle={this.handleAccordionToggle}
          label={formatMsg({ id: 'ui-inventory.subjects' })}
        >
          { (instance.subjects.length > 0) &&
          <Row>
            <Col xs={12}>
              <KeyValue label={formatMsg({ id: 'ui-inventory.subjectHeadings' })} value={_.get(instance, ['subjects'], []).map((sub, i) => <div key={i}>{sub}</div>)} />
            </Col>
          </Row>
          }
        </Accordion>
        <Accordion
          open={this.state.accordions.classificationAccordion}
          id="classificationAccordion"
          onToggle={this.handleAccordionToggle}
          label={formatMsg({ id: 'ui-inventory.classification' })}
        >
          { (instance.classifications.length > 0) &&
          <Row>
            <Col xs={12}>
              <KeyValue label={formatMsg({ id: 'ui-inventory.classification' })} value={formatters.classificationsFormatter(instance, referenceTables.classificationTypes)} />
            </Col>
          </Row>
          }
        </Accordion>
        { (!holdingsrecordid && !itemid) ?
          <Switch>
            <Route
              path="/inventory/viewsource/"
              render={() => (
                <this.cViewMarc
                  instance={instance}
                  stripes={stripes}
                  match={this.props.match}
                  onClose={this.closeViewMarc}
                  paneWidth={this.props.paneWidth}
                />
              )}
            />
            <Route
              path="/inventory/view/"
              render={() => (
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
                />
              )}
            />
          </Switch>
          :
          null
        }
        { (holdingsrecordid && !itemid) ?
          <this.cViewHoldingsRecord id={id} holdingsrecordid={holdingsrecordid} {...this.props} onCloseViewHoldingsRecord={this.closeViewHoldingsRecord} />
          : null
        }
        { (holdingsrecordid && itemid) ?
          <this.cViewItem id={id} holdingsRecordId={holdingsrecordid} itemId={itemid} {...this.props} onCloseViewItem={this.closeViewItem} />
          : null
        }
        <Row>
          <Col sm={12}>{newHoldingsRecordButton}</Col>
        </Row>
        <Layer isOpen={query.layer ? query.layer === 'edit' : false} label={formatMsg({ id: 'ui-inventory.editInstanceDialog' })}>
          <InstanceForm
            onSubmit={(record) => { this.update(record); }}
            initialValues={instance}
            onCancel={this.closeEditInstance}
            referenceTables={referenceTables}
            stripes={stripes}
          />
        </Layer>
        <Layer isOpen={query.layer ? query.layer === 'createHoldingsRecord' : false} label={formatMsg({ id: 'ui-inventory.addNewHoldingsDialog' })}>
          <HoldingsForm
            form={instance.id}
            id={instance.id}
            key={instance.id}
            initialValues={{ instanceId: instance.id }}
            onSubmit={(record) => { this.createHoldingsRecord(record); }}
            onCancel={this.onClickCloseNewHoldingsRecord}
            okapi={okapi}
            formatMsg={formatMsg}
            instance={instance}
            referenceTables={referenceTables}
            stripes={stripes}
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
    intl: PropTypes.shape({
      formatMessage: PropTypes.func.isRequired,
    }),
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
  referenceTables: PropTypes.object.isRequired,
  mutator: PropTypes.shape({
    selectedInstance: PropTypes.shape({
      PUT: PropTypes.func.isRequired,
    }),
    holdings: PropTypes.shape({
      POST: PropTypes.func.isRequired,
    }),
    query: PropTypes.object.isRequired,
  }),
  onClose: PropTypes.func,
  onCopy: PropTypes.func,
  notesToggle: PropTypes.func,
  paneWidth: PropTypes.string.isRequired,
  okapi: PropTypes.object,
};

export default ViewInstance;
