import { useCallback } from 'react';
import { useIntl } from 'react-intl';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';

import { MenuSection } from '@folio/stripes/components';
import {
  checkIfUserInCentralTenant,
  checkIfUserInMemberTenant,
  Pluggable,
  useStripes,
} from '@folio/stripes/core';

import { ActionItem } from '../../../../components';
import RequestsReorderButton from '../RequestsReorderButton';
import NewInstanceRequestButton from '../NewInstanceRequestButton';

import {
  useInstancePermissions,
  useInstanceActions,
  useInstanceModalsContext,
} from '../../../hooks';
import useReferenceData from '../../../../hooks/useReferenceData';

import { isLinkedDataSource } from '../../../../utils';
import { indentifierTypeNames } from '../../../../constants';

const InstanceActionMenu = ({
  onToggle,
  instance = {},
  marcRecord,
  isShared,
  centralTenantPermissions = [],
  canUseSingleRecordImport,
  canBeOpenedInLinkedData,
  titleLevelRequestsFeatureEnabled,
  callout,
  tenant,
  requests,
  numberOfRequests,
  onCopy,
}) => {
  const intl = useIntl();
  const stripes = useStripes();
  const referenceData = useReferenceData();

  const hasCentralTenantPerm = useCallback((permName) => {
    return centralTenantPermissions.some(({ permissionName }) => permissionName === permName);
  }, [centralTenantPermissions]);
  const isSourceLinkedData = isLinkedDataSource(instance.source);

  const {
    showInventoryMenuSection,
    showQuickMarcMenuSection,
    canEditInstance,
    canViewSource,
    canMoveItems,
    canMoveHoldingsItemsToAnotherInstance,
    canCreateInstance,
    canShareLocalInstance,
    canExportMarc,
    canSetForDeletion,
    canCreateOrder,
    canCreateNewRequest,
    canEditMARCRecord,
    canDeriveMARCRecord,
    canAddMARCHoldingsRecord,
    canCreateMARCHoldings,
    hasReorderPermissions,
    showLinkedDataMenuSection,
  } = useInstancePermissions({
    instance,
    isShared,
    isSourceLinkedData,
    canUseSingleRecordImport,
    canBeOpenedInLinkedData,
    titleLevelRequestsFeatureEnabled,
    tenant,
    numberOfRequests,
    hasCentralTenantPerm,
  });

  const {
    handleEdit,
    handleViewSource,
    handleItemsMovement,
    handleMoveItemsToAnotherInstance,
    handleOverlaySourceBib,
    handleCopy,
    handleShareLocalInstance,
    handleQuickExport,
    handleSetRecordForDeletion,
    handleCreateNewOrder,
    handleViewRequests,
    handleEditInstanceMarc,
    handleDuplicateInstanceMarc,
    handleCreateHoldingsMarc,
    handleEditInLinkedDataEditor,
  } = useInstanceActions({
    marcRecord,
    callout,
    instance,
    onCopy,
    canBeOpenedInLinkedData,
  });

  const {
    isItemsMovement,
    isCopyrightModalOpen,
    setIsCopyrightModalOpen,
  } = useInstanceModalsContext();

  // Get all identifiers for all records
  const getIdentifiers = () => {
    if (!instance.identifiers || isEmpty(referenceData)) {
      return null;
    }

    const { identifierTypesById } = referenceData;
    const { ISBN, ISSN } = indentifierTypeNames;

    // We can't make any meaningful assessment of which is
    // the best identifier to return, so just return the first
    // we find
    for (const identifiers of instance.identifiers) {
      const { identifierTypeId, value } = identifiers;
      const ident = identifierTypesById[identifierTypeId];

      if ((ident?.name === ISBN || ident?.name === ISSN) && value) {
        return { type: ident.name, value };
      }
    }
    return null;
  };

  const suppressEditInstanceForMemberTenant = checkIfUserInMemberTenant(stripes)
    && isShared
    && !hasCentralTenantPerm('ui-inventory.instance.edit');

  const buildOnClickHandler = useCallback((handler) => {
    onToggle();
    handler();
  }, [onToggle]);

  const toggleCopyrightModal = useCallback(() => {
    setIsCopyrightModalOpen(prevState => !prevState);
  }, []);

  const identifier = getIdentifiers();

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
              onClickHandler={() => buildOnClickHandler(handleEdit)}
            />
          )}
          {canViewSource && (
            <ActionItem
              id="clickable-view-source"
              icon="document"
              messageId="ui-inventory.viewSource"
              onClickHandler={e => buildOnClickHandler(() => handleViewSource(e, instance))}
              disabled={!marcRecord}
            />
          )}
          {canMoveItems && (
            <ActionItem
              id="move-instance-items"
              icon="transfer"
              messageId={`ui-inventory.moveItems.instance.actionMenu.${isItemsMovement ? 'disable' : 'enable'}`}
              onClickHandler={() => buildOnClickHandler(handleItemsMovement)}
            />
          )}
          {canMoveHoldingsItemsToAnotherInstance && (
            <ActionItem
              id="move-instance"
              icon="arrow-right"
              messageId="ui-inventory.moveItems"
              onClickHandler={() => buildOnClickHandler(handleMoveItemsToAnotherInstance)}
            />
          )}
          {canUseSingleRecordImport && !isSourceLinkedData && (
            <ActionItem
              id="dropdown-clickable-reimport-record"
              icon="lightning"
              messageId="ui-inventory.copycat.overlaySourceBib"
              onClickHandler={() => buildOnClickHandler(handleOverlaySourceBib)}
            />
          )}
          {canCreateInstance && (
            <ActionItem
              id="copy-instance"
              icon="duplicate"
              messageId="ui-inventory.duplicateInstance"
              onClickHandler={() => buildOnClickHandler(() => handleCopy(instance))}
            />
          )}
          {canShareLocalInstance && (
            <ActionItem
              id="share-local-instance"
              icon="graph"
              messageId="ui-inventory.shareLocalInstance"
              onClickHandler={() => buildOnClickHandler(handleShareLocalInstance)}
            />
          )}
          {canExportMarc && (
            <ActionItem
              id="quick-export-trigger"
              icon="download"
              messageId="ui-inventory.exportInstanceInMARC"
              onClickHandler={() => buildOnClickHandler(handleQuickExport)}
            />
          )}
          {canSetForDeletion && !instance?.deleted && !isSourceLinkedData && (
            <ActionItem
              id="set-record-for-deletion"
              icon="flag"
              messageId="ui-inventory.setRecordForDeletion"
              onClickHandler={() => buildOnClickHandler(handleSetRecordForDeletion)}
            />
          )}
          {canCreateOrder && (
            <ActionItem
              id="clickable-create-order"
              icon="plus-sign"
              messageId="ui-inventory.newOrder"
              onClickHandler={() => buildOnClickHandler(handleCreateNewOrder)}
            />
          )}
          {titleLevelRequestsFeatureEnabled && !checkIfUserInCentralTenant(stripes)
            ? (
              <RequestsReorderButton
                hasReorderPermissions={hasReorderPermissions}
                requestId={requests[0]?.id}
                instanceId={instance.id}
                numberOfRequests={numberOfRequests}
              />
            )
            : !checkIfUserInCentralTenant(stripes) && (
            <ActionItem
              id="view-requests"
              icon="eye-open"
              messageId="ui-inventory.viewRequests"
              onClickHandler={() => buildOnClickHandler(handleViewRequests)}
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
              onClickHandler={() => buildOnClickHandler(handleEditInstanceMarc)}
              disabled={!marcRecord}
            />
          )}
          {canDeriveMARCRecord && (
            <ActionItem
              id="duplicate-instance-marc"
              icon="duplicate"
              messageId="ui-inventory.duplicateInstanceMarc"
              onClickHandler={() => buildOnClickHandler(handleDuplicateInstanceMarc)}
              disabled={!marcRecord}
            />
          )}
          {canAddMARCHoldingsRecord && (
            <ActionItem
              id="create-holdings-marc"
              icon="plus-sign"
              messageId="ui-inventory.createMARCHoldings"
              onClickHandler={() => buildOnClickHandler(handleCreateHoldingsMarc)}
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
            onClickHandler={() => buildOnClickHandler(handleEditInLinkedDataEditor)}
          />
        </MenuSection>
      )}

      <Pluggable
        id="copyright-permissions-checker"
        toggle={toggleCopyrightModal}
        open={isCopyrightModalOpen}
        identifier={identifier}
        type="copyright-permissions-checker"
        renderTrigger={({ menuText }) => (
          <ActionItem
            id="copyright-permissions-check"
            icon="report"
            label={menuText}
            onClickHandler={() => buildOnClickHandler(toggleCopyrightModal)}
          />
        )}
      />
    </>
  );
};

InstanceActionMenu.propTypes = {
  onToggle: PropTypes.func.isRequired,
  instance: PropTypes.object,
  marcRecord: PropTypes.object,
  isShared: PropTypes.bool,
  centralTenantPermissions: PropTypes.arrayOf(PropTypes.string),
  canUseSingleRecordImport: PropTypes.bool,
  canBeOpenedInLinkedData: PropTypes.bool,
  titleLevelRequestsFeatureEnabled: PropTypes.bool,
  callout: PropTypes.object.isRequired,
  tenant: PropTypes.string,
  requests: PropTypes.arrayOf(PropTypes.object),
  numberOfRequests: PropTypes.number,
  onCopy: PropTypes.func,
};

export default InstanceActionMenu;
