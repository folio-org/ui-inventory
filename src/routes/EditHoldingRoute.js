import React, { useContext } from 'react';
import { useParams, useLocation } from 'react-router-dom';

import { AuthenticatedError } from '@folio/stripes/core';
import { isValidUUID } from '@folio/stripes/util';

import { DataContext } from '../contexts';
import { EditHolding } from '../Holding';

const EditHoldingRoute = () => {
  const location = useLocation();
  const { id: instanceId, holdingsrecordid: holdingId } = useParams();

  const referenceTables = useContext(DataContext);

  const hasValidParams = [instanceId, holdingId].every(isValidUUID);

  if (!hasValidParams) {
    return <AuthenticatedError location={location} />;
  }

  return (
    <EditHolding
      referenceTables={referenceTables || {}}
      instanceId={instanceId}
      holdingId={holdingId}
    />
  );
};

export default EditHoldingRoute;
