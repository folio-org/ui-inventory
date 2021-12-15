import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';

import { CreateItem } from '../Item';
import { DataContext } from '../contexts';

const CreateItemRoute = () => {
  const referenceData = useContext(DataContext);
  const { id, holdingId } = useParams();

  return (
    <CreateItem
      referenceData={referenceData}
      instanceId={id}
      holdingId={holdingId}
    />
  );
};

export default CreateItemRoute;
