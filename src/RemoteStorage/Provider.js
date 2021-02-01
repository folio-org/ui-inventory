import React from 'react';
import PropTypes from 'prop-types';

import { stripesConnect } from '@folio/stripes/core';

const Context = React.createContext({});

export const useRemoteStorageApi = () => React.useContext(Context);

const Provider = ({ resources, mutator, ...rest }) => {
  const [persistentMutator] = React.useState(mutator);

  React.useEffect(() => {
    persistentMutator.mappings.reset();
    persistentMutator.mappings.GET();
  }, [persistentMutator]);

  const remoteMap = React.useMemo(
    () => Object.fromEntries(resources.mappings.records.map(
      ({ folioLocationId, configurationId }) => [folioLocationId, configurationId]
    )),
    [resources.mappings.records]
  );

  const checkMoveFromRemoteToNonRemote =
    ({ fromLocationId, toLocationId }) => (fromLocationId in remoteMap) && !(toLocationId in remoteMap);

  const context = { checkMoveFromRemoteToNonRemote };

  return (
    <Context.Provider value={context} {...rest} />
  );
};

Provider.manifest = Object.freeze({
  mappings: {
    type: 'okapi',
    path: 'remote-storage/mappings',
    accumulate: true,
    records: 'mappings',
    pk: 'folioLocationId',
    throwErrors: false,
  },
});

Provider.propTypes = {
  mutator: PropTypes.object.isRequired,
  resources: PropTypes.object.isRequired,
};

export const RemoteStorageApiProvider = stripesConnect(Provider);
