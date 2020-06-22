import {
  get,
  values,
} from 'lodash';
import React, {
  Fragment,
  createRef,
} from 'react';
import {
  Route,
  Switch
} from 'react-router-dom';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { FormattedMessage } from 'react-intl';

import queryString from 'query-string';

import {
  AppIcon,
  TitleManager,
  IntlConsumer,
  IfPermission,
} from '@folio/stripes/core';
import {
  Pane,
  Row,
  Col,
  Button,
  AccordionSet,
  AccordionStatus,
  ExpandAllButton,
  Layer,
  Icon,
  Callout,
} from '@folio/stripes/components';

import {
  areAllFieldsEmpty,
  craftLayerUrl,
  marshalInstance,
  unmarshalInstance,
} from './utils';
import InstanceForm from './edit/InstanceForm';
import HoldingsForm from './edit/holdings/HoldingsForm';
import ViewHoldingsRecord from './ViewHoldingsRecord';
import ViewMarc from './ViewMarc';
import makeConnectedInstance from './ConnectedInstance';
import withLocation from './withLocation';
import InstancePlugin from './components/InstancePlugin';

import {
  HoldingsListContainer,
  MoveItemsContext,

  InstanceTitle,
  InstanceAdministrativeView,
  InstanceTitleData,
  InstanceIdentifiersView,
  InstanceDescriptiveView,
  InstanceContributorsView,
  InstanceNotesView,
  InstanceElecAccessView,
  InstanceSubjectView,
  InstanceClassificationView,
  InstanceRelationshipView,
} from './Instance';

class ViewInstance extends React.Component {
  static manifest = Object.freeze({
    query: {},
    selectedInstance: {
      type: 'okapi',
      path: 'inventory/instances/:{id}',
      clear: false,
      throwErrors: false,
    },
    holdings: {
      type: 'okapi',
      records: 'holdingsRecords',
      path: 'holdings-storage/holdings',
      fetch: false,
      throwErrors: false,
    },
    movableItems: {
      type: 'okapi',
      path: 'inventory/items',
      fetch: false,
      throwErrors: false,
      accumulate: true,
    },
    marcRecord: {
      type: 'okapi',
      path: 'source-storage/formattedRecords/:{id}?identifier=INSTANCE',
      accumulate: true,
      throwErrors: false,
    },
    blockedFields: {
      type: 'okapi',
      path: 'inventory/config/instances/blocked-fields',
      clear: false,
      throwErrors: false,
    },
    instanceRelationshipTypes: {
      type: 'okapi',
      records: 'instanceRelationshipTypes',
      path: 'instance-relationship-types?limit=1000&query=cql.allRecords=1 sortby name',
    },
  });

  constructor(props) {
    super(props);

    const logger = props.stripes.logger;
    this.log = logger.log.bind(logger);

    this.state = {
      marcRecord: null,
      findInstancePluginOpened: false,
      isItemsMovement: false,
    };
    this.instanceId = null;
    this.cViewHoldingsRecord = this.props.stripes.connect(ViewHoldingsRecord);
    this.cViewMarc = this.props.stripes.connect(ViewMarc);

    this.craftLayerUrl = craftLayerUrl.bind(this);
    this.calloutRef = createRef();
  }

  componentDidMount() {
    this.getMARCRecord();
  }

  componentDidUpdate(prevProps) {
    const { location: prevLocation } = prevProps;
    const { location } = this.props;

    if (prevLocation === location) return;
    this.getMARCRecord();
  }

  getMARCRecord = () => {
    const { mutator } = this.props;
    mutator.marcRecord.GET()
      .then(data => this.setState({ marcRecord: data }))
      .catch(error => {
        // eslint-disable-next-line no-console
        console.error('MARC record getting ERROR: ', error);
      });
  };

  getPublisherAndDate = instance => {
    const publisher = get(instance, 'publication[0].publisher', '');
    const dateOfPublication = get(instance, 'publication[0].dateOfPublication', '');
    let publisherAndDate = publisher;

    publisherAndDate += (publisher) ? `, ${dateOfPublication}` : publisherAndDate;

    return publisherAndDate;
  };

  // Edit Instance Handlers
  onClickEditInstance = (e) => {
    if (e) e.preventDefault();
    this.props.updateLocation({ layer: 'edit' });
  };

  editInstanceMarc = () => {
    const { history, location, match } = this.props;
    const instanceId = match.params.id;

    history.push({
      pathname: `/inventory/quick-marc/edit/${instanceId}`,
      search: location.search,
    });
  };

  selectInstanse = (instance) => {
    const { location: { search } } = this.props;

    this.props.goTo(`/inventory/view/${instance.id}${search}`);
  }

  toggleItemsMovement = () => {
    this.setState((prevState) => ({ isItemsMovement: !prevState.isItemsMovement }));
  };

  moveItems = (fromHolding, toHolding, items) => {
    // TODO: replace temporary solution with correct one when implemented
    const { mutator } = this.props;

    return mutator.movableItems.GET({
      params: {
        query: items.map(item => `id==${item}`).join(' or '),
      },
    })
      .then(({ items: fetchedItems }) => {
        const updatedPromises = fetchedItems.map((item) => mutator.movableItems.PUT({
          ...item,
          holdingsRecordId: toHolding,
        }));

        return Promise.all(updatedPromises);
      })
      .then(() => {
        const message = (
          <FormattedMessage
            id="ui-inventory.moveItems.instance.success"
            values={{ count: items.length }}
          />
        );

        this.calloutRef.current.sendCallout({ message });
      });
  };

  onClickAddNewHoldingsRecord = (e) => {
    if (e) e.preventDefault();
    this.log('clicked "add new holdings record"');
    this.props.updateLocation({ layer: 'createHoldingsRecord' });
  };

  update = (instance) => {
    const { referenceTables: { identifierTypesByName } } = this.props;

    // Massage record to add preceeding and succeeding title fields
    marshalInstance(instance, identifierTypesByName);

    this.props.mutator.selectedInstance.PUT(instance).then(() => {
      this.resetLayerQueryParam();
    });
  };

  resetLayerQueryParam = (e) => {
    if (e) e.preventDefault();
    this.props.updateLocation({ layer: null });
  };

  goBack = (e) => {
    if (e) e.preventDefault();

    const {
      goTo,
      match: {
        params: { id },
      },
      location: { pathname, search }
    } = this.props;

    // extract instance url
    const [path] = pathname.match(new RegExp(`(.*)${id}`));

    goTo(`${path}${search}`);
  };

  closeViewMarc = (e) => {
    if (e) e.preventDefault();
    const { location: { search } } = this.props;
    this.resetLayerQueryParam();
    this.props.goTo(`/inventory/view/${this.props.match.params.id}${search}`);
  };

  createHoldingsRecord = (holdingsRecord) => {
    // POST holdings record
    this.log(`Creating new holdings record: ${JSON.stringify(holdingsRecord)}`);
    this.props.mutator.holdings.POST(holdingsRecord).then(() => {
      this.resetLayerQueryParam();
    });
  };

  handleViewSource = (e, instance) => {
    if (e) e.preventDefault();
    const {
      location,
      goTo,
    } = this.props;
    const { marcRecord } = this.state;

    if (!marcRecord) {
      const message = (
        <FormattedMessage
          id="ui-inventory.marcSourceRecord.notFoundError"
          values={{ name: instance.title }}
        />
      );
      this.calloutRef.current.sendCallout({
        type: 'error',
        message,
      });
      return;
    }
    goTo(`${location.pathname.replace('/view/', '/viewsource/')}${location.search}`);
  };

  toggleFindInstancePlugin = () => {
    this.setState(prevState => ({ findInstancePluginOpened: !prevState.findInstancePluginOpened }));
  };

  createActionMenuGetter = instance => ({ onToggle }) => {
    const {
      onCopy,
      stripes
    } = this.props;
    const { marcRecord } = this.state;
    const isSourceMARC = get(instance, ['source'], '') === 'MARC';
    const canEditInstance = stripes.hasPerm('ui-inventory.instance.edit');
    const canCreateInstance = stripes.hasPerm('ui-inventory.instance.create');

    if (!isSourceMARC && !canEditInstance && !canCreateInstance) {
      return null;
    }

    return (
      <Fragment>
        <IfPermission perm="ui-inventory.instance.edit">
          <Button
            id="edit-instance"
            href={this.craftLayerUrl('edit')}
            onClick={() => {
              onToggle();
              this.onClickEditInstance();
            }}
            buttonStyle="dropdownItem"
          >
            <Icon icon="edit">
              <FormattedMessage id="ui-inventory.editInstance" />
            </Icon>
          </Button>
        </IfPermission>
        <IfPermission perm="ui-inventory.instance.create">
          <Button
            id="copy-instance"
            onClick={() => {
              onToggle();
              onCopy(instance);
            }}
            buttonStyle="dropdownItem"
          >
            <Icon icon="duplicate">
              <FormattedMessage id="ui-inventory.duplicateInstance" />
            </Icon>
          </Button>
        </IfPermission>

        {
          isSourceMARC && (
            <>
              <IfPermission perm="ui-inventory.instance.view">
                <Button
                  id="clickable-view-source"
                  buttonStyle="dropdownItem"
                  disabled={!marcRecord}
                  onClick={(e) => {
                    onToggle();
                    this.handleViewSource(e, instance);
                  }}
                >
                  <Icon icon="document">
                    <FormattedMessage id="ui-inventory.viewSource" />
                  </Icon>
                </Button>
              </IfPermission>

              <IfPermission perm="records-editor.records.item.put">
                <Button
                  id="edit-instance-marc"
                  buttonStyle="dropdownItem"
                  onClick={() => {
                    onToggle();
                    this.editInstanceMarc();
                  }}
                >
                  <Icon icon="edit">
                    <FormattedMessage id="ui-inventory.editInstanceMarc" />
                  </Icon>
                </Button>
              </IfPermission>
            </>
          )
        }

        <Button
          id="move-instance-items"
          buttonStyle="dropdownItem"
          onClick={() => {
            onToggle();
            this.toggleItemsMovement();
          }}
        >
          <Icon icon="transfer">
            <FormattedMessage
              id={`ui-inventory.moveItems.instance.actionMenu.${this.state.isItemsMovement ? 'disable' : 'enable'}`}
            />
          </Icon>
        </Button>

        <Button
          id="move-instance"
          buttonStyle="dropdownItem"
          onClick={() => {
            onToggle();
            this.toggleFindInstancePlugin();
          }}
        >
          <Icon icon="arrow-right">
            <FormattedMessage id="ui-inventory.moveItems" />
          </Icon>
        </Button>
      </Fragment>
    );
  };

  render() {
    const {
      okapi,
      match: { params: { id, holdingsrecordid, itemid } },
      location,
      referenceTables,
      stripes,
      onClose,
      paneWidth,
    } = this.props;

    const { marcRecord } = this.state;

    const { identifierTypesById } = referenceTables;

    const query = location.search ? queryString.parse(location.search) : {};
    const ci = makeConnectedInstance(this.props, stripes.logger);
    const instance = ci.instance();

    if (!instance) {
      return (
        <Pane
          id="pane-instancedetails"
          defaultWidth={paneWidth}
          paneTitle={<FormattedMessage id="ui-inventory.editInstance" />}
          appIcon={<AppIcon app="inventory" iconKey="instance" />}
          dismissible
          onClose={onClose}
        >
          <div style={{ paddingTop: '1rem' }}>
            <Icon
              icon="spinner-ellipsis"
              width="100px"
            />
          </div>
        </Pane>
      );
    }

    const instanceSub = () => {
      const { publication } = instance;
      if (publication && publication.length > 0 && publication[0]) {
        return `${publication[0].publisher}${publication[0].dateOfPublication ? `, ${publication[0].dateOfPublication}` : ''}`;
      }
      return null;
    };

    const newHoldingsRecordButton = stripes.hasPerm('ui-inventory.holdings.create') && (
      <FormattedMessage id="ui-inventory.addHoldings">
        {ariaLabel => (
          <Button
            id="clickable-new-holdings-record"
            href={this.craftLayerUrl('createHoldingsRecord', location)}
            onClick={this.onClickAddNewHoldingsRecord}
            aria-label={ariaLabel}
            buttonStyle="primary"
            fullWidth
          >
            <FormattedMessage id="ui-inventory.addHoldings" />
          </Button>
        )}
      </FormattedMessage>
    );

    if (query.layer === 'edit') {
      return (
        <IntlConsumer>
          {(intl) => (
            <Layer
              isOpen
              contentLabel={intl.formatMessage({ id: 'ui-inventory.editInstanceDialog' })}
            >
              <InstanceForm
                onSubmit={this.update}
                initialValues={unmarshalInstance(instance, identifierTypesById)}
                instanceSource={get(instance, ['source'])}
                referenceTables={referenceTables}
                stripes={stripes}
                match={this.props.match}
                onCancel={this.resetLayerQueryParam}
              />
            </Layer>
          )}
        </IntlConsumer>
      );
    }

    if (query.layer === 'createHoldingsRecord') {
      return (
        <IntlConsumer>
          {intl => (
            <Layer
              isOpen
              contentLabel={intl.formatMessage({ id: 'ui-inventory.addNewHoldingsDialog' })}
            >
              <HoldingsForm
                form={instance.id}
                id={instance.id}
                key={instance.id}
                initialValues={{ instanceId: instance.id }}
                onSubmit={this.createHoldingsRecord}
                onCancel={this.resetLayerQueryParam}
                okapi={okapi}
                instance={instance}
                referenceTables={referenceTables}
                stripes={stripes}
              />
            </Layer>
          )}
        </IntlConsumer>
      );
    }

    const instanceData = {
      instanceHrid: get(instance, ['hrid'], '-'),
      metadataSource: get(instance, ['source'], '-'),
      catalogedDate: get(instance, ['catalogedDate'], '-'),
      status: instance.statusId,
      instanceStatusUpdatedDate: instance?.statusUpdatedDate,
      modeOfIssuance: instance.modeOfIssuanceId,
      statisticalCodeIds: get(instance, ['statisticalCodeIds'], []),
    };

    const titleData = {
      resourceTitle: get(instance, ['title'], '-'),
      alternativeTitles: get(instance, ['alternativeTitles'], []),
      indexTitle: get(instance, ['indexTitle'], '-'),
      series: get(instance, ['series'], []),
    };

    const identifiers = get(instance, ['identifiers'], []);
    const contributors = get(instance, ['contributors'], []);

    const descriptiveData = {
      publication: get(instance, ['publication'], []),
      editions: get(instance, ['editions'], []),
      physicalDescriptions: get(instance, ['physicalDescriptions'], []),
      instanceTypeId: get(instance, ['instanceTypeId'], ''),
      natureOfContentTerms: get(instance, 'natureOfContentTermIds', []),
      instanceFormatIds: get(instance, ['instanceFormatIds'], []),
      languages: get(instance, ['languages'], []),
      publicationFrequency: get(instance, ['publicationFrequency'], []),
      publicationRange: get(instance, ['publicationRange'], []),
    };

    const electronicAccess = get(instance, ['electronicAccess'], []);

    const subjects = get(instance, ['subjects'], []);

    const instanceRelationship = {
      childInstances: get(instance, ['childInstances'], []),
      parentInstances: get(instance, ['parentInstances'], []),
    };

    const initialAccordionsState = {
      acc01: !areAllFieldsEmpty(values(instanceData)),
      acc02: !areAllFieldsEmpty(values(titleData)),
      acc03: !areAllFieldsEmpty([identifiers]),
      acc04: !areAllFieldsEmpty([contributors]),
      acc05: !areAllFieldsEmpty(values(descriptiveData)),
      acc06: !areAllFieldsEmpty([[get(instance, 'notes', [])]]),
      acc07: !areAllFieldsEmpty([electronicAccess]),
      acc08: !areAllFieldsEmpty([subjects]),
      acc09: !areAllFieldsEmpty([get(instance, 'classifications', [])]),
      acc10: !areAllFieldsEmpty(values(instanceRelationship)),
    };

    return (
      <Pane
        data-test-instance-details
        style={{ flex: 'auto' }}
        appIcon={<AppIcon app="inventory" iconKey="instance" />}
        paneTitle={
          <span data-test-header-title>
            <FormattedMessage
              id="ui-inventory.instanceRecordTitle"
              values={{
                title: instance.title,
                publisherAndDate: this.getPublisherAndDate(instance),
              }}
            />
          </span>
        }
        paneSub={instanceSub()}
        dismissible
        onClose={onClose}
        actionMenu={this.createActionMenuGetter(instance)}
      >
        <TitleManager record={instance.title} />
        <AccordionStatus>
          <Row end="xs">
            <Col
              data-test-expand-all
              xs
            >
              <ExpandAllButton />
            </Col>
          </Row>

          <InstanceTitle
            instance={instance}
            instanceTypes={referenceTables.instanceTypes}
          />

          <AccordionSet initialStatus={initialAccordionsState}>
            {
              (!holdingsrecordid && !itemid) ?
                (
                  <Switch>
                    <Route
                      path="/inventory/viewsource/"
                      render={() => (
                        <this.cViewMarc
                          instance={instance}
                          marcRecord={marcRecord}
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
                        <MoveItemsContext moveItems={this.moveItems}>
                          <HoldingsListContainer
                            instance={instance}
                            referenceData={referenceTables}
                            draggable={this.state.isItemsMovement}
                            droppable
                          />
                        </MoveItemsContext>
                      )}
                    />
                  </Switch>
                )
                :
                null
            }

            <Row>
              <Col sm={12}>{newHoldingsRecordButton}</Col>
            </Row>

            <InstanceAdministrativeView
              id="acc01"
              instance={instance}
              instanceStatuses={referenceTables.instanceStatuses}
              issuanceModes={referenceTables.modesOfIssuance}
              statisticalCodes={referenceTables.statisticalCodes}
              statisticalCodeTypes={referenceTables.statisticalCodeTypes}
            />

            <InstanceTitleData
              id="acc02"
              instance={instance}
              titleTypes={referenceTables.alternativeTitleTypes}
            />

            <InstanceIdentifiersView
              id="acc03"
              identifiers={identifiers}
              identifierTypes={referenceTables.identifierTypes}
            />

            <InstanceContributorsView
              id="acc04"
              contributors={contributors}
              contributorTypes={referenceTables.contributorTypes}
              contributorNameTypes={referenceTables.contributorNameTypes}
            />

            <InstanceDescriptiveView
              id="acc05"
              instance={instance}
              resourceTypes={referenceTables.instanceTypes}
              resourceFormats={referenceTables.instanceFormats}
              natureOfContentTerms={referenceTables.natureOfContentTerms}
            />

            <InstanceNotesView
              id="acc06"
              instance={instance}
              noteTypes={referenceTables.instanceNoteTypes}
            />

            <InstanceElecAccessView
              id="acc07"
              electronicAccessLines={electronicAccess}
              electronicAccessRelationships={referenceTables.electronicAccessRelationships}
            />

            <InstanceSubjectView
              id="acc08"
              subjects={subjects}
            />

            <InstanceClassificationView
              id="acc09"
              classifications={instance?.classifications}
              classificationTypes={referenceTables.classificationTypes}
            />

            <InstanceRelationshipView
              id="acc10"
              instance={instance}
              relationTypes={referenceTables.instanceRelationshipTypes}
            />
          </AccordionSet>
        </AccordionStatus>
        {
          (holdingsrecordid && !itemid)
            ? (
              <this.cViewHoldingsRecord
                id={id}
                holdingsrecordid={holdingsrecordid}
                onCloseViewHoldingsRecord={this.goBack}
                {...this.props}
              />
            )
            : null
        }

        { /*
          related-instances isn't available yet but accordions MUST contain
          child elements. this is commented out for now in an effort to
          keep the console free of warnings.
          <Accordion
            open={this.state.accordions.acc11}
            id="acc11"
            onToggle={this.handleAccordionToggle}
            label={<FormattedMessage id="ui-inventory.relatedInstances" />}
          />
        */ }
        <Callout ref={this.calloutRef} />
        {this.state.findInstancePluginOpened
          && <InstancePlugin
            onSelect={this.selectInstanse}
            onClose={this.toggleFindInstancePlugin}
            withTrigger={false}
          />}
      </Pane>
    );
  }
}

ViewInstance.propTypes = {
  getSearchParams: PropTypes.func.isRequired,
  goTo: PropTypes.func.isRequired,
  getParams: PropTypes.func.isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
    search: PropTypes.string,
  }).isRequired,
  match: PropTypes.shape({
    path: PropTypes.string.isRequired,
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  }),
  history: ReactRouterPropTypes.history.isRequired,
  mutator: PropTypes.shape({
    selectedInstance: PropTypes.shape({
      PUT: PropTypes.func.isRequired,
    }),
    holdings: PropTypes.shape({
      POST: PropTypes.func.isRequired,
    }),
    marcRecord: PropTypes.shape({
      GET: PropTypes.func.isRequired,
    }),
    query: PropTypes.object.isRequired,
  }),
  okapi: PropTypes.object,
  onClose: PropTypes.func,
  onCopy: PropTypes.func,
  paneWidth: PropTypes.string.isRequired,
  referenceTables: PropTypes.object.isRequired,
  resources: PropTypes.shape({
    selectedInstance: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object),
    }),
  }).isRequired,
  stripes: PropTypes.shape({
    connect: PropTypes.func.isRequired,
    hasPerm: PropTypes.func.isRequired,
    locale: PropTypes.string.isRequired,
    logger: PropTypes.object.isRequired,
  }).isRequired,
  updateLocation: PropTypes.func.isRequired,
};

export default withLocation(ViewInstance);
