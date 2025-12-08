import { cloneDeep } from 'lodash';

import useCirculationItemRequestsQuery from '../../../hooks/useCirculationItemRequestsQuery';
import useItemRequestsMutation from '../useItemRequestsMutation';
import useMarkItem from '../useMarkItem';

import { canMarkRequestAsOpen } from '../../../utils';
import {
  itemStatusMutators,
  REQUEST_OPEN_STATUSES,
} from '../../../constants';

const useItemStatusMutation = (itemId, refetchItem, tenantId) => {
  const { requests } = useCirculationItemRequestsQuery(itemId, { tenantId });
  const { mutateRequests } = useItemRequestsMutation({ tenantId });
  const { markItemAs } = useMarkItem({ tenantId });

  const markRequestAsOpen = async () => {
    const request = requests?.[0];

    if (canMarkRequestAsOpen(request)) {
      const newRequestRecord = cloneDeep(request);
      newRequestRecord.status = REQUEST_OPEN_STATUSES.OPEN_NOT_YET_FILLED;
      await mutateRequests(newRequestRecord);
    }
  };

  const markItemAsMissing = async () => {
    await markRequestAsOpen();
    await markItemAs({ itemId, markAs: 'mark-missing' });
    await refetchItem();
  };

  const markItemAsWithdrawn = async () => {
    await markItemAs({ itemId, markAs: 'mark-withdrawn' });
    await refetchItem();
  };

  const markItemWithStatus = async (status) => {
    const markAs = itemStatusMutators[status];

    await markItemAs({ itemId, markAs });
    await refetchItem();
  };

  return {
    markItemAsMissing,
    markItemAsWithdrawn,
    markItemWithStatus,
  };
};

export default useItemStatusMutation;
