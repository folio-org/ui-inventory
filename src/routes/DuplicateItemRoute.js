import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';

import { DuplicateItem } from '../Item';
import { DataContext } from '../contexts';

const DuplicateItemRoute = () => {
  const referenceData = useContext(DataContext);
  const { id, holdingsrecordid, itemid } = useParams();

  return (
    <DuplicateItem
      referenceData={referenceData}
      instanceId={id}
      holdingId={holdingsrecordid}
      itemId={itemid}
    />
  );
};

export default DuplicateItemRoute;
