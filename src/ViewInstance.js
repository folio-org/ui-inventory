import { get } from 'lodash';
import React, {
  createRef,
} from 'react';
import PropTypes from 'prop-types';
import { parse } from 'query-string';
import ReactRouterPropTypes from 'react-router-prop-types';
import {
  FormattedMessage,
  injectIntl,
} from 'react-intl';

import {
  AppIcon,
  IfPermission,
  IfInterface,
  Pluggable,
  stripesConnect,
} from '@folio/stripes/core';
import {
  Pane,
  Button,
  Icon,
  MenuSection,
  Callout,
  checkScope,
  HasCommand,
  collapseAllSections,
  expandAllSections,
} from '@folio/stripes/components';

import ViewHoldingsRecord from './ViewHoldingsRecord';
import makeConnectedInstance from './ConnectedInstance';
import withLocation from './withLocation';
import InstancePlugin from './components/InstancePlugin';
import { getPublishingInfo } from './Instance/InstanceDetails/utils';
import {
  getDate,
  handleKeyCommand,
} from './utils';
import {
  indentifierTypeNames,
  layers,
  REQUEST_OPEN_STATUSES,
  SOURCE_VALUES,
} from './constants';
import { DataContext } from './contexts';

import {
  HoldingsListContainer,
  MoveItemsContext,
  InstanceDetails,
} from './Instance';
import {
  CalloutRenderer,
  NewOrderModal,
} from './components';

import ImportRecordModal from './components/ImportRecordModal';
import NewInstanceRequestButton from './components/ViewInstance/MenuSection/NewInstanceRequestButton';
import RequestsReorderButton from './components/ViewInstance/MenuSection/RequestsReorderButton';
import { IdReportGenerator } from './reports';

const quickMarcPages = {
  editInstance: 'edit-bib',
  duplicateInstance: 'duplicate-bib',
  createHoldings: 'create-holdings',
};

const getTlrSettings = (settings) => {
  try {
    return JSON.parse(settings);
  } catch (error) {
    return {};
  }
};
const requestOpenStatuses = Object.values(REQUEST_OPEN_STATUSES);
const instanceRequestsQuery = requestOpenStatuses.map(status => `status=="${status}"`).join(' OR ');

class ViewInstance extends React.Component {
  static manifest = Object.freeze({
    query: {},
    allInstanceHoldings: {
      type: 'okapi',
      records: 'holdingsRecords',
      path: 'holdings-storage/holdings',
      fetch: true,
      throwErrors: false,
      params: {
        query: 'instanceId==:{id}',
        limit: '1000',
      },
      shouldRefresh: () => false,
    },
    allInstanceItems: {
      accumulate: true,
      fetch: false,
      path: 'inventory/items',
      records: 'items',
      throwErrors: false,
      type: 'okapi',
      shouldRefresh: () => false,
    },
    instanceRequests: {
      accumulate: true,
      fetch: false,
      path: 'circulation/requests',
      params: {
        query: `instanceId==:{id} AND (${instanceRequestsQuery})`,
        limit: '1',
      },
      records: 'requests',
      throwErrors: false,
      type: 'okapi',
      shouldRefresh: () => false,
    },
    movableItems: {
      type: 'okapi',
      path: 'inventory/items/move',
      fetch: false,
      throwErrors: false,
    },
    marcRecord: {
      type: 'okapi',
      path: 'source-storage/records/:{id}/formatted?idType=INSTANCE',
      accumulate: true,
      throwErrors: false,
    },
    quickExport: {
      type: 'okapi',
      fetch: false,
      path: 'data-export/quick-export',
      throwErrors: false,
      clientGeneratePk: false,
    },
    instanceRelationshipTypes: {
      type: 'okapi',
      records: 'instanceRelationshipTypes',
      path: 'instance-relationship-types?limit=1000&query=cql.allRecords=1 sortby name',
    },
    locations: {
      type: 'okapi',
      records: 'locations',
      path: 'locations?limit=5000',
    },
    configs: {
      type: 'okapi',
      records: 'configs',
      path: 'configurations/entries',
      params: {
        query: '(module==SETTINGS and configName==TLR)',
      },
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
      isImportRecordModalOpened: false,
      isCopyrightModalOpened: false,
      isNewOrderModalOpen: false,
      afterCreate: false,
      instancesQuickExportInProgress: false,
    };
    this.instanceId = null;
    this.cViewHoldingsRecord = this.props.stripes.connect(ViewHoldingsRecord);

    this.calloutRef = createRef();
    this.accordionStatusRef = createRef();
  }

  componentDidMount() {
    const isMARCSource = this.isMARCSource(this.props.selectedInstance);

    if (isMARCSource) {
      this.getMARCRecord();
    }

    this.setTlrSettings();
  }

  componentDidUpdate(prevProps) {
    const {
      selectedInstance: prevInstance,
      resources: { configs: prevConfigs },
      match: { params: prevParams },
    } = prevProps;
    const {
      selectedInstance: instance,
      resources: { configs },
      match: { params },
    } = this.props;
    const instanceRecordsId = instance?.id;
    const prevInstanceRecordsId = prevInstance?.id;
    const prevIsMARCSource = this.isMARCSource(prevInstance);
    const isMARCSource = this.isMARCSource(instance);
    const isViewingAnotherRecord = instanceRecordsId !== prevInstanceRecordsId;
    const recordSourceWasChanged = isMARCSource !== prevIsMARCSource;

    if (isMARCSource && (isViewingAnotherRecord || recordSourceWasChanged)) {
      this.getMARCRecord();
    }

    // component got updated after a new record was created
    if (parse(prevProps?.location?.search)?.layer === layers.CREATE &&
      !parse(this.props?.location?.search)?.layer && !this.state.afterCreate) {
      // eslint-disable-next-line
      this.setState({ afterCreate: true });
    }

    if (prevConfigs.hasLoaded !== configs.hasLoaded && configs.hasLoaded) {
      this.setTlrSettings();
    }

    if (prevParams.id !== params.id) {
      this.getInstanceRequests();
    }
  }

  componentWillUnmount() {
    this.props.mutator.allInstanceItems.reset();
  }

  isMARCSource = (instance) => {
    const instanceRecordsSource = instance?.source;

    return instanceRecordsSource === SOURCE_VALUES.MARC;
  };

  getMARCRecord = () => {
    const { mutator } = this.props;
    mutator.marcRecord.GET()
      .then(data => this.setState({ marcRecord: data }))
      .catch(error => {
        // eslint-disable-next-line no-console
        console.error('MARC record getting ERROR: ', error);
      });
  };

  setTlrSettings = () => {
    const {
      resources : { configs },
    } = this.props;

    if (configs.hasLoaded) {
      const { titleLevelRequestsFeatureEnabled } = getTlrSettings(configs.records[0]?.value);

      this.setState({ titleLevelRequestsFeatureEnabled }, this.getInstanceRequests);
    }
  }

  getInstanceRequests = () => {
    const {
      mutator: { instanceRequests },
    } = this.props;
    const { titleLevelRequestsFeatureEnabled } = this.state;

    if (titleLevelRequestsFeatureEnabled) {
      instanceRequests.reset();
      instanceRequests.GET();
    }
  }

  // Edit Instance Handlers
  onClickEditInstance = () => {
    const { history, location, match } = this.props;
    const instanceId = match.params.id;

    history.push({
      pathname: `/inventory/edit/${instanceId}/instance`,
      search: location.search,
    });
  };

  onClickViewRequests = () => {
    const { history, location, match } = this.props;
    const instanceId = match.params.id;

    history.push({
      pathname: `/inventory/view-requests/${instanceId}`,
      search: location.search,
    });
  };

  redirectToQuickMarcPage = (page) => {
    const {
      history,
      location,
      stripes,
    } = this.props;

    const ci = makeConnectedInstance(this.props, stripes.logger);
    const instance = ci.instance();

    const searchParams = new URLSearchParams(location.search);

    searchParams.delete('relatedRecordVersion');

    history.push({
      pathname: `/inventory/quick-marc/${page}/${instance.id}`,
      search: searchParams.toString(),
    });
  };

  editInstanceMarc = () => {
    this.redirectToQuickMarcPage(quickMarcPages.editInstance);
  };

  duplicateInstanceMarc = () => {
    this.redirectToQuickMarcPage(quickMarcPages.duplicateInstance);
  };

  createHoldingsMarc = () => {
    this.redirectToQuickMarcPage(quickMarcPages.createHoldings);
  };

  selectInstance = (selectedInstance) => {
    const { history, location, match } = this.props;
    const instanceId = match.params.id;

    history.push({
      pathname: `/inventory/move/${instanceId}/${selectedInstance.id}/instance`,
      search: location.search,
    });
  };

  toggleItemsMovement = () => {
    this.setState((prevState) => ({ isItemsMovement: !prevState.isItemsMovement }));
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


  triggerQuickExport = async () => {
    const { instancesQuickExportInProgress } = this.state;
    const { match } = this.props;

    if (instancesQuickExportInProgress) return;

    this.setState({ instancesQuickExportInProgress: true });

    try {
      const instanceIds = [match.params.id];

      await this.props.mutator.quickExport.POST({
        uuids: instanceIds,
        type: 'uuid',
        recordType: 'INSTANCE'
      });
      new IdReportGenerator('QuickInstanceExport').toCSV(instanceIds);
    } catch (error) {
      this.calloutRef.current.sendCallout({
        type: 'error',
        message: <FormattedMessage id="ui-inventory.communicationProblem" />,
      });
    } finally {
      this.setState({ instancesQuickExportInProgress: false });
    }
  };

  handleImportRecordModalSubmit = (args) => {
    this.setState({ isImportRecordModalOpened: false });
    this.props.mutator.query.update({
      _path: `/inventory/import/${this.props.match.params.id}`,
      xidtype: args.externalIdentifierType,
      xid: args.externalIdentifier,
      jobprofileid: args.selectedJobProfileId,
    });
  }

  handleImportRecordModalCancel = () => {
    this.setState({ isImportRecordModalOpened: false });
  }

  toggleCopyrightModal = () => {
    this.setState(prevState => ({ isCopyrightModalOpened: !prevState.isCopyrightModalOpened }));
  };

  toggleFindInstancePlugin = () => {
    this.setState(prevState => ({ findInstancePluginOpened: !prevState.findInstancePluginOpened }));
  };

  toggleNewOrderModal = () => {
    this.setState(prevState => ({ isNewOrderModalOpen: !prevState.isNewOrderModalOpen }));
  };

  // Get all identifiers for all records
  getIdentifiers = (data) => {
    const { identifierTypesById } = data;
    const { ISBN, ISSN } = indentifierTypeNames;
    const selectedInstance = this.props?.selectedInstance;

    if (!selectedInstance) {
      return null;
    }

    // We can't make any meaningful assessment of which is
    // the best identifier to return, so just return the first
    // we find
    for (const identifiers of selectedInstance.identifiers) {
      const { identifierTypeId, value } = identifiers;
      const ident = identifierTypesById[identifierTypeId];
      if (
        (ident?.name === ISBN ||
          ident?.name === ISSN) &&
        value
      ) {
        return { type: ident.name, value };
      }
    }
    return null;
  };

  createActionMenuGetter = (instance, data) => ({ onToggle }) => {
    const {
      onCopy,
      stripes,
      intl,
      openedFromBrowse,
      resources: {
        instanceRequests,
      },
    } = this.props;
    const {
      marcRecord,
      titleLevelRequestsFeatureEnabled,
    } = this.state;

    const isSourceMARC = get(instance, ['source'], '') === SOURCE_VALUES.MARC;
    const isSourceConsortiumFolio = get(instance, ['source'], '') === SOURCE_VALUES.CONSORTIUM_FOLIO;
    const isSourceConsortiumMARC = get(instance, ['source'], '') === SOURCE_VALUES.CONSORTIUM_MARC;

    const canEditInstance = stripes.hasPerm('ui-inventory.instance.edit');
    const canCreateInstance = stripes.hasPerm('ui-inventory.instance.create');
    const canCreateRequest = stripes.hasPerm('ui-requests.create');
    const canMoveItems = stripes.hasPerm('ui-inventory.item.move');
    const canCreateMARCHoldings = stripes.hasPerm('ui-quick-marc.quick-marc-holdings-editor.create');
    const canMoveHoldings = stripes.hasPerm('ui-inventory.holdings.move');
    const canEditMARCRecord = stripes.hasPerm('ui-quick-marc.quick-marc-editor.all');
    const canDeriveMARCRecord = stripes.hasPerm('ui-quick-marc.quick-marc-editor.duplicate');
    const hasReorderPermissions = canCreateRequest || stripes.hasPerm('ui-requests.edit') || stripes.hasPerm('ui-requests.all');
    const canViewMARCSource = stripes.hasPerm('ui-quick-marc.quick-marc-editor.view');
    const canViewInstance = stripes.hasPerm('ui-inventory.instance.view');
    const canViewSource = canViewMARCSource && canViewInstance;
    const canImport = stripes.hasInterface('copycat-imports') && stripes.hasPerm('copycat.profiles.collection.get');
    const canCreateOrder = stripes.hasInterface('orders') && stripes.hasPerm('ui-inventory.instance.createOrder');
    const canReorder = stripes.hasPerm('ui-requests.reorderQueue');
    const numberOfRequests = instanceRequests.other?.totalRecords;
    const canReorderRequests = titleLevelRequestsFeatureEnabled && hasReorderPermissions && numberOfRequests && canReorder;
    const canViewRequests = !titleLevelRequestsFeatureEnabled;
    const canCreateNewRequest = titleLevelRequestsFeatureEnabled && canCreateRequest;
    const identifier = this.getIdentifiers(data);

    const buildOnClickHandler = onClickHandler => {
      return () => {
        onToggle();

        onClickHandler(this.context.sendCallout);
      };
    };

    const isInstanceShared = isSourceConsortiumFolio || isSourceConsortiumMARC;

    const showInventoryMenuSection = (
      canEditInstance
      || canViewSource
      || (!openedFromBrowse && (canMoveItems || canMoveHoldings))
      || canImport
      || canCreateInstance
      || canCreateOrder
      || canReorderRequests
      || canViewRequests
      || canCreateNewRequest
    );

    const showQuickMarcMenuSection = isSourceMARC && (canCreateMARCHoldings || canEditMARCRecord || canDeriveMARCRecord);

    if (!isSourceMARC && !canEditInstance && !canCreateInstance) {
      return null;
    }

    // the `identifier` is responsible for displaying the plugin `copyright-permissions-checker`
    if (!showInventoryMenuSection && !showQuickMarcMenuSection && !identifier) {
      return null;
    }

    return (
      <>
        {showInventoryMenuSection && (
          <MenuSection label={intl.formatMessage({ id: 'ui-inventory.inventory.label' })} id="inventory-menu-section">
            {canEditInstance && !isInstanceShared && (
              <Button
                id="edit-instance"
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
            )}
            {canViewSource && (
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
            )}
            {
              !openedFromBrowse && (
                <>
                  {
                    canMoveItems && (
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
                    )
                  }
                  {
                    (canMoveItems || canMoveHoldings) && (
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
                    )
                  }
                </>
              )
            }
            {canImport && (
              <Button
                id="dropdown-clickable-reimport-record"
                onClick={() => {
                  onToggle();
                  this.setState({ isImportRecordModalOpened: true });
                }}
                buttonStyle="dropdownItem"
              >
                <Icon icon="lightning">
                  <FormattedMessage id="ui-inventory.copycat.overlaySourceBib" />
                </Icon>
              </Button>
            )}
            {canCreateInstance && (
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
            )}
            <Button
              id="quick-export-trigger"
              onClick={buildOnClickHandler(this.triggerQuickExport)}
              buttonStyle="dropdownItem"
            >
              <Icon icon="download">
                <FormattedMessage id="ui-inventory.exportInstanceInMARC" />
              </Icon>
            </Button>
            {canCreateOrder && (
              <Button
                id="clickable-create-order"
                buttonStyle="dropdownItem"
                onClick={() => {
                  onToggle();
                  this.toggleNewOrderModal();
                }}
              >
                <Icon icon="plus-sign">
                  <FormattedMessage id="ui-inventory.newOrder" />
                </Icon>
              </Button>
            )}
            {
              titleLevelRequestsFeatureEnabled
                ? (
                  <RequestsReorderButton
                    hasReorderPermissions={hasReorderPermissions}
                    requestId={instanceRequests.records[0]?.id}
                    instanceId={instance.id}
                    numberOfRequests={numberOfRequests}
                  />
                )
                : (
                  <Button
                    id="view-requests"
                    onClick={() => {
                      onToggle();
                      this.onClickViewRequests();
                    }}
                    buttonStyle="dropdownItem"
                  >
                    <Icon icon="eye-open">
                      <FormattedMessage id="ui-inventory.viewRequests" />
                    </Icon>
                  </Button>
                )
            }
            <NewInstanceRequestButton
              isTlrEnabled={!!titleLevelRequestsFeatureEnabled}
              instanceId={instance.id}
            />
          </MenuSection>
        )}

        {
          showQuickMarcMenuSection && (
            <MenuSection label={intl.formatMessage({ id: 'ui-inventory.quickMARC.label' })} id="quickmarc-menu-section">
              {canEditMARCRecord && (
                <Button
                  id="edit-instance-marc"
                  buttonStyle="dropdownItem"
                  disabled={!marcRecord}
                  onClick={() => {
                    onToggle();
                    this.editInstanceMarc();
                  }}
                >
                  <Icon icon="edit">
                    <FormattedMessage id="ui-inventory.editInstanceMarc" />
                  </Icon>
                </Button>
              )}
              {canDeriveMARCRecord && (
                <Button
                  id="duplicate-instance-marc"
                  buttonStyle="dropdownItem"
                  disabled={!marcRecord}
                  onClick={() => {
                    onToggle();
                    this.duplicateInstanceMarc();
                  }}
                >
                  <Icon icon="duplicate">
                    <FormattedMessage id="ui-inventory.duplicateInstanceMarc" />
                  </Icon>
                </Button>
              )}
              <IfPermission perm="ui-quick-marc.quick-marc-holdings-editor.create">
                <Button
                  id="create-holdings-marc"
                  buttonStyle="dropdownItem"
                  disabled={!canCreateMARCHoldings}
                  onClick={() => {
                    onToggle();
                    this.createHoldingsMarc();
                  }}
                >
                  <Icon icon="plus-sign">
                    <FormattedMessage id="ui-inventory.createMARCHoldings" />
                  </Icon>
                </Button>
              </IfPermission>
            </MenuSection>
          )
        }

        <Pluggable
          id="copyright-permissions-checker"
          toggle={this.toggleCopyrightModal}
          open={this.state.isCopyrightModalOpened}
          identifier={identifier}
          type="copyright-permissions-checker"
          renderTrigger={({ menuText }) => (
            <Button
              id="copyright-permissions-check"
              buttonStyle="dropdownItem"
              onClick={() => {
                onToggle();
                this.toggleCopyrightModal();
              }}
            >
              <Icon icon="report">
                {menuText}
              </Icon>
            </Button>
          )}
        />
      </>
    );
  };

  render() {
    const {
      match: { params: { id, holdingsrecordid, itemid } },
      stripes,
      onCopy,
      onClose,
      paneWidth,
      tagsEnabled,
      updateLocation,
      intl,
    } = this.props;
    const ci = makeConnectedInstance(this.props, stripes.logger);
    const instance = ci.instance();

    const shortcuts = [
      {
        name: 'new',
        handler: handleKeyCommand(() => {
          if (stripes.hasPerm('ui-inventory.instance.create')) {
            updateLocation({ layer: 'create' });
          }
        }),
      },
      {
        name: 'edit',
        handler: handleKeyCommand(() => {
          if (stripes.hasPerm('ui-inventory.instance.edit')) this.onClickEditInstance();
        }),
      },
      {
        name: 'duplicateRecord',
        handler: handleKeyCommand(() => {
          if (stripes.hasPerm('ui-inventory.instance.create')) onCopy(instance);
        }),
      },
      {
        name: 'expandAllSections',
        handler: (e) => expandAllSections(e, this.accordionStatusRef),
      },
      {
        name: 'collapseAllSections',
        handler: (e) => collapseAllSections(e, this.accordionStatusRef),
      },
    ];


    if (!instance) {
      return (
        <Pane
          id="pane-instancedetails"
          defaultWidth={paneWidth}
          paneTitle={intl.formatMessage({ id: 'ui-inventory.edit' })}
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

    return (
      <DataContext.Consumer>
        {data => (
          <HasCommand
            commands={shortcuts}
            isWithinScope={checkScope}
            scope={document.body}
          >
            <InstanceDetails
              id="pane-instancedetails"
              paneTitle={
                <FormattedMessage
                  id="ui-inventory.instanceRecordTitle"
                  values={{
                    title: instance?.title,
                    publisherAndDate: getPublishingInfo(instance),
                  }}
                />
              }
              paneSubtitle={
                <FormattedMessage
                  id="ui-inventory.instanceRecordSubtitle"
                  values={{
                    hrid: instance?.hrid,
                    updatedDate: getDate(instance?.metadata?.updatedDate),
                  }}
                />
              }
              onClose={onClose}
              actionMenu={this.createActionMenuGetter(instance, data)}
              instance={instance}
              tagsEnabled={tagsEnabled}
              ref={this.accordionStatusRef}
            >
              {
                (!holdingsrecordid && !itemid) ?
                  (
                    <MoveItemsContext>
                      <HoldingsListContainer
                        instance={instance}
                        draggable={this.state.isItemsMovement}
                        droppable
                      />
                    </MoveItemsContext>
                  )
                  :
                  null
              }
            </InstanceDetails>

            <Callout ref={this.calloutRef} />

            {this.state.afterCreate &&
              <CalloutRenderer
                message={<FormattedMessage id="ui-inventory.instance.successfullySaved" values={{ hrid: instance.hrid }} />}
              />
            }

            {
              this.state.findInstancePluginOpened && (
                <InstancePlugin
                  onSelect={this.selectInstance}
                  onClose={this.toggleFindInstancePlugin}
                  withTrigger={false}
                />
              )
            }

            <IfInterface name="copycat-imports">
              <IfPermission perm="copycat.profiles.collection.get">
                <ImportRecordModal
                  isOpen={this.state.isImportRecordModalOpened}
                  currentExternalIdentifier={undefined}
                  handleSubmit={this.handleImportRecordModalSubmit}
                  handleCancel={this.handleImportRecordModalCancel}
                  id={id}
                />
              </IfPermission>
            </IfInterface>

            <NewOrderModal
              open={this.state.isNewOrderModalOpen}
              onCancel={this.toggleNewOrderModal}
            />

          </HasCommand>
        )}
      </DataContext.Consumer>
    );
  }
}

ViewInstance.propTypes = {
  selectedInstance:  PropTypes.object,
  goTo: PropTypes.func.isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
    search: PropTypes.string,
  }).isRequired,
  match: PropTypes.shape({
    path: PropTypes.string.isRequired,
    params: PropTypes.shape({
      id: PropTypes.string,
      holdingsrecordid: PropTypes.string,
      itemid: PropTypes.string,
    }),
  }),
  history: ReactRouterPropTypes.history.isRequired,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func.isRequired,
  }),
  mutator: PropTypes.shape({
    allInstanceItems: PropTypes.object.isRequired,
    holdings: PropTypes.shape({
      POST: PropTypes.func.isRequired,
    }),
    marcRecord: PropTypes.shape({
      GET: PropTypes.func.isRequired,
    }),
    quickExport: PropTypes.shape({
      POST: PropTypes.func.isRequired,
    }),
    query: PropTypes.object.isRequired,
    movableItems: PropTypes.object.isRequired,
    instanceRequests: PropTypes.shape({
      GET: PropTypes.func.isRequired,
      reset: PropTypes.func.isRequired,
    }).isRequired,
  }),
  onClose: PropTypes.func,
  onCopy: PropTypes.func,
  openedFromBrowse: PropTypes.bool,
  paneWidth: PropTypes.string.isRequired,
  resources: PropTypes.shape({
    allInstanceItems: PropTypes.object.isRequired,
    allInstanceHoldings: PropTypes.object.isRequired,
    locations: PropTypes.object.isRequired,
    configs: PropTypes.object.isRequired,
    instanceRequests: PropTypes.shape({
      other: PropTypes.shape({
        totalRecords: PropTypes.number.isRequired,
      }),
      records: PropTypes.arrayOf(PropTypes.object).isRequired,
    }).isRequired,
  }).isRequired,
  stripes: PropTypes.shape({
    connect: PropTypes.func.isRequired,
    hasInterface: PropTypes.func.isRequired,
    hasPerm: PropTypes.func.isRequired,
    locale: PropTypes.string.isRequired,
    logger: PropTypes.object.isRequired,
  }).isRequired,
  tagsEnabled: PropTypes.bool,
  updateLocation: PropTypes.func.isRequired,
};

export default injectIntl(withLocation(stripesConnect(ViewInstance)));
