import React, {
  createContext,
  useContext,
} from 'react';

import { useRemoteStorageMappings } from '@folio/stripes/smart-components';

const Context = createContext({});

export const useRemoteStorageApi = () => useContext(Context);

export const RemoteStorageApiProvider = props => {
  const remoteMap = useRemoteStorageMappings();

  const checkMoveFromRemoteToNonRemote =
    ({ fromLocationId, toLocationId }) => (fromLocationId in remoteMap) && !(toLocationId in remoteMap);

  const context = { checkMoveFromRemoteToNonRemote };

  return <Context.Provider value={context} {...props} />;
};
