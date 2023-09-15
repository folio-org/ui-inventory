import { useContext } from 'react';
import { useParams } from 'react-router-dom';

import { DataContext } from '../contexts';
import ViewHoldingsRecord from '../ViewHoldingsRecord';

const ViewHoldingRoute = () => {
  const { id: instanceId, holdingsrecordid } = useParams();
  const referenceTables = useContext(DataContext);

  return (
    <ViewHoldingsRecord
      id={instanceId}
      referenceTables={referenceTables}
      holdingsrecordid={holdingsrecordid}
    />
  );
};

export default ViewHoldingRoute;

