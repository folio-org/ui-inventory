import React, { createRef } from 'react';
import PropTypes from 'prop-types';
import { parse } from 'query-string';
import ReactRouterPropTypes from 'react-router-prop-types';
import {
  FormattedMessage,
  injectIntl,
} from 'react-intl';
import {
  flowRight,
  isEmpty,
} from 'lodash';

import {
  Pluggable,
  stripesConnect,
  checkIfUserInMemberTenant,
  checkIfUserInCentralTenant,
  getUserTenantsPermissions,
} from '@folio/stripes/core';
import {
  MenuSection,
  Callout,
  checkScope,
  HasCommand,
  collapseAllSections,
  expandAllSections,
  ConfirmationModal,
} from '@folio/stripes/components';

import { CENTRAL_ORDERING_SETTINGS_KEY } from '@folio/stripes-acq-components';

import ViewHoldingsRecord from './ViewHoldingsRecord';
import makeConnectedInstance from './ConnectedInstance';
import withLocation from './withLocation';
import InstancePlugin from './components/InstancePlugin';
import {
  isUserInConsortiumMode,
  handleKeyCommand,
  isInstanceShadowCopy,
  isMARCSource,
  isLinkedDataSource,
  getLinkedAuthorityIds,
  setRecordForDeletion,
  redirectToMarcEditPage,
  checkIfCentralOrderingIsActive,
} from './utils';
import {
  CONSORTIUM_PREFIX,
  HTTP_RESPONSE_STATUS_CODES,
  indentifierTypeNames,
  INSTANCE_RECORD_TYPE,
  INSTANCE_SHARING_STATUSES,
  layers,
  LEADER_RECORD_STATUSES,
  LINKED_DATA_CHECK_EXTERNAL_RESOURCE_FETCHABLE,
  LINKED_DATA_EDITOR_PERM,
  LINKED_DATA_ID_PREFIX,
  LINKED_DATA_RESOURCES_ROUTE,
  REQUEST_OPEN_STATUSES,
} from './constants';
import { DataContext } from './contexts';

import {
  HoldingsListContainer,
  MoveItemsContext,
  InstanceDetails,
  InstanceWarningPane,
  InstanceLoadingPane,
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
  editInstance: 'edit-bibliographic',
  duplicateInstance: 'derive-bibliographic',
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
        query: 'instanceId==:{id} sortBy effectiveLocation.name callNumberPrefix callNumber callNumberSuffix',
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
    centralOrdering: {
      type: 'okapi',
      path: 'orders-storage/settings',
      throwErrors: false,
      params: {
        limit: '1',
        query: `key=${CENTRAL_ORDERING_SETTINGS_KEY}`,
      },
      tenant: '!{centralTenantId}',
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
    },
    instanceRelationshipTypes: {
      type: 'okapi',
      records: 'instanceRelationshipTypes',
      path: 'instance-relationship-types?limit=1000&query=cql.allRecords=1 sortby name',
      tenant: '!{tenantId}',
      throwErrors: false,
    },
    configs: {
      type: 'okapi',
      records: 'configs',
      path: 'settings/entries',
      params: {
        query: '(scope==settings and key==TLR)',
      },
      tenant: '!{tenantId}',
      throwErrors: false,
    },
    shareInstance: {
      type: 'okapi',
      path: 'consortia/!{consortiumId}/sharing/instances',
      accumulate: true,
      throwErrors: false,
    },
    authorities: {
      type: 'okapi',
      path: 'authority-storage/authorities',
      accumulate: true,
      throwErrors: false,
    },
    checkCanBeOpenedInLinkedData: {
      type: 'okapi',
      path: 'linked-data/inventory-instance/:{id}/import-supported',
      accumulate: true,
      throwErrors: false,
    }
  });

  constructor(props) {
    super(props);

    const logger = props.stripes.logger;
    this.log = logger.log.bind(logger);

    this.state = {
      isInstanceSharing: false,
      marcRecord: null,
      canBeOpenedInLinkedData: false,
      findInstancePluginOpened: false,
      isItemsMovement: false,
      isImportRecordModalOpened: false,
      isCopyrightModalOpened: false,
      isShareLocalInstanceModalOpen: false,
      isShareButtonDisabled: false,
      isUnlinkAuthoritiesModalOpen: false,
      isSetForDeletionModalOpen: false,
      linkedAuthoritiesLength: 0,
      isNewOrderModalOpen: false,
      afterCreate: false,
      instancesQuickExportInProgress: false,
      userTenantPermissions: [],
    };
    this.instanceId = null;
    this.intervalId = null;
    this.cViewHoldingsRecord = this.props.stripes.connect(ViewHoldingsRecord);

    this.calloutRef = createRef();
    this.accordionStatusRef = createRef();
  }

  componentDidMount() {
    const {
      selectedInstance,
      stripes,
    } = this.props;
    const isMARCSourceRecord = isMARCSource(selectedInstance?.source);
    const isLinkedDataSourceRecord = isLinkedDataSource(selectedInstance?.source);

    if (isMARCSourceRecord || isLinkedDataSourceRecord) {
      this.getMARCRecord();
      this.checkCanBeOpenedInLinkedData();
    }

    this.setTlrSettings();

    if (isUserInConsortiumMode(stripes)) {
      this.getCurrentTenantPermissions();
    }
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
    const isLinkedDataSourceRecord = isLinkedDataSource(instance?.source);
    const isViewingAnotherRecord = instanceRecordsId !== prevInstanceRecordsId;
    const recordSourceWasChanged = isMARCSourceRecord !== prevIsMARCSource;

    if ((isMARCSourceRecord || isLinkedDataSourceRecord) && (isViewingAnotherRecord || recordSourceWasChanged)) {
      this.getMARCRecord();
      this.checkCanBeOpenedInLinkedData();
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
    clearInterval(this.intervalId);
  }

  getCurrentTenantPermissions = () => {
    const {
      stripes,
      stripes: { user: { user: { tenants } } },
    } = this.props;

    getUserTenantsPermissions(stripes, tenants).then(userTenantPermissions => this.setState({ userTenantPermissions }));
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

  checkCanBeOpenedInLinkedData = async () => {
    const {
      mutator,
      stripes,
      selectedInstance: { id, source },
    } = this.props;
    const {
      canBeOpenedInLinkedData: prevCanBeOpenedInLinkedData,
    } = this.state;

    if (prevCanBeOpenedInLinkedData) this.setState({ canBeOpenedInLinkedData: false });

    if (!id || !isMARCSource(source) || !stripes.hasPerm(LINKED_DATA_EDITOR_PERM) || !stripes.hasPerm(LINKED_DATA_CHECK_EXTERNAL_RESOURCE_FETCHABLE)) return;

    try {
      const response = await mutator.checkCanBeOpenedInLinkedData.GET(id);

      this.setState({ canBeOpenedInLinkedData: response });
    } catch {
      this.setState({ canBeOpenedInLinkedData: false });
    }
  }

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

    redirectToMarcEditPage(`/inventory/quick-marc/${page}/${instance.id}`, instance, location, history);
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

      const result = await this.props.mutator.quickExport.POST({
        uuids: instanceIds,
        type: 'uuid',
        recordType: INSTANCE_RECORD_TYPE
      });
      const generator = new IdReportGenerator('QuickInstanceExport', result?.jobExecutionHrId);

      const csvFileName = generator.getCSVFileName();
      const marcFileName = generator.getMARCFileName();

      generator.toCSV(instanceIds);

      this.calloutRef.current.sendCallout({
        timeout: 0,
        type: 'success',
        message: <FormattedMessage
          id="ui-inventory.exportInstancesInMARC.complete"
          values={{ csvFileName, marcFileName }}
        />,
      });
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

  showUnsuccessfulShareInstanceCallout = (instanceTitle) => {
    this.calloutRef.current?.sendCallout({
      type: 'error',
      message: <FormattedMessage id="ui-inventory.shareLocalInstance.toast.unsuccessful" values={{ instanceTitle }} />,
    });
  }

  checkInstanceSharingProgress = ({ sourceTenantId, instanceIdentifier }) => {
    return this.props.mutator.shareInstance.GET({
      params: { sourceTenantId, instanceIdentifier },
    });
  }

  waitForInstanceSharingComplete = ({ sourceTenantId, instanceIdentifier }) => {
    return new Promise((resolve, reject) => {
      this.intervalId = setInterval(() => {
        const onError = error => {
          clearInterval(this.intervalId);
          reject(error);
        };
        const onSuccess = response => {
          const sharingStatus = response?.sharingInstances[0]?.status;

          if (sharingStatus === INSTANCE_SHARING_STATUSES.COMPLETE) {
            clearInterval(this.intervalId);
            resolve(response);
          }

          if (sharingStatus === INSTANCE_SHARING_STATUSES.ERROR) {
            onError(response);
          }
        };

        this.checkInstanceSharingProgress({ sourceTenantId, instanceIdentifier })
          .then(onSuccess)
          .catch(onError);
      }, 2000);
    });
  }

  handleShareLocalInstance = (instance = {}) => {
    const centralTenantId = this.props.centralTenantId;
    const sourceTenantId = this.props.okapi.tenant;
    const instanceTitle = instance.title;
    const instanceIdentifier = instance.id;

    this.props.mutator.shareInstance.POST({
      sourceTenantId,
      instanceIdentifier,
      targetTenantId: centralTenantId,
    })
      .then(async () => {
        this.setState({
          isUnlinkAuthoritiesModalOpen: false,
          isShareLocalInstanceModalOpen: false,
          isInstanceSharing: true,
          isShareButtonDisabled: false,
        });

        await this.waitForInstanceSharingComplete({ sourceTenantId, instanceIdentifier });
      })
      .then(async () => {
        await this.props.refetchInstance();
        this.setState({ isInstanceSharing: false });
        this.calloutRef.current.sendCallout({
          type: 'success',
          message: <FormattedMessage id="ui-inventory.shareLocalInstance.toast.successful" values={{ instanceTitle }} />,
        });
      })
      .catch(() => {
        this.setState({
          isUnlinkAuthoritiesModalOpen: false,
          isShareLocalInstanceModalOpen: false,
          isInstanceSharing: false,
          isShareButtonDisabled: false,
        });
        this.showUnsuccessfulShareInstanceCallout(instanceTitle);
      });
  }

  checkIfHasLinkedAuthorities = () => {
    this.setState({ isShareButtonDisabled: true });

    const { selectedInstance } = this.props;
    const authorityIds = getLinkedAuthorityIds(selectedInstance);

    if (isEmpty(authorityIds)) {
      this.handleShareLocalInstance(selectedInstance);
      return;
    }

    this.props.mutator.authorities.GET({
      params: {
        query: `id==(${authorityIds.join(' or ')})`,
      }
    }).then(({ authorities }) => {
      const localAuthorities = authorities.filter(authority => !authority.source.startsWith(CONSORTIUM_PREFIX));

      if (localAuthorities.length) {
        this.setState({
          linkedAuthoritiesLength: localAuthorities.length,
          isShareLocalInstanceModalOpen: false,
          isUnlinkAuthoritiesModalOpen: true,
        });
      } else {
        this.handleShareLocalInstance(selectedInstance);
      }
    }).catch(() => {
      this.setState({
        isShareLocalInstanceModalOpen: false,
        isShareButtonDisabled: false,
      });

      this.calloutRef.current.sendCallout({
        type: 'error',
        message: <FormattedMessage id="ui-inventory.communicationProblem" />,
      });
    });
  }

  handleCloseUnlinkModal = () => {
    this.setState({
      isUnlinkAuthoritiesModalOpen: false,
      isShareButtonDisabled: false,
    });
  }

  handleCloseSetForDeletionModal = () => {
    this.setState({ isSetForDeletionModalOpen: false });
  }

  handleSetForDeletion = () => {
    const {
      okapi,
      isShared,
      centralTenantId,
      refetchInstance,
      selectedInstance: {
        title: instanceTitle,
        id,
        source,
      },
    } = this.props;
    const tenantId = isShared && !isInstanceShadowCopy(source) ? centralTenantId : okapi.tenant;

    setRecordForDeletion(okapi, id, tenantId)
      .then(async () => {
        this.handleCloseSetForDeletionModal();

        await refetchInstance();
        this.calloutRef.current.sendCallout({
          type: 'success',
          message: <FormattedMessage id="ui-inventory.setForDeletion.toast.successful" values={{ instanceTitle }} />,
        });
      })
      .catch(() => {
        this.handleCloseSetForDeletionModal();
        this.calloutRef.current.sendCallout({
          type: 'error',
          message: <FormattedMessage id="ui-inventory.setForDeletion.toast.unsuccessful" values={{ instanceTitle }} />,
        });
      });
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
    const selectedInstance = this.props?.selectedInstance;

    if (!selectedInstance || isEmpty(data)) {
      return null;
    }

    const { identifierTypesById } = data;
    const { ISBN, ISSN } = indentifierTypeNames;

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
    return this.props.centralTenantPermissions.has(perm);
  }

  createActionMenuGetter = (instance, data) => ({ onToggle }) => {
    const {
      isShared,
      canUseSingleRecordImport,
      onCopy,
      stripes,
      intl,
      history,
      resources: {
        instanceRequests,
        centralOrdering,
        allInstanceHoldings,
      },
    } = this.props;
    const {
      marcRecord,
      canBeOpenedInLinkedData,
      titleLevelRequestsFeatureEnabled,
    } = this.state;
    const source = instance?.source;
    const noInstanceHoldings = allInstanceHoldings?.other?.totalRecords === 0;

    const editBibRecordPerm = 'ui-quick-marc.quick-marc-editor.all';
    const editInstancePerm = 'ui-inventory.instance.edit';
    const setForDeletionAndSuppressPerm = 'ui-inventory.instance.set-records-for-deletion.execute';
    const isSourceMARC = isMARCSource(source);
    const canEditInstance = stripes.hasPerm(editInstancePerm);
    const canCreateInstance = stripes.hasPerm('ui-inventory.instance.create');
    const canCreateRequest = stripes.hasPerm('ui-requests.create');
    const canMoveItems = !checkIfUserInCentralTenant(stripes) && !noInstanceHoldings && stripes.hasPerm('ui-inventory.item.move');
    const canCreateMARCHoldings = stripes.hasPerm('ui-quick-marc.quick-marc-holdings-editor.create');
    const canMoveHoldings = !checkIfUserInCentralTenant(stripes) && !noInstanceHoldings && stripes.hasPerm('ui-inventory.holdings.move');
    const canEditMARCRecord = checkIfUserInMemberTenant(stripes) && isShared
      ? this.hasCentralTenantPerm(editBibRecordPerm)
      : stripes.hasPerm(editBibRecordPerm);
    const canDeriveMARCRecord = stripes.hasPerm('ui-quick-marc.quick-marc-editor.derive.execute');
    const canAddMARCHoldingsRecord = !checkIfUserInCentralTenant(stripes) && stripes.hasPerm('ui-quick-marc.quick-marc-holdings-editor.create');
    const hasReorderPermissions = canCreateRequest || stripes.hasPerm('ui-requests.edit') || stripes.hasPerm('ui-requests.all');
    const canViewMARCSource = stripes.hasPerm('ui-quick-marc.quick-marc-editor.view');
    const canViewInstance = stripes.hasPerm('ui-inventory.instance.view');
    const canViewSource = canViewMARCSource && canViewInstance;
    const canShareLocalInstance = checkIfUserInMemberTenant(stripes)
      && stripes.hasPerm('consortia.inventory.local.sharing-instances.execute')
      && !isShared
      && !isInstanceShadowCopy(source);

    const canCentralTenantCreateOrder = checkIfUserInCentralTenant(stripes) && checkIfCentralOrderingIsActive(centralOrdering);
    const canCreateOrder = (!checkIfUserInCentralTenant(stripes) && stripes.hasInterface('orders') && stripes.hasPerm('ui-inventory.instance.order.create')) || canCentralTenantCreateOrder;
    const canReorder = stripes.hasPerm('ui-requests.reorderQueue.execute');
    const canExportMarc = stripes.hasPerm('ui-data-export.edit');
    const canAccessLinkedDataOptions = stripes.hasPerm(LINKED_DATA_EDITOR_PERM);
    const isSourceLinkedData = isLinkedDataSource(source);
    const showLinkedDataMenuSection = canAccessLinkedDataOptions && (isSourceLinkedData || canBeOpenedInLinkedData);

    const hasSetForDeletionPermission = stripes.hasPerm(setForDeletionAndSuppressPerm);
    const canNonConsortialTenantSetForDeletion = !stripes.hasInterface('consortia') && hasSetForDeletionPermission;
    const canCentralTenantSetForDeletion = checkIfUserInCentralTenant(stripes) && hasSetForDeletionPermission;
    const canMemberTenantSetForDeletion = (isShared && this.hasCentralTenantPerm(setForDeletionAndSuppressPerm)) || (!isShared && hasSetForDeletionPermission);
    const canSetForDeletion = canNonConsortialTenantSetForDeletion || canCentralTenantSetForDeletion || canMemberTenantSetForDeletion;

    const isRecordSuppressed = instance?.discoverySuppress && instance?.staffSuppress;
    const isRecordSetForDeletion = isSourceMARC
      && instance?.discoverySuppress
      && instance?.deleted
      && instance?.leaderRecordStatus === LEADER_RECORD_STATUSES.DELETED;
    const isInstanceSuppressed = isRecordSuppressed || isRecordSetForDeletion;

    const numberOfRequests = instanceRequests.other?.totalRecords;
    const canReorderRequests = titleLevelRequestsFeatureEnabled && hasReorderPermissions && numberOfRequests && canReorder;
    const canViewRequests = !checkIfUserInCentralTenant(stripes) && !titleLevelRequestsFeatureEnabled;
    const canCreateNewRequest = !checkIfUserInCentralTenant(stripes) && titleLevelRequestsFeatureEnabled && canCreateRequest;
    const identifier = this.getIdentifiers(data);

    const buildOnClickHandler = onClickHandler => {
      return () => {
        onToggle();

        onClickHandler(this.context.sendCallout);
      };
    };

    const navigateToLinkedDataEditor = () => {
      const selectedIdentifier = instance.identifiers?.find(({ value }) => value.includes(LINKED_DATA_ID_PREFIX))?.value;
      const currentLocationState = {
        state: {
          from: {
            pathname: history?.location?.pathname,
            search: history?.location?.search,
          },
        },
      };

      if (!selectedIdentifier) {
        if (!canBeOpenedInLinkedData) return;

        history.push({
          pathname: `${LINKED_DATA_RESOURCES_ROUTE}/external/${instance.id}/preview`,
          ...currentLocationState,
        });
      } else {
        const identifierLiteral = selectedIdentifier?.replace(LINKED_DATA_ID_PREFIX, '');

        history.push({
          pathname: `${LINKED_DATA_RESOURCES_ROUTE}/${identifierLiteral}/edit`,
          ...currentLocationState,
        });
      }
    };

    const suppressEditInstanceForMemberTenant = checkIfUserInMemberTenant(stripes)
      && isShared
      && !this.hasCentralTenantPerm(editInstancePerm);

    const showInventoryMenuSection = (
      canEditInstance
      || canViewSource
      || (canMoveItems || canMoveHoldings)
      || canUseSingleRecordImport
      || canCreateInstance
      || canCreateOrder
      || canReorderRequests
      || canViewRequests
      || canCreateNewRequest
    );

    const showQuickMarcMenuSection = isSourceMARC && (canCreateMARCHoldings || canEditMARCRecord || canDeriveMARCRecord);
    const canMoveHoldingsItemsToAnotherInstance = canMoveItems || canMoveHoldings;

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
            {canMoveHoldingsItemsToAnotherInstance && (
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
            {canUseSingleRecordImport && !isSourceLinkedData && (
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
            {canShareLocalInstance && (
              <ActionItem
                id="share-local-instance"
                icon="graph"
                messageId="ui-inventory.shareLocalInstance"
                onClickHandler={() => {
                  onToggle();
                  this.setState({ isShareLocalInstanceModalOpen: true });
                }}
              />
            )}
            {canExportMarc && (
              <ActionItem
                id="quick-export-trigger"
                icon="download"
                messageId="ui-inventory.exportInstanceInMARC"
                onClickHandler={buildOnClickHandler(this.triggerQuickExport)}
              />
            )}
            {canSetForDeletion && !isInstanceSuppressed && !isSourceLinkedData && (
              <ActionItem
                id="quick-export-trigger"
                icon="flag"
                messageId="ui-inventory.setRecordForDeletion"
                onClickHandler={() => this.setState({ isSetForDeletionModalOpen: true })}
              />
            )}
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
              isTlrEnabled={canCreateNewRequest}
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

        {showLinkedDataMenuSection && (
          <MenuSection
            id="ld-menu-section"
            label={intl.formatMessage({ id: 'ui-inventory.ld.label' })}
          >
            <ActionItem
              id="edit-resource-in-ld"
              icon="edit"
              messageId="ui-inventory.editInLinkedDataEditor"
              onClickHandler={buildOnClickHandler(navigateToLinkedDataEditor)}
            />
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

  renderInstanceDetails = (data, instance) => {
    const {
      match: { params: { holdingsrecordid, itemid } },
      okapi,
      onClose,
      tagsEnabled,
      mutateInstance,
      isCentralTenantPermissionsLoading,
      isShared,
      isLoading,
      isError,
      error,
    } = this.props;
    const { isInstanceSharing } = this.state;

    const isUserLacksPermToViewSharedInstance = isError
      && error?.response?.status === HTTP_RESPONSE_STATUS_CODES.FORBIDDEN
      && isShared;

    const isInstanceLoading = isLoading || !instance || isCentralTenantPermissionsLoading;
    const keyInStorageToHoldingsAccsState = ['holdings'];

    if (isUserLacksPermToViewSharedInstance) {
      return (
        <InstanceWarningPane
          onClose={onClose}
          messageBannerText={<FormattedMessage id="ui-inventory.warning.instance.accessSharedInstance" />}
        />
      );
    }

    if (isInstanceSharing) {
      return (
        <InstanceWarningPane
          onClose={onClose}
          messageBannerText={<FormattedMessage id="ui-inventory.warning.instance.sharingLocalInstance" />}
        />
      );
    }

    if (isInstanceLoading) {
      return <InstanceLoadingPane onClose={onClose} />;
    }

    return (
      <InstanceDetails
        id="pane-instancedetails"
        onClose={onClose}
        actionMenu={this.createActionMenuGetter(instance, data)}
        instance={instance}
        tagsEnabled={tagsEnabled}
        ref={this.accordionStatusRef}
        userTenantPermissions={this.state.userTenantPermissions}
        isShared={isShared}
        mutateInstance={mutateInstance}
      >
        {
          (!holdingsrecordid && !itemid) ?
            (
              <MoveItemsContext>
                <HoldingsListContainer
                  instance={instance}
                  draggable={this.state.isItemsMovement}
                  tenantId={okapi.tenant}
                  pathToAccordionsState={keyInStorageToHoldingsAccsState}
                  droppable
                />
              </MoveItemsContext>
            )
            :
            null
        }
      </InstanceDetails>
    );
  }

  render() {
    const {
      match: { params: { id } },
      stripes,
      onCopy,
      updateLocation,
      canUseSingleRecordImport,
      selectedInstance,
    } = this.props;
    const {
      linkedAuthoritiesLength,
      isShareButtonDisabled,
    } = this.state;

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
        name: 'editMARC',
        handler: handleKeyCommand(() => {
          if (!isMARCSource(selectedInstance.source)) {
            return;
          }

          if (!stripes.hasPerm('ui-quick-marc.quick-marc-editor.all')) {
            this.calloutRef.current.sendCallout({
              type: 'error',
              message: <FormattedMessage id="ui-inventory.shortcut.editMARC.noPermission" />,
            });
            return;
          }

          this.editInstanceMarc();
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

    return (
      <DataContext.Consumer>
        {data => (
          <HasCommand
            commands={shortcuts}
            isWithinScope={checkScope}
            scope={document.body}
          >
            {this.renderInstanceDetails(data, instance)}
            <Callout ref={this.calloutRef} />

            {this.state.afterCreate && !isEmpty(instance) &&
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

            <ConfirmationModal
              open={this.state.isShareLocalInstanceModalOpen}
              heading={<FormattedMessage id="ui-inventory.shareLocalInstance.modal.header" />}
              message={<FormattedMessage id="ui-inventory.shareLocalInstance.modal.message" values={{ instanceTitle: instance?.title }} />}
              confirmLabel={<FormattedMessage id="ui-inventory.shareLocalInstance.modal.confirmButton" />}
              onCancel={() => this.setState({ isShareLocalInstanceModalOpen: false })}
              onConfirm={this.checkIfHasLinkedAuthorities}
              isConfirmButtonDisabled={isShareButtonDisabled}
            />

            <ConfirmationModal
              open={this.state.isUnlinkAuthoritiesModalOpen}
              heading={<FormattedMessage id="ui-inventory.unlinkLocalMarcAuthorities.modal.header" />}
              message={<FormattedMessage id="ui-inventory.unlinkLocalMarcAuthorities.modal.message" values={{ linkedAuthoritiesLength }} />}
              confirmLabel={<FormattedMessage id="ui-inventory.unlinkLocalMarcAuthorities.modal.proceed" />}
              onCancel={this.handleCloseUnlinkModal}
              onConfirm={() => this.handleShareLocalInstance(instance)}
            />

            <ConfirmationModal
              open={this.state.isSetForDeletionModalOpen}
              heading={<FormattedMessage id="ui-inventory.setForDeletion.modal.header" />}
              message={<FormattedMessage id="ui-inventory.setForDeletion.modal.message" values={{ instanceTitle: instance?.title }} />}
              confirmLabel={<FormattedMessage id="ui-inventory.confirm" />}
              onCancel={this.handleCloseSetForDeletionModal}
              onConfirm={this.handleSetForDeletion}
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
  centralTenantPermissions: PropTypes.instanceOf(Set).isRequired,
  selectedInstance:  PropTypes.object,
  centralTenantId: PropTypes.string,
  refetchInstance: PropTypes.func,
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
    shareInstance: PropTypes.shape({
      POST: PropTypes.func.isRequired,
      GET: PropTypes.func.isRequired,
    }).isRequired,
    checkCanBeOpenedInLinkedData: PropTypes.shape({
      GET: PropTypes.func.isRequired,
    }).isRequired,
    authorities: PropTypes.shape({
      GET: PropTypes.func.isRequired,
    }).isRequired,
  }),
  onClose: PropTypes.func,
  onCopy: PropTypes.func,
  resources: PropTypes.shape({
    allInstanceItems: PropTypes.object.isRequired,
    allInstanceHoldings: PropTypes.object.isRequired,
    centralOrdering: PropTypes.object.isRequired,
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
    user: PropTypes.shape({
      user: PropTypes.shape({
        tenants: PropTypes.arrayOf(PropTypes.object),
      }).isRequired
    }).isRequired,
  }).isRequired,
  okapi: PropTypes.shape({
    tenant: PropTypes.string.isRequired,
    token: PropTypes.string.isRequired
  }).isRequired,
  tagsEnabled: PropTypes.bool,
  updateLocation: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  isError: PropTypes.bool,
  error: PropTypes.object,
  mutateInstance: PropTypes.func,
};

export default flowRight(
  injectIntl,
  withLocation,
  withSingleRecordImport,
)(stripesConnect(ViewInstance));
