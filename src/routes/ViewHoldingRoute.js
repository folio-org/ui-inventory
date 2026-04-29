import { useContext } from 'react';
import {
  useParams,
  useLocation,
} from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

import {
  useStripes,
  AuthenticatedError,
} from '@folio/stripes/core';

import { useSearchInstanceByIdQuery } from '../common';
import { DataContext } from '../contexts';
import {
  useAuditSettings,
  useCallout,
  useUpdateOwnershipMutation,
} from '../hooks';
import ViewHoldingsRecord from '../ViewHoldingsRecord';
import {
  INVENTORY_AUDIT_GROUP,
  UPDATE_OWNERSHIP_API,
  UUID_PATTERN,
} from '../constants';
import { getIsVersionHistoryEnabled } from '../utils';

const ViewHoldingRoute = () => {
  const { id: instanceId, holdingsrecordid } = useParams();
  const referenceTables = useContext(DataContext);
  const { okapi } = useStripes();
  const callout = useCallout();
  const location = useLocation();
  const { instance, error } = useSearchInstanceByIdQuery(instanceId);
  const { updateOwnership } = useUpdateOwnershipMutation(UPDATE_OWNERSHIP_API.HOLDINGS);

  const { settings } = useAuditSettings({ group: INVENTORY_AUDIT_GROUP });
  const isVersionHistoryEnabled = getIsVersionHistoryEnabled(settings);

  if (!UUID_PATTERN.test(instanceId) || !UUID_PATTERN.test(holdingsrecordid)) {
    return <AuthenticatedError location={location} />;
  }

  if (error) {
    const defaultErrorMessage = <FormattedMessage id="ui-inventory.communicationProblem" />;

    callout.sendCallout({
      type: 'error',
      message: error?.message || defaultErrorMessage,
      timeout: 0,
    });
  }

  return (
    <ViewHoldingsRecord
      id={instanceId}
      isInstanceShared={instance?.shared}
      tenantTo={location.state?.tenantTo || okapi.tenant}
      initialTenantId={location.state?.initialTenantId || okapi.tenant}
      referenceTables={referenceTables}
      holdingsrecordid={holdingsrecordid}
      onUpdateOwnership={updateOwnership}
      isVersionHistoryEnabled={isVersionHistoryEnabled}
    />
  );
};

export default ViewHoldingRoute;

