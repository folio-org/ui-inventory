import { useQuery } from 'react-query';

import { useOkapiKy, useNamespace } from '@folio/stripes/core';

const useItem = (itemId) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'item' });

  const { isLoading, data: item = {} } = useQuery(
    [namespace, itemId],
    () => ky.get(`inventory/items/${itemId}`).json(),
    { enabled: Boolean(itemId) },
  );

  return ({
    isLoading,
    item,
  });
};

export default useItem;
