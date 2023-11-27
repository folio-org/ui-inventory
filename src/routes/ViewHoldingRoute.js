import { useContext } from 'react';
import {
  useParams,
  useLocation,
} from 'react-router-dom';

import { useStripes } from '@folio/stripes/core';

import { DataContext } from '../contexts';
import ViewHoldingsRecord from '../ViewHoldingsRecord';
import { useLocationsQuery } from '../hooks';

const ViewHoldingRoute = () => {
  const { id: instanceId, holdingsrecordid } = useParams();
  const referenceTables = useContext(DataContext);
  const { okapi } = useStripes();
  const { state } = useLocation();
  const tenantId = state?.tenantTo || okapi.tenant;
  const { data: holdingsLocations } = useLocationsQuery({ tenantId });

  return (
    <ViewHoldingsRecord
      id={instanceId}
      tenantTo={tenantId}
      referenceTables={referenceTables}
      holdingsrecordid={holdingsrecordid}
      holdingsLocations={holdingsLocations}
    />
  );
};

export default ViewHoldingRoute;

