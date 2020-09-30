import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';


import { InstanceEdit } from '../Instance';
import { DataContext } from '../contexts';

const InstanceEditRoute = () => {
  const { id: instanceId } = useParams();
  const referenceData = useContext(DataContext);

  return (
    <InstanceEdit
      referenceData={referenceData}
      instanceId={instanceId}
    />
  );
};

export default InstanceEditRoute;
