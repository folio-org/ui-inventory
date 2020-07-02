import React from 'react';
import { useParams } from 'react-router-dom';

import { InstanceMarcContainer } from '../Instance';

const InstanceMarcRoute = () => {
  const { id: instanceId } = useParams();

  return <InstanceMarcContainer instanceId={instanceId} />;
};

export default InstanceMarcRoute;
