import { useContext } from 'react';
import {
  useParams,
  useLocation,
} from 'react-router-dom';

import { useStripes } from '@folio/stripes/core';

import { useSearchInstanceByIdQuery } from '../common';
import { DataContext } from '../contexts';
import { useUpdateOwnership } from '../hooks';
import ViewHoldingsRecord from '../ViewHoldingsRecord';
import { UPDATE_OWNERSHIP_API } from '../constants';

const ViewHoldingRoute = () => {
  const { id: instanceId, holdingsrecordid } = useParams();
  const referenceTables = useContext(DataContext);
  const { okapi } = useStripes();
  const { state } = useLocation();
  const { instance } = useSearchInstanceByIdQuery(instanceId);
  const { updateOwnership } = useUpdateOwnership(UPDATE_OWNERSHIP_API.HOLDINGS);

  return (
    <ViewHoldingsRecord
      id={instanceId}
      isInstanceShared={instance?.shared}
      tenantTo={state?.tenantTo || okapi.tenant}
      initialTenantId={state?.initialTenantId || okapi.tenant}
      referenceTables={referenceTables}
      holdingsrecordid={holdingsrecordid}
      onUpdateOwnership={updateOwnership}
    />
  );
};

export default ViewHoldingRoute;

