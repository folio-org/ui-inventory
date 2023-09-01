import React, { createRef } from 'react';
import PropTypes from 'prop-types';
import { parse } from 'query-string';
import ReactRouterPropTypes from 'react-router-prop-types';
import {
  FormattedMessage,
  injectIntl,
} from 'react-intl';
import { flowRight } from 'lodash';

import {
  AppIcon,
  Pluggable,
  stripesConnect,
  checkIfUserInMemberTenant,
  checkIfUserInCentralTenant,
} from '@folio/stripes/core';
import {
  Pane,
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
  isMARCSource,
  isUserInConsortiumMode,
} from './utils';
import {
  CONSORTIUM_PREFIX,
  indentifierTypeNames,
  layers,
  REQUEST_OPEN_STATUSES,
} from './constants';
import { DataContext } from './contexts';

import {
  HoldingsListContainer,
  MoveItemsContext,
  InstanceDetails,
} from './Instance';
import {
  ActionItem,
  withSingleRecordImport,
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
      tenant: '!{tenantId}',
      shouldRefresh: () => false,
    },
    allInstanceItems: {
      accumulate: true,
      fetch: false,
      path: 'inventory/items',
      records: 'items',
      throwErrors: false,
      type: 'okapi',
      tenant: '!{tenantId}',
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
      tenant: '!{tenantId}',
      shouldRefresh: () => false,
    },
    movableItems: {
      type: 'okapi',
      path: 'inventory/items/move',
      fetch: false,
      throwErrors: false,
      tenant: '!{tenantId}',
    },
    marcRecord: {
      type: 'okapi',
      path: 'source-storage/records/:{id}/formatted?idType=INSTANCE',
      accumulate: true,
      throwErrors: false,
      tenant: '!{tenantId}',
    },
    quickExport: {
      type: 'okapi',
      fetch: false,
      path: 'data-export/quick-export',
      throwErrors: false,
      clientGeneratePk: false,
      tenant: '!{tenantId}',
    },
    instanceRelationshipTypes: {
      type: 'okapi',
      records: 'instanceRelationshipTypes',
      path: 'instance-relationship-types?limit=1000&query=cql.allRecords=1 sortby name',
      tenant: '!{tenantId}',
      throwErrors: false,
    },
    locations: {
      type: 'okapi',
      records: 'locations',
      path: 'locations?limit=5000',
      tenant: '!{tenantId}',
      throwErrors: false,
    },
    configs: {
      type: 'okapi',
      records: 'configs',
      path: 'configurations/entries',
      params: {
        query: '(module==SETTINGS and configName==TLR)',
      },
      tenant: '!{tenantId}',
      throwErrors: false,
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
    const { selectedInstance } = this.props;
    const isMARCSourceRecord = isMARCSource(selectedInstance?.source);

    if (isMARCSourceRecord) {
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
    const prevIsMARCSource = isMARCSource(prevInstance?.source);
    const isMARCSourceRecord = isMARCSource(instance?.source);
    const isViewingAnotherRecord = instanceRecordsId !== prevInstanceRecordsId;
    const recordSourceWasChanged = isMARCSourceRecord !== prevIsMARCSource;

    if (isMARCSourceRecord && (isViewingAnotherRecord || recordSourceWasChanged)) {
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
      isShared,
    } = this.props;

    const ci = makeConnectedInstance(this.props, stripes.logger);
    const instance = ci.instance();

    const searchParams = new URLSearchParams(location.search);

    searchParams.delete('relatedRecordVersion');
    searchParams.append('shared', isShared.toString());

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

  hasCentralTenantPerm = (perm) => {
    return this.props.centralTenantPermissions.some(({ permissionName }) => permissionName === perm);
  }

  createActionMenuGetter = (instance, data) => ({ onToggle }) => {
    const {
      isShared,
      canUseSingleRecordImport,
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

    const editBibRecordPerm = 'ui-quick-marc.quick-marc-editor.all';
    const editInstancePerm = 'ui-inventory.instance.edit';
    const isSourceMARC = isMARCSource(instance?.source);
    const canEditInstance = stripes.hasPerm(editInstancePerm);
    const canCreateInstance = stripes.hasPerm('ui-inventory.instance.create');
    const canCreateRequest = stripes.hasPerm('ui-requests.create');
    const canMoveItems = !checkIfUserInCentralTenant(stripes) && stripes.hasPerm('ui-inventory.item.move');
    const canCreateMARCHoldings = stripes.hasPerm('ui-quick-marc.quick-marc-holdings-editor.create');
    const canMoveHoldings = !checkIfUserInCentralTenant(stripes) && stripes.hasPerm('ui-inventory.holdings.move');
    const canEditMARCRecord = checkIfUserInMemberTenant(stripes) && isShared
      ? this.hasCentralTenantPerm(editBibRecordPerm)
      : stripes.hasPerm(editBibRecordPerm);
    const canDeriveMARCRecord = stripes.hasPerm('ui-quick-marc.quick-marc-editor.duplicate');
    const canAddMARCHoldingsRecord = !checkIfUserInCentralTenant(stripes) && stripes.hasPerm('ui-quick-marc.quick-marc-holdings-editor.create');
    const hasReorderPermissions = canCreateRequest || stripes.hasPerm('ui-requests.edit') || stripes.hasPerm('ui-requests.all');
    const canViewMARCSource = stripes.hasPerm('ui-quick-marc.quick-marc-editor.view');
    const canViewInstance = stripes.hasPerm('ui-inventory.instance.view');
    const canViewSource = canViewMARCSource && canViewInstance;
    const canCreateOrder = !checkIfUserInCentralTenant(stripes) && stripes.hasInterface('orders') && stripes.hasPerm('ui-inventory.instance.createOrder');
    const canReorder = stripes.hasPerm('ui-requests.reorderQueue');
    const numberOfRequests = instanceRequests.other?.totalRecords;
    const canReorderRequests = titleLevelRequestsFeatureEnabled && hasReorderPermissions && numberOfRequests && canReorder;
    const canViewRequests = !checkIfUserInCentralTenant(stripes) && !titleLevelRequestsFeatureEnabled;
    const canCreateNewRequest = titleLevelRequestsFeatureEnabled && canCreateRequest;
    const identifier = this.getIdentifiers(data);

    const buildOnClickHandler = onClickHandler => {
      return () => {
        onToggle();

        onClickHandler(this.context.sendCallout);
      };
    };

    const suppressEditInstanceForMemberTenant = checkIfUserInMemberTenant(stripes)
      && instance?.source.startsWith(CONSORTIUM_PREFIX)
      && !this.hasCentralTenantPerm(editInstancePerm);

    const showInventoryMenuSection = (
      canEditInstance
      || canViewSource
      || (!openedFromBrowse && (canMoveItems || canMoveHoldings))
      || canUseSingleRecordImport
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
          <MenuSection
            id="inventory-menu-section"
            label={intl.formatMessage({ id: 'ui-inventory.inventory.label' })}
          >
            {canEditInstance && !suppressEditInstanceForMemberTenant && (
              <ActionItem
                id="edit-instance"
                icon="edit"
                messageId="ui-inventory.editInstance"
                onClickHandler={() => {
                  onToggle();
                  this.onClickEditInstance();
                }}
              />
            )}
            {canViewSource && (
              <ActionItem
                id="clickable-view-source"
                icon="document"
                messageId="ui-inventory.viewSource"
                onClickHandler={(e) => {
                  onToggle();
                  this.handleViewSource(e, instance);
                }}
                disabled={!marcRecord}
              />
            )}
            {!openedFromBrowse && (
              <>
                {canMoveItems && (
                  <ActionItem
                    id="move-instance-items"
                    icon="transfer"
                    messageId={`ui-inventory.moveItems.instance.actionMenu.${this.state.isItemsMovement ? 'disable' : 'enable'}`}
                    onClickHandler={() => {
                      onToggle();
                      this.toggleItemsMovement();
                    }}
                  />
                )}
                {(canMoveItems || canMoveHoldings) && (
                  <ActionItem
                    id="move-instance"
                    icon="arrow-right"
                    messageId="ui-inventory.moveItems"
                    onClickHandler={() => {
                      onToggle();
                      this.toggleFindInstancePlugin();
                    }}
                  />
                )}
              </>
            )}
            {canUseSingleRecordImport && (
              <ActionItem
                id="dropdown-clickable-reimport-record"
                icon="lightning"
                messageId="ui-inventory.copycat.overlaySourceBib"
                onClickHandler={() => {
                  onToggle();
                  this.setState({ isImportRecordModalOpened: true });
                }}
              />
            )}
            {canCreateInstance && (
              <ActionItem
                id="copy-instance"
                icon="duplicate"
                messageId="ui-inventory.duplicateInstance"
                onClickHandler={() => {
                  onToggle();
                  onCopy(instance);
                }}
              />
            )}
            <ActionItem
              id="quick-export-trigger"
              icon="download"
              messageId="ui-inventory.exportInstanceInMARC"
              onClickHandler={buildOnClickHandler(this.triggerQuickExport)}
            />
            {canCreateOrder && (
              <ActionItem
                id="clickable-create-order"
                icon="plus-sign"
                messageId="ui-inventory.newOrder"
                onClickHandler={() => {
                  onToggle();
                  this.toggleNewOrderModal();
                }}
              />
            )}
            {titleLevelRequestsFeatureEnabled && !checkIfUserInCentralTenant(stripes)
              ? (
                <RequestsReorderButton
                  hasReorderPermissions={hasReorderPermissions}
                  requestId={instanceRequests.records[0]?.id}
                  instanceId={instance.id}
                  numberOfRequests={numberOfRequests}
                />
              )
              : !checkIfUserInCentralTenant(stripes) && (
                <ActionItem
                  id="view-requests"
                  icon="eye-open"
                  messageId="ui-inventory.viewRequests"
                  onClickHandler={() => {
                    onToggle();
                    this.onClickViewRequests();
                  }}
                />
              )
            }
            <NewInstanceRequestButton
              isTlrEnabled={!!titleLevelRequestsFeatureEnabled}
              instanceId={instance.id}
            />
          </MenuSection>
        )}

        {showQuickMarcMenuSection && (
          <MenuSection
            id="quickmarc-menu-section"
            label={intl.formatMessage({ id: 'ui-inventory.quickMARC.label' })}
          >
            {canEditMARCRecord && (
              <ActionItem
                id="edit-instance-marc"
                icon="edit"
                messageId="ui-inventory.editInstanceMarc"
                onClickHandler={() => {
                  onToggle();
                  this.editInstanceMarc();
                }}
                disabled={!marcRecord}
              />
            )}
            {canDeriveMARCRecord && (
              <ActionItem
                id="duplicate-instance-marc"
                icon="duplicate"
                messageId="ui-inventory.duplicateInstanceMarc"
                onClickHandler={() => {
                  onToggle();
                  this.duplicateInstanceMarc();
                }}
                disabled={!marcRecord}
              />
            )}
            {canAddMARCHoldingsRecord && (
              <ActionItem
                id="create-holdings-marc"
                icon="plus-sign"
                messageId="ui-inventory.createMARCHoldings"
                onClickHandler={() => {
                  onToggle();
                  this.createHoldingsMarc();
                }}
                disabled={!canCreateMARCHoldings}
              />
            )}
          </MenuSection>
        )}

        <Pluggable
          id="copyright-permissions-checker"
          toggle={this.toggleCopyrightModal}
          open={this.state.isCopyrightModalOpened}
          identifier={identifier}
          type="copyright-permissions-checker"
          renderTrigger={({ menuText }) => (
            <ActionItem
              id="copyright-permissions-check"
              icon="report"
              label={menuText}
              onClickHandler={() => {
                onToggle();
                this.toggleCopyrightModal();
              }}
            />
          )}
        />
      </>
    );
  };

  renderPaneTitle = (instance) => {
    const {
      stripes,
      isShared,
    } = this.props;

    return (
      <FormattedMessage
        id={`ui-inventory.${isUserInConsortiumMode(stripes) ? 'consortia.' : ''}instanceRecordTitle`}
        values={{
          isShared,
          title: instance?.title,
          publisherAndDate: getPublishingInfo(instance),
        }}
      />
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
      canUseSingleRecordImport,
      intl,
      isCentralTenantPermissionsLoading,
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

    if (!instance || isCentralTenantPermissionsLoading) {
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
              paneTitle={this.renderPaneTitle(instance)}
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
            {canUseSingleRecordImport && (
              <ImportRecordModal
                isOpen={this.state.isImportRecordModalOpened}
                currentExternalIdentifier={undefined}
                handleSubmit={this.handleImportRecordModalSubmit}
                handleCancel={this.handleImportRecordModalCancel}
                id={id}
              />
            )}

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
  isShared: PropTypes.bool,
  canUseSingleRecordImport: PropTypes.bool,
  centralTenantPermissions: PropTypes.arrayOf(PropTypes.object).isRequired,
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
  isCentralTenantPermissionsLoading: PropTypes.bool.isRequired,
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

export default flowRight(
  injectIntl,
  withLocation,
  withSingleRecordImport,
)(stripesConnect(ViewInstance));
