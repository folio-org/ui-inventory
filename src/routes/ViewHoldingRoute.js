import { useContext } from 'react';
import { useParams } from 'react-router-dom';

import { useStripes } from '@folio/stripes/core';

import { DataContext } from '../contexts';
import ViewHoldingsRecord from '../ViewHoldingsRecord';
import { getItem } from '../storage';
import { TENANT_IDS_KEY } from '../utils';

const ViewHoldingRoute = () => {
  const { okapi } = useStripes();
  const { id: instanceId, holdingsrecordid } = useParams();
  const referenceTables = useContext(DataContext);
  const tenantIds = getItem(TENANT_IDS_KEY);

  return (
    <ViewHoldingsRecord
      id={instanceId}
      referenceTables={referenceTables}
      holdingsrecordid={holdingsrecordid}
      tenantTo={tenantIds ? tenantIds.tenantTo : okapi.tenant}
      tenantFrom={tenantIds ? tenantIds.tenantFrom : okapi.tenant}
    />
  );
};

export default ViewHoldingRoute;

