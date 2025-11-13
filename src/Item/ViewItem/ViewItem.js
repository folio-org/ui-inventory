import {
  useCallback,
  useContext,
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
import { FormattedMessage } from 'react-intl';
import { map } from 'lodash';
import PropTypes from 'prop-types';

import {
  Pane,
  Paneset,
  checkScope,
  HasCommand,
  PaneMenu,
  FormattedDate,
  NoValue,
} from '@folio/stripes/components';
import {
  AppIcon,
  CalloutContext,
  checkIfUserInCentralTenant,
  checkIfUserInMemberTenant,
  useStripes,
} from '@folio/stripes/core';
import { VersionHistoryButton } from '@folio/stripes-acq-components';

import {
  ItemModals,
  ItemActionMenu,
  ItemDetailsContent,
  ItemVersionHistory,
} from './components';
import { PaneLoading } from '../../components';

import {
  useAuditSettings,
  useCirculationItemRequestsQuery,
  useTagSettingsQuery,
} from '../../hooks';
import {
  useItemQuery,
  useItemDetailsShortcuts,
  useItemUpdateOwnership,
  useItemStatusMutation,
  useItemMutation,
} from '../hooks';
import {
  useHoldingQuery,
  useInstance,
} from '../../common';

import {
  switchAffiliation,
  isInstanceShadowCopy,
  omitCurrentAndCentralTenants,
  getIsVersionHistoryEnabled,
} from '../../utils';
import {
  REQUEST_OPEN_STATUSES,
  INVENTORY_AUDIT_GROUP,
} from '../../constants';

export const requestStatusFiltersString = map(REQUEST_OPEN_STATUSES, requestStatus => `requestStatus.${requestStatus}`).join(',');

const refLookup = (referenceTable, id) => {
  const ref = (referenceTable && id) ? referenceTable.find(record => record.id === id) : {};

  return ref || {};
};

const ViewItem = ({
  referenceTables,
  referenceTables: {
    holdingsSourcesByName,
  },
  isInstanceShared,
  initialTenantId,
  tenantTo,
}) => {
  const stripes = useStripes();
  const location = useLocation();
  const history = useHistory();
  const params = useParams();

  const itemId = params.itemid;
  const instanceId = params.id;
  const holdingsId = params.holdingsrecordid;

  const calloutContext = useContext(CalloutContext);
  const accordionStatusRef = useRef();

  const goBackToInstance = useCallback(toTenant => {
    const { search } = location;

    history.push({
      pathname: `/inventory/view/${instanceId}`,
      search,
      state: { tenantTo: toTenant },
    });
  }, [instanceId, location.search]);

  const [updateOwnershipData, setUpdateOwnershipData] = useState({});
  const [tenants, setTenants] = useState([]);
  const [targetTenant, setTargetTenant] = useState({});
  const [isVersionHistoryOpen, setIsVersionHistoryOpen] = useState(false);

  const { isLoading: isItemLoading, item, refetch: refetchItem } = useItemQuery(itemId, { tenant: tenantTo });
  const { isLoading: isInstanceLoading, instance } = useInstance(instanceId);
  const { isLoading: isHoldingsLoading, holding } = useHoldingQuery(holdingsId);
  const { requests } = useCirculationItemRequestsQuery(itemId);
  const { tagSettings } = useTagSettingsQuery();
  const { settings } = useAuditSettings({ group: INVENTORY_AUDIT_GROUP });

  const isLoading = useMemo(() => isItemLoading || isInstanceLoading || isHoldingsLoading,
    [isItemLoading, isInstanceLoading, isHoldingsLoading]);

  const { deleteItem, mutateItem } = useItemMutation();
  const {
    markItemAsMissing,
    markItemAsWithdrawn,
    markItemWithStatus,
  } = useItemStatusMutation(itemId, refetchItem);

  const {
    handleUpdateOwnership,
    onConfirmHandleUpdateOwnership,
    onCancelUpdateOwnership,
  } = useItemUpdateOwnership({
    item,
    instanceId,
    targetTenant,
    setTargetTenant,
    holdingsSourcesByName,
    calloutContext,
    updateOwnershipData,
    setUpdateOwnershipData,
    onSuccess: goBackToInstance,
  });

  const onChangeTags = async (entity) => {
    await mutateItem(entity);
    await refetchItem();
  };

  useEffect(() => {
    if (checkIfUserInMemberTenant(stripes)) {
      setTenants(omitCurrentAndCentralTenants(stripes));
    }
  }, []);

  const shortcuts = useItemDetailsShortcuts({ initialTenantId, accordionStatusRef });

  const appIcon = (
    <AppIcon
      app="inventory"
      iconKey="item"
    />
  );
  const renderPaneTitle = useCallback(() => (
    <FormattedMessage
      id="ui-inventory.itemDotStatus"
      values={{
        barcode: item.barcode || '',
        status: item.status?.name || '',
      }}
    />
  ), [item]);
  const renderPaneSub = useCallback(
    () => {
      const updatedDate = item?.metadata?.updatedDate;

      return (
        <FormattedMessage
          id="ui-inventory.instanceRecordSubtitle"
          values={{
            hrid: item?.hrid,
            date: updatedDate ? <FormattedDate value={updatedDate} /> : <NoValue />,
          }}
        />
      );
    },
    [item?.hrid, item?.metadata?.updatedDate],
  );

  const renderActionMenu = useCallback(({ onToggle }) => {
    if (isVersionHistoryOpen) return null;

    const isUserInCentralTenant = checkIfUserInCentralTenant(stripes);
    const isSharedInstance = isInstanceShared || isInstanceShadowCopy(instance.source);

    if (isUserInCentralTenant) return null;

    return (
      <ItemActionMenu
        item={item}
        onToggle={onToggle}
        onUpdateOwnership={handleUpdateOwnership}
        request={requests[0]}
        isSharedInstance={isSharedInstance}
        tenants={tenants}
        initialTenantId={initialTenantId}
      />
    );
  }, [isVersionHistoryOpen, stripes, isInstanceShared, instance, item, requests, tenants, initialTenantId, handleUpdateOwnership]);

  const renderLastMenu = useCallback(() => {
    const isVersionHistoryEnabled = getIsVersionHistoryEnabled(settings);

    return (
      <PaneMenu>
        {isVersionHistoryEnabled && (
          <VersionHistoryButton
            onClick={() => setIsVersionHistoryOpen(true)}
            disabled={isVersionHistoryOpen}
          />
        )}
      </PaneMenu>
    );
  }, [settings, isVersionHistoryOpen]);

  const onCloseViewItem = useCallback(async () => {
    const tenantFrom = location.state?.initialTenantId || stripes.okapi.tenant;

    await switchAffiliation(stripes, tenantFrom, () => goBackToInstance(tenantFrom));
  }, [location, stripes]);

  const onDeleteItem = async (itemToDeleteId) => {
    await onCloseViewItem();
    await deleteItem(itemToDeleteId);
  };

  const tagsEnabled = useMemo(
    () => !tagSettings.configs?.length || tagSettings.configs?.[0]?.value === 'true',
    [tagSettings],
  );

  const requestCount = requests?.totalRecords ?? 0;

  const requestsUrl = `/requests?filters=${requestStatusFiltersString}&query=${itemId}&sort=Request Date`;

  if (isLoading) {
    return <PaneLoading defaultWidth="100%" />;
  }

  return (
    <HasCommand
      commands={shortcuts}
      isWithinScope={checkScope}
      scope={document.body}
    >
      <Paneset isRoot>
        <Pane
          defaultWidth="fill"
          id="item-view-pane"
          appIcon={appIcon}
          paneTitle={renderPaneTitle()}
          paneSub={renderPaneSub()}
          dismissible
          onClose={onCloseViewItem}
          actionMenu={renderActionMenu}
          lastMenu={renderLastMenu()}
        >
          <ItemModals
            onSelectNewItemOwnership={setUpdateOwnershipData}
            onConfirmHandleUpdateOwnership={onConfirmHandleUpdateOwnership}
            onCancelUpdateOwnership={onCancelUpdateOwnership}
            onChangeAffiliation={setTargetTenant}
            onMarkItemAsMissing={markItemAsMissing}
            onMarkItemAsWithdrawn={markItemAsWithdrawn}
            onMarkItemWithStatus={markItemWithStatus}
            onDeleteItem={onDeleteItem}
            targetTenant={targetTenant}
            instanceId={instanceId}
            tenants={tenants}
            item={item}
            requestCount={requestCount}
            requestsUrl={requestsUrl}
          />
          <ItemDetailsContent
            item={item}
            instance={instance}
            holdings={holding}
            referenceTables={referenceTables}
            accordionStatusRef={accordionStatusRef}
            refLookup={refLookup}
            isTagsEnabled={tagsEnabled}
            requestCount={requestCount}
            requestsUrl={requestsUrl}
            onChangeTags={onChangeTags}
          />
        </Pane>
        {isVersionHistoryOpen && (
          <ItemVersionHistory
            item={item}
            onClose={() => setIsVersionHistoryOpen(false)}
          />
        )}
      </Paneset>
    </HasCommand>
  );
};

ViewItem.propTypes = {
  referenceTables: PropTypes.object.isRequired,
  isInstanceShared: PropTypes.bool,
  initialTenantId: PropTypes.string,
  tenantTo: PropTypes.string,
};

export default ViewItem;
