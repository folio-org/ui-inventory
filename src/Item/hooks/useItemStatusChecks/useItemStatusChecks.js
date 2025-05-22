import { useMemo } from 'react';

import { useStripes } from '@folio/stripes/core';

import {
  canMarkItemAsMissing,
  canMarkItemAsWithdrawn,
  canMarkItemWithStatus,
  canCreateNewRequest,
} from '../../../utils';

const useItemStatusChecks = (item) => {
  const stripes = useStripes();

  return useMemo(() => ({
    canMarkItemAsMissing: canMarkItemAsMissing(item),
    canMarkItemAsWithdrawn: canMarkItemAsWithdrawn(item),
    canMarkItemWithStatus: canMarkItemWithStatus(item),
    canCreateNewRequest: canCreateNewRequest(item, stripes),
  }), [item, stripes]);
};

export default useItemStatusChecks;
