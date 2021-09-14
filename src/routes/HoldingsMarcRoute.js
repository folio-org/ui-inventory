import React from 'react';
import { useParams } from 'react-router-dom';

import { HoldingsMarcContainer } from '../Holding';

const HoldingsMarcRoute = () => {
  const {
    holdingsrecordid: holdingsRecordId,
    id: instanceId,
  } = useParams();

  return (
    <HoldingsMarcContainer
      instanceId={instanceId}
      holdingsrecordid={holdingsRecordId}
    />
  );
};

export default HoldingsMarcRoute;
