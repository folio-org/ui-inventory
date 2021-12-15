import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';

import { EditItem } from '../Item';
import { DataContext } from '../contexts';

const EditItemRoute = () => {
  const { id, holdingId, itemId } = useParams();
  const referenceData = useContext(DataContext);

  return (
    <EditItem
      referenceData={referenceData}
      instanceId={id}
      holdingId={holdingId}
      itemId={itemId}
    />
  );
};

export default EditItemRoute;
