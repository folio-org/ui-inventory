import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';

import { DataContext } from '../contexts';
import { DuplicateHolding } from '../Holding';

const DuplicateHoldingRoute = () => {
  const { id: instanceId, holdingsrecordid: holdingId } = useParams();
  const referenceTables = useContext(DataContext);

  return (
    <DuplicateHolding
      referenceTables={referenceTables}
      instanceId={instanceId}
      holdingId={holdingId}
    />
  );
};

export default DuplicateHoldingRoute;
