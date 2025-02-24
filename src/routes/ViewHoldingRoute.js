import { useContext } from 'react';
import {
  useParams,
  useLocation,
} from 'react-router-dom';

import { useStripes } from '@folio/stripes/core';

import { useSearchInstanceByIdQuery } from '../common';
import { DataContext } from '../contexts';
import {
  useAuditSettings,
  useUpdateOwnership,
} from '../hooks';
import ViewHoldingsRecord from '../ViewHoldingsRecord';
import {
  INVENTORY_AUDIT_GROUP,
  UPDATE_OWNERSHIP_API,
  VERSION_HISTORY_ENABLED_SETTING,
} from '../constants';

const ViewHoldingRoute = () => {
  const { id: instanceId, holdingsrecordid } = useParams();
  const referenceTables = useContext(DataContext);
  const { okapi } = useStripes();
  const { state } = useLocation();
  const { instance } = useSearchInstanceByIdQuery(instanceId);
  const { updateOwnership } = useUpdateOwnership(UPDATE_OWNERSHIP_API.HOLDINGS);

  const { settings } = useAuditSettings({ group: INVENTORY_AUDIT_GROUP });
  const isVersionHistoryEnabled = settings?.find(setting => setting.key === VERSION_HISTORY_ENABLED_SETTING)?.value;

  return (
    <ViewHoldingsRecord
      id={instanceId}
      isInstanceShared={instance?.shared}
      tenantTo={state?.tenantTo || okapi.tenant}
      initialTenantId={state?.initialTenantId || okapi.tenant}
      referenceTables={referenceTables}
      holdingsrecordid={holdingsrecordid}
      onUpdateOwnership={updateOwnership}
      isVersionHistoryEnabled={isVersionHistoryEnabled}
    />
  );
};

export default ViewHoldingRoute;

