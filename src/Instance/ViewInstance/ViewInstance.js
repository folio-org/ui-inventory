import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  useHistory,
  useLocation,
  useParams,
} from 'react-router-dom';
import {
  flow,
  isEmpty,
} from 'lodash';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import {
  checkIfUserInMemberTenant,
  getUserTenantsPermissions,
  stripesConnect,
  useCallout,
  useStripes,
  useUserTenantPermissions,
} from '@folio/stripes/core';
import { withTags } from '@folio/stripes/smart-components';
import {
  checkScope,
  HasCommand,
} from '@folio/stripes/components';

import {
  ViewInstancePane,
  InstanceActionMenu,
  InstanceModals,
} from './components';
import { MoveItemsContext } from '../MoveItemsContext';
import { HoldingsListContainer } from '../HoldingsList';

import { withSingleRecordImport } from '../../hocs';
import { useInstance } from '../../common';
import { useMarcRecordQuery } from '../../hooks';
import {
  useInstanceImportSupportedQuery,
  useCirculationInstanceRequestsQuery,
  useInstanceModalsContext,
  useSetRecordForDeletion,
  useImportRecord,
  useInstanceMutation,
  useAuthoritiesByIdQuery,
  useInstanceSharing,
  useInstanceDetailsShortcuts,
} from '../hooks';

import {
  flattenCentralTenantPermissions,
  getLinkedAuthorityIds,
  isInstanceShadowCopy,
  isLinkedDataSource,
  isMARCSource,
  isUserInConsortiumMode,
} from '../../utils';
import {
  CONSORTIUM_PREFIX,
  INSTANCE_RECORD_TYPE,
  LINKED_DATA_CHECK_EXTERNAL_RESOURCE_FETCHABLE,
  LINKED_DATA_EDITOR_PERM,
} from '../../constants';

const ViewInstance = (props) => {
  const { canUseSingleRecordImport, onCopy, focusTitleOnInstanceLoad } = props;

  const callout = useCallout();
  const stripes = useStripes();
  const { id } = useParams();
  const history = useHistory();
  const location = useLocation();
  const paneTitleRef = useRef(null);

  const centralTenantId = stripes.user.user?.consortium?.centralTenantId;

  const {
    instance = {},
    isLoading,
    refetch,
    isError,
    error,
  } = useInstance(id);

  const [linkedAuthorityIds, setLinkedAuthorityIds] = useState([]);
  const [linkedAuthoritiesLength, setLinkedAuthoritiesLength] = useState(0);
  const [shouldQueryAuthorities, setShouldQueryAuthorities] = useState(false);
  const [canBeOpenedInLinkedData, setCanBeOpenedInLinkedData] = useState(false);
  const [isMARCSourceRecord, setIsMARCSourceRecord] = useState(false);
  const [isLinkedDataSourceRecord, setIsLinkedDataSourceRecord] = useState(false);
  const [userTenantPermissions, setUserTenantPermissions] = useState([]);

  const isMarcOrLinkedDataSourceRecord = Boolean(isMARCSourceRecord || isLinkedDataSourceRecord);

  useEffect(() => {
    setIsMARCSourceRecord(isMARCSource(instance.source));
    setIsLinkedDataSourceRecord(isLinkedDataSource(instance.source));
  }, [instance]);

  const isShared = Boolean(instance.shared);
  const tenantId = instance.tenantId ?? stripes.okapi.tenant;

  const {
    userPermissions: centralTenantPermissions,
    isFetching: isCentralTenantPermissionsLoading,
  } = useUserTenantPermissions({ tenantId: centralTenantId }, {
    enabled: Boolean(isShared && checkIfUserInMemberTenant(stripes)),
  });
  const { data: isInstanceImportSupported } = useInstanceImportSupportedQuery(instance.id, { enabled: isMarcOrLinkedDataSourceRecord });
  const { data: marcRecord } = useMarcRecordQuery(instance.id, INSTANCE_RECORD_TYPE, isShared ? centralTenantId : tenantId, { enabled: isMarcOrLinkedDataSourceRecord });
  const { data: { requests = [], totalRecords: totalRequestsRecords } } = useCirculationInstanceRequestsQuery(instance.id, tenantId);

  useEffect(() => {
    const checkCanBeOpenedInLinkedData = () => {
      if (canBeOpenedInLinkedData) {
        setCanBeOpenedInLinkedData(false);
      }

      if (!instance.id || !isMARCSource(instance.source) || !stripes.hasPerm(LINKED_DATA_EDITOR_PERM) || !stripes.hasPerm(LINKED_DATA_CHECK_EXTERNAL_RESOURCE_FETCHABLE)) return;

      setCanBeOpenedInLinkedData(Boolean(isInstanceImportSupported));
    };

    if (isMarcOrLinkedDataSourceRecord) {
      checkCanBeOpenedInLinkedData();
    }
  }, [isMarcOrLinkedDataSourceRecord, isInstanceImportSupported, instance]);

  useEffect(() => {
    if (isUserInConsortiumMode(stripes)) {
      const { user: { user: { tenants } } } = stripes;
      getUserTenantsPermissions(stripes, tenants).then(perms => setUserTenantPermissions(perms));
    }
  }, [stripes.user?.user?.tenants]);

  useEffect(() => {
    if (!isLoading && instance?.id && focusTitleOnInstanceLoad && !isCentralTenantPermissionsLoading) {
      paneTitleRef.current?.focus();
    }
  }, [isLoading, instance, focusTitleOnInstanceLoad, isCentralTenantPermissionsLoading]);

  const {
    isItemsMovement,
    setIsShareLocalInstanceModalOpen,
    setIsUnlinkAuthoritiesModalOpen,
    setIsShareButtonDisabled,
    setIsSetForDeletionModalOpen,
    setIsImportRecordModalOpen,
  } = useInstanceModalsContext();

  const { isInstanceSharing, handleShareLocalInstance } = useInstanceSharing({
    instance,
    tenantId,
    centralTenantId,
    refetchInstance: refetch,
    sendCallout: callout.sendCallout,
  });
  const { mutateInstance: mutateEntity } = useInstanceMutation({ tenantId });
  const { importRecord } = useImportRecord();

  const tenantIdForDeletion = isShared && !isInstanceShadowCopy(instance.source) ? centralTenantId : stripes.okapi.tenant;
  const { setRecordForDeletion } = useSetRecordForDeletion(tenantIdForDeletion);

  useAuthoritiesByIdQuery(linkedAuthorityIds, {
    enabled: shouldQueryAuthorities,
    onSuccess: async (authoritiesData) => {
      const localAuthorities = authoritiesData.filter(authority => !authority.source.startsWith(CONSORTIUM_PREFIX));

      if (localAuthorities.length) {
        setLinkedAuthoritiesLength(localAuthorities.length);
        setIsShareLocalInstanceModalOpen(false);
        setIsUnlinkAuthoritiesModalOpen(true);
      } else {
        await handleShareLocalInstance();
      }
      setShouldQueryAuthorities(false);
    },
    onError: () => {
      setIsShareLocalInstanceModalOpen(false);
      setIsShareButtonDisabled(false);

      callout.sendCallout({
        type: 'error',
        message: <FormattedMessage id="ui-inventory.communicationProblem" />,
      });
    },
  });

  const shortcuts = useInstanceDetailsShortcuts({
    instance,
    marcRecord,
    callout,
    canBeOpenedInLinkedData,
  });

  const mutateInstance = async (entity, { onError }) => {
    await mutateEntity(entity, { onSuccess: refetch, onError });
  };

  const flattenedPermissions = useMemo(() => flattenCentralTenantPermissions(centralTenantPermissions), [centralTenantPermissions]);

  const renderActionMenu = useCallback(({ onToggle }) => {
    return (
      <InstanceActionMenu
        onToggle={onToggle}
        instance={instance}
        isShared={isShared}
        marcRecord={marcRecord}
        centralTenantPermissions={centralTenantPermissions}
        canUseSingleRecordImport={canUseSingleRecordImport}
        canBeOpenedInLinkedData={canBeOpenedInLinkedData}
        callout={callout}
        tenant={tenantId}
        requests={requests}
        onCopy={onCopy}
        numberOfRequests={totalRequestsRecords || 0}
      />
    );
  }, [instance, isShared, marcRecord, centralTenantPermissions, canUseSingleRecordImport, canBeOpenedInLinkedData, tenantId, requests, totalRequestsRecords]);

  const checkIfHasLinkedAuthorities = async () => {
    const authorityIds = getLinkedAuthorityIds(instance);
    setLinkedAuthorityIds(authorityIds);

    if (isEmpty(authorityIds)) {
      await handleShareLocalInstance();
    } else {
      setShouldQueryAuthorities(true);
    }
  };

  const onSetForDeletion = async () => {
    try {
      await setRecordForDeletion(instance.id);
      setIsSetForDeletionModalOpen(false);
      await refetch();

      callout.sendCallout({
        type: 'success',
        message: <FormattedMessage id="ui-inventory.setForDeletion.toast.successful" values={{ instanceTitle: instance?.title }} />,
      });
    } catch {
      setIsSetForDeletionModalOpen(false);

      callout.sendCallout({
        type: 'error',
        message: <FormattedMessage id="ui-inventory.setForDeletion.toast.unsuccessful" values={{ instanceTitle: instance?.title }} />,
      });
    }
  };

  const onImportRecord = async (args) => {
    setIsImportRecordModalOpen(false);

    await importRecord({ instanceId: instance.id, args });
  };

  const onMoveToAnotherInstance = (selectedInstance) => {
    history.push({
      pathname: `/inventory/move/${instance.id}/${selectedInstance.id}/instance`,
      search: location.search,
    });
  };

  const holdingsSection = (
    <MoveItemsContext>
      <HoldingsListContainer
        instance={instance}
        draggable={isItemsMovement}
        tenantId={tenantId}
        pathToAccordionsState={['holdings']}
        droppable
      />
    </MoveItemsContext>
  );

  return (
    <HasCommand
      commands={shortcuts}
      isWithinScope={checkScope}
      scope={document.body}
    >
      <ViewInstancePane
        {...props}
        id="pane-instancedetails"
        instance={instance}
        isShared={isShared}
        tenantId={stripes.okapi.tenant}
        centralTenantId={centralTenantId}
        refetchInstance={refetch}
        mutateInstance={mutateInstance}
        isLoading={isLoading}
        isError={isError}
        error={error}
        centralTenantPermissions={flattenedPermissions}
        isCentralTenantPermissionsLoading={isCentralTenantPermissionsLoading}
        actionMenu={renderActionMenu}
        isInstanceSharing={isInstanceSharing}
        holdingsSection={holdingsSection}
        paneTitleRef={paneTitleRef}
        userTenantPermissions={userTenantPermissions}
      />
      <InstanceModals
        instance={instance}
        canUseSingleRecordImport={canUseSingleRecordImport}
        linkedAuthoritiesLength={linkedAuthoritiesLength}
        onConfirmShareLocalInstance={checkIfHasLinkedAuthorities}
        onShareLocalInstance={handleShareLocalInstance}
        onSetForDeletion={onSetForDeletion}
        onImportRecord={onImportRecord}
        onMoveToAnotherInstance={onMoveToAnotherInstance}
      />
    </HasCommand>
  );
};

ViewInstance.propTypes = {
  canUseSingleRecordImport: PropTypes.bool,
  onCopy: PropTypes.func,
  focusTitleOnInstanceLoad: PropTypes.bool,
};

export default flow([
  withSingleRecordImport,
  withTags,
  stripesConnect,
])(ViewInstance);
