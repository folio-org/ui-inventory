import { useContext } from 'react';
import { useParams } from 'react-router-dom';

import { useInstance } from '../common';
import { DataContext } from '../contexts';
import ViewHoldingsRecord from '../ViewHoldingsRecord';

const ViewHoldingRoute = () => {
  const { id: instanceId, holdingsrecordid } = useParams();
  const referenceTables = useContext(DataContext);
  const { instance: { shared: isSharedInstance } } = useInstance(instanceId);

  return (
    <ViewHoldingsRecord
      id={instanceId}
      isLocalInstance={!isSharedInstance}
      referenceTables={referenceTables}
      holdingsrecordid={holdingsrecordid}
    />
  );
};

export default ViewHoldingRoute;

