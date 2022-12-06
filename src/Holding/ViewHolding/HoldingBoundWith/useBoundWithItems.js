import { useQuery } from 'react-query';

import { useOkapiKy, useNamespace } from '@folio/stripes/core';

const useBoundWithItems = (boundWithParts) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'boundWithItems' });

  const itemIds = boundWithParts?.map(x => x.itemId);
  const queryIds = itemIds.join(' or ');

  const { data, isLoading } = useQuery(
    [namespace, queryIds],
    () => ky.get(`item-storage/items?query=id=${queryIds}`).json(),
    { enabled: Boolean(queryIds) }
  );

  return {
    isLoading,
    boundWithItems: data?.items || [],
  };
};

export default useBoundWithItems;
