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
  const { isSuccess, data: results } = useInstancesQuery(instanceIds.map(inst => inst[subId]));

  const instances = flow(
    items => filter(items, instance => instance),
    items => map(items, ({
      id,
      title,
      hrid,
      publication,
      identifiers,
    }) => ({
      ...instanstcesById[id],
      title,
      hrid,
      publication,
      identifiers,
    })),
    items => sortBy(items, 'title')
  )(results?.instances);

  const shouldUpdateSubInstances = isSuccess && !isEqual(subInstances, instances);

  useEffect(() => {
    if (shouldUpdateSubInstances) {
      setSubInstances(instances);
    }
  }, [shouldUpdateSubInstances]);

  return subInstances;
};

export default useLoadSubInstances;
