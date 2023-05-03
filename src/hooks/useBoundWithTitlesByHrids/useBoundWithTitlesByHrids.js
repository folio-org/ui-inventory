import { keyBy } from 'lodash';

import useHoldingsQueryByHrids from '../useHoldingsQueryByHrids';
import useInstancesQuery from '../useInstancesQuery';

const useBoundWithTitlesByHrids = holdingsHrids => {
  // Load the holdings records matching the input HRIDs
  const { isLoading: isHoldingsLoading, holdingsRecords } = useHoldingsQueryByHrids(holdingsHrids);

  // Load the instance records matching the holdings' instanceIds.
  const instanceIds = holdingsRecords.map(record => record.instanceId);
  const instances = useInstancesQuery(instanceIds);

  if (isHoldingsLoading || !instances.isSuccess) return { isLoading: true, boundWithTitles: [] };

  const holdingsRecordsByHrid = keyBy(holdingsRecords, 'hrid');
  const instancesById = keyBy(instances.data?.instances, 'id');

  const boundWithTitles = holdingsHrids.map(hrid => {
    let boundWithTitle = { briefHoldingsRecord: hrid };
    const holdingsRecord = holdingsRecordsByHrid[hrid];

    if (holdingsRecord) {
      const instance = instancesById[holdingsRecord.instanceId];

      boundWithTitle = {
        briefHoldingsRecord: {
          hrid,
          id: holdingsRecord.id,
        },
        briefInstance: {
          id: instance?.id,
          hrid: instance?.hrid,
          title: instance?.title,
        },
      };
    }

    return boundWithTitle;
  });

  return {
    isLoading: false,
    boundWithTitles,
  };
};

export default useBoundWithTitlesByHrids;
