import {
  keyBy,
  isEqual,
  map,
  flow,
  sortBy,
  filter,
} from 'lodash';
import {
  useEffect,
  useState
} from 'react';

import useInstancesQuery from './useInstancesQuery';

// Loads full instance records
// for given sub instance ids (parentInstances/childInstaces).
const useLoadSubInstances = (instanceIds = [], subId) => {
  const instanstcesById = keyBy(instanceIds, subId);
  const [subInstances, setSubInstances] = useState([]);
  const results = useInstancesQuery(instanceIds.map(inst => inst[subId]));
  const allLoaded = results.reduce((acc, { isSuccess }) => (isSuccess && acc), true);
  const instances = flow(
    items => filter(items, ({ data }) => data),
    items => map(items, ({
      data: {
        id,
        title,
        hrid,
        publication,
        identifiers,
      },
    }) => ({
      ...instanstcesById[id],
      title,
      hrid,
      publication,
      identifiers,
    })),
    items => sortBy(items, 'title')
  )(results);
  const shouldUpdateSubInstances = allLoaded && !isEqual(subInstances, instances);

  useEffect(() => {
    if (shouldUpdateSubInstances) {
      setSubInstances(instances);
    }
  }, [shouldUpdateSubInstances]);

  return subInstances;
};

export default useLoadSubInstances;
