import {
  useHistory,
  useLocation,
  useParams,
} from 'react-router-dom';

import React, {
  useCallback,
  useState,
} from 'react';
import { FormattedMessage } from 'react-intl';
import { redirectToMarcEditPage } from '../../../utils';
import {
  INSTANCE_RECORD_TYPE,
  LINKED_DATA_ID_PREFIX,
  LINKED_DATA_RESOURCES_ROUTE,
} from '../../../constants';
import { useQuickExport } from '../../../hooks';
import { IdReportGenerator } from '../../../reports';
import useInstanceModalsContext from '../useInstanceModalsContext';

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

  const [isQuickExportInProgress, setIsQuickExportInProgress] = useState(false);

  const { mutateAsync: exportRecords } = useQuickExport();

  const {
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

  const handleItemsMovement = useCallback(() => {
    setIsItemsMovement(prevState => !prevState);
  }, []);

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

  const handleQuickExport = useCallback(async () => {
    if (isQuickExportInProgress) return;

    const instanceIds = [instanceId];

    setIsQuickExportInProgress(true);

    try {
      const response = await exportRecords({
        uuids: instanceIds,
        recordType: INSTANCE_RECORD_TYPE,
      });
      const { jobExecutionHrId } = await response.json();

      const generator = new IdReportGenerator('QuickInstanceExport', jobExecutionHrId);

      const csvFileName = generator.getCSVFileName();
      const marcFileName = generator.getMARCFileName();

      generator.toCSV(instanceIds);

      callout.sendCallout({
        timeout: 0,
        type: 'success',
        message: <FormattedMessage
          id="ui-inventory.exportInstancesInMARC.complete"
          values={{ csvFileName, marcFileName }}
        />,
      });
    } catch (e) {
      callout.sendCallout({
        type: 'error',
        message: <FormattedMessage id="ui-inventory.communicationProblem" />,
      });
    } finally {
      setIsQuickExportInProgress(false);
    }
  }, [instanceId, isQuickExportInProgress]);

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

  const handleEditInLinkedDataEditor = useCallback(() => {
    const selectedIdentifier = instance.identifiers?.find(({ value }) => value.includes(LINKED_DATA_ID_PREFIX))?.value;
    const currentLocationState = {
      state: {
        from: {
          pathname: history.location?.pathname,
          search: history.location?.search,
        },
      },
    };

    if (!selectedIdentifier) {
      if (!canBeOpenedInLinkedData) return;

      history.push({
        pathname: `${LINKED_DATA_RESOURCES_ROUTE}/external/${instanceId}/preview`,
        ...currentLocationState,
      });
    } else {
      const identifierLiteral = selectedIdentifier.replace(LINKED_DATA_ID_PREFIX, '');

      history.push({
        pathname: `${LINKED_DATA_RESOURCES_ROUTE}/${identifierLiteral}/edit`,
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
