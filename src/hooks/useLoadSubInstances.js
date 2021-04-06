import { keyBy } from 'lodash';
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

  useEffect(() => {
    if (allLoaded && !subInstances.length && results.length) {
      const instances = results.map(({
        data: {
          id,
          title,
          hrid,
          publication,
          identifiers,
        }
      }) => ({
        ...instanstcesById[id],
        title,
        hrid,
        publication,
        identifiers,
      }));

      setSubInstances(instances);
    }
  }, [allLoaded, subInstances, results, instanstcesById]);

  return subInstances;
};

export default useLoadSubInstances;
