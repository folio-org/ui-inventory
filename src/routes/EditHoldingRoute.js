import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';

import { DataContext } from '../contexts';
import { EditHolding } from '../Holding';

const EditHoldingRoute = () => {
  const { id: instanceId, holdingsrecordid: holdingId } = useParams();
  const referenceTables = useContext(DataContext);

  return (
    <EditHolding
      referenceTables={referenceTables}
      instanceId={instanceId}
      holdingId={holdingId}
    />
  );
};

export default EditHoldingRoute;
