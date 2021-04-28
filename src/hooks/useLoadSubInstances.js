import {
  keyBy,
  isEqual,
  sortBy,
  chain,
} from 'lodash';
import {
  useEffect,
  useState
} from 'react';

import useInstancesQuery from './useInstancesQuery';
import useReferenceData from './useReferenceData';

// Loads full instance records
// for given sub instance ids (parentInstances/childInstaces).
const useLoadSubInstances = (instanceIds = [], subId) => {
  const instanstcesById = keyBy(instanceIds, subId);
  const [subInstances, setSubInstances] = useState([]);
  const results = useInstancesQuery(instanceIds.map(inst => inst[subId]));
  const allLoaded = results.reduce((acc, { isSuccess }) => (isSuccess && acc), true);
  const instances = chain(results)
    .filter(({ data }) => data)
    .map(({
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
    }))
    .sortBy('title')
    .value();

  const shouldUpdateSubInstances = allLoaded && !isEqual(subInstances, instances);

  useEffect(() => {
    if (shouldUpdateSubInstances) {
      setSubInstances(instances);
    }
  }, [shouldUpdateSubInstances]);

  return subInstances;
};

export default useLoadSubInstances;
