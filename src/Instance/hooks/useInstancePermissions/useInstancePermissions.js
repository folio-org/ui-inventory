import { useCallback } from 'react';

import {
  checkIfUserInCentralTenant,
  checkIfUserInMemberTenant,
  useStripes,
  useUserTenantPermissions,
} from '@folio/stripes/core';

import useInstanceHoldingsQuery from '../useInstanceHoldingsQuery';

import {
  checkIfCentralOrderingIsActive,
  flattenCentralTenantPermissions,
  isInstanceShadowCopy,
  isMARCSource,
} from '../../../utils';
import { LINKED_DATA_EDITOR_PERM } from '../../../constants';
import useCentralOrderingSettingsQuery from '../../../hooks/useCentralOrderingSettingsQuery';

const useInstancePermissions = ({
  instance = {},
  isShared,
  titleLevelRequestsFeatureEnabled,
  canBeOpenedInLinkedData,
  isSourceLinkedData,
  canUseSingleRecordImport,
  tenant,
  numberOfRequests,
}) => {
  const stripes = useStripes();
  const source = instance.source;
  const centralTenantId = stripes.user.user?.consortium?.centralTenantId;

  const { totalRecords: holdigsTotalRecords } = useInstanceHoldingsQuery(instance.id, tenant);
  const { data: centralOrdering } = useCentralOrderingSettingsQuery();
  const {
    userPermissions: centralTenantPermissions,
  } = useUserTenantPermissions({ tenantId: centralTenantId }, {
    enabled: Boolean(isShared && checkIfUserInMemberTenant(stripes)),
  });

  const hasCentralTenantPerm = useCallback((perm) => flattenCentralTenantPermissions(centralTenantPermissions).has(perm), [centralTenantPermissions]);

  const noInstanceHoldings = holdigsTotalRecords === 0;

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
    ? hasCentralTenantPerm(editBibRecordPerm)
    : stripes.hasPerm(editBibRecordPerm);
  const canDeriveMARCRecord = stripes.hasPerm('ui-quick-marc.quick-marc-editor.derive.execute');
  const canAddMARCHoldingsRecord = !checkIfUserInCentralTenant(stripes) && stripes.hasPerm('ui-quick-marc.quick-marc-holdings-editor.create');
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
  const showLinkedDataMenuSection = canAccessLinkedDataOptions && (isSourceLinkedData || canBeOpenedInLinkedData);

  const hasSetForDeletionPermission = stripes.hasPerm(setForDeletionAndSuppressPerm);
  const canNonConsortialTenantSetForDeletion = !stripes.hasInterface('consortia') && hasSetForDeletionPermission;
  const canCentralTenantSetForDeletion = checkIfUserInCentralTenant(stripes) && hasSetForDeletionPermission;
  const canMemberTenantSetForDeletion = (isShared && hasCentralTenantPerm(setForDeletionAndSuppressPerm)) || (!isShared && hasSetForDeletionPermission);
  const canSetForDeletion = canNonConsortialTenantSetForDeletion || canCentralTenantSetForDeletion || canMemberTenantSetForDeletion;

  const hasReorderPermissions = canCreateRequest || stripes.hasPerm('ui-requests.edit') || stripes.hasPerm('ui-requests.all');
  const canReorderRequests = titleLevelRequestsFeatureEnabled && hasReorderPermissions && numberOfRequests && canReorder;
  const canViewRequests = !checkIfUserInCentralTenant(stripes) && !titleLevelRequestsFeatureEnabled;
  const canCreateNewRequest = !checkIfUserInCentralTenant(stripes) && titleLevelRequestsFeatureEnabled && canCreateRequest;

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

  return {
    canEditInstance,
    canCreateInstance,
    canCreateRequest,
    canMoveItems,
    canCreateMARCHoldings,
    canMoveHoldings,
    canEditMARCRecord,
    canDeriveMARCRecord,
    canAddMARCHoldingsRecord,
    canViewMARCSource,
    canViewInstance,
    canViewSource,
    canShareLocalInstance,
    canCreateOrder,
    canReorder,
    canExportMarc,
    canSetForDeletion,
    canReorderRequests,
    canViewRequests,
    canCreateNewRequest,
    canMoveHoldingsItemsToAnotherInstance,
    hasReorderPermissions,

    showLinkedDataMenuSection,
    showInventoryMenuSection,
    showQuickMarcMenuSection,
  };
};

export default useInstancePermissions;
