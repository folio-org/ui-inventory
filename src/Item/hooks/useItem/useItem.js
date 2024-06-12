import { useQuery } from 'react-query';

import { sortBy } from 'lodash';

import { useOkapiKy, useNamespace } from '@folio/stripes/core';

const useItem = (itemId) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'item' });

  const { isLoading, isFetching, data: item = {}, refetch } = useQuery(
    [namespace, itemId],
    () => ky.get(`inventory/items/${itemId}`).json(),
    { enabled: Boolean(itemId) },
  );

  item.boundWithTitles = sortBy(
    item?.boundWithTitles,
    [(boundWithTitle) => {
      return boundWithTitle?.briefHoldingsRecord?.id === item?.holdingsRecordId ? 0 : 1;
    }]
  );

  return ({
    isLoading,
    isFetching,
    item,
    refetch,
  });
};

export default useItem;
