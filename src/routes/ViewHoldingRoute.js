import { useContext } from 'react';
import {
  useParams,
  useLocation,
} from 'react-router-dom';

import { useStripes } from '@folio/stripes/core';

import { DataContext } from '../contexts';
import ViewHoldingsRecord from '../ViewHoldingsRecord';

const ViewHoldingRoute = () => {
  const { id: instanceId, holdingsrecordid } = useParams();
  const referenceTables = useContext(DataContext);
  const { okapi } = useStripes();
  const { state } = useLocation();

  return (
    <ViewHoldingsRecord
      id={instanceId}
      tenantTo={state?.tenantTo || okapi.tenant}
      referenceTables={referenceTables}
      holdingsrecordid={holdingsrecordid}
    />
  );
};

export default ViewHoldingRoute;

