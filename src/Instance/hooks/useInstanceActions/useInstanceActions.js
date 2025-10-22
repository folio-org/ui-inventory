import {
  useHistory,
  useLocation,
  useParams,
} from 'react-router-dom';

import { useCallback, useContext } from 'react';
import { FormattedMessage } from 'react-intl';
import { redirectToMarcEditPage } from '../../../utils';
import {
  INSTANCE_RECORD_TYPE,
  LINKED_DATA_ID_PREFIX,
  LINKED_DATA_RESOURCES_ROUTE,
} from '../../../constants';
import { useQuickExport } from '../../../hooks';
import useInstanceModalsContext from '../useInstanceModalsContext';
import useResourceMetadataQuery from '../useResourceMetadataQuery';
import { OrderManagementContext } from '../../../contexts';

const quickMarcPages = {
  editInstance: 'edit-bibliographic',
  duplicateInstance: 'derive-bibliographic',
  createHoldings: 'create-holdings',
};

const useInstanceActions = ({
  marcRecord,
  callout,
  instance,
  onCopy,
  canBeOpenedInLinkedData,
}) => {
  const history = useHistory();
  const location = useLocation();
  const params = useParams();

  const { id: instanceId } = params;

  const { exportRecords } = useQuickExport();
  const { refetch: fetchResourceMetadata } = useResourceMetadataQuery(instanceId, { enabled: false });

  const {
    isItemsMovement,
    setIsFindInstancePluginOpen,
    setIsImportRecordModalOpen,
    setIsShareLocalInstanceModalOpen,
    setIsSetForDeletionModalOpen,
    setIsNewOrderModalOpen,
    setIsItemsMovement,
  } = useInstanceModalsContext();

  const handleCreate = useCallback(() => {
    history.push({
      pathname: location.pathname,
      search: `${location.search}&layer=create`,
    });
  }, [location.search]);

  const handleEdit = useCallback(() => {
    history.push({
      pathname: `/inventory/instance/edit/${instanceId}`,
      search: location.search,
    });
  }, [instanceId, location.search]);

  const handleCopy = useCallback(() => {
    onCopy(instance);
  }, [instance]);

  const handleViewSource = useCallback((e) => {
    if (e) e.preventDefault();

    if (!marcRecord) {
      callout.sendCallout({
        type: 'error',
        message: (
          <FormattedMessage
            id="ui-inventory.marcSourceRecord.notFoundError"
            values={{ name: instance.title }}
          />
        ),
      });
    } else {
      history.push({
        pathname: location.pathname.replace('/view/', '/viewsource/'),
        search: location.search,
      });
    }
  }, [marcRecord, location.search, location.pathname]);

  const {
    applyOrderChanges,
    resetOrderChanges,
    hasPendingChanges,
  } = useContext(OrderManagementContext);

  const handleItemsMovement = useCallback(async () => {
    const isCurrentlyInMovement = isItemsMovement;

    if (isCurrentlyInMovement && hasPendingChanges) {
      // Exiting movement mode - apply order changes
      try {
        await applyOrderChanges();
      } catch {
        return;
      }
    } else if (isCurrentlyInMovement) {
      // Exiting movement mode with no changes - reset any pending changes
      resetOrderChanges();
    }

    setIsItemsMovement(prevState => !prevState);
  }, [isItemsMovement, hasPendingChanges, applyOrderChanges, resetOrderChanges, setIsItemsMovement]);

  const handleMoveItemsToAnotherInstance = useCallback(() => {
    setIsFindInstancePluginOpen(true);
  }, []);

  const handleOverlaySourceBib = useCallback(() => {
    setIsImportRecordModalOpen(true);
  }, []);

  const handleShareLocalInstance = useCallback(() => {
    setIsShareLocalInstanceModalOpen(true);
  }, []);

  const handleSetRecordForDeletion = useCallback(() => {
    setIsSetForDeletionModalOpen(true);
  }, []);

  const handleCreateNewOrder = useCallback(() => {
    setIsNewOrderModalOpen(true);
  }, []);

  const handleQuickExport = useCallback(() => {
    exportRecords({ uuids: [instanceId], recordType: INSTANCE_RECORD_TYPE });
  }, [instanceId, exportRecords]);

  const handleViewRequests = useCallback(() => {
    history.push({
      pathname: `/inventory/view-requests/${instanceId}`,
      search: location.search,
    });
  }, [instanceId, location.search]);

  const redirectToQuickMarcPage = useCallback((page) => {
    const pathname = `/inventory/quick-marc/${page}/${instanceId}`;

    redirectToMarcEditPage(pathname, instance, location, history);
  }, [instance, instanceId]);

  const handleEditInstanceMarc = () => redirectToQuickMarcPage(quickMarcPages.editInstance);
  const handleDuplicateInstanceMarc = () => redirectToQuickMarcPage(quickMarcPages.duplicateInstance);
  const handleCreateHoldingsMarc = () => redirectToQuickMarcPage(quickMarcPages.createHoldings);

  const handleEditInLinkedDataEditor = useCallback(async () => {
    const selectedIdentifier = instance.identifiers?.find(({ value }) => value.includes(LINKED_DATA_ID_PREFIX))?.value;
    const { data: resourceMetadata } = await fetchResourceMetadata();
    const resourceMetadataId = resourceMetadata?.id;

    const currentLocationState = {
      state: {
        from: {
          pathname: history.location?.pathname,
          search: history.location?.search,
        },
      },
    };

    // Navigate to edit if we have both selectedIdentifier and resourceMetadataId
    if (selectedIdentifier && resourceMetadataId) {
      const identifierLiteral = selectedIdentifier.replace(LINKED_DATA_ID_PREFIX, '');
      history.push({
        pathname: `${LINKED_DATA_RESOURCES_ROUTE}/${identifierLiteral}/edit`,
        ...currentLocationState,
      });
    } else {
      // Navigate to preview if no selectedIdentifier or no resourceMetadataId
      if (!selectedIdentifier && !canBeOpenedInLinkedData) return;

      history.push({
        pathname: `${LINKED_DATA_RESOURCES_ROUTE}/external/${instanceId}/preview`,
        ...currentLocationState,
      });
    }
  }, [instance, canBeOpenedInLinkedData, instanceId]);

  return {
    handleCreate,
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
  };
};

export default useInstanceActions;
