import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

const useItemOpenLoansQuery = (itemd) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'item-open-loans' });

  const { isLoading, data: openLoans = {}, isFetching } = useQuery(
    [namespace, itemd],
    () => ky.get('circulation/loans', {
      searchParams: {
        query: `status.name=="Open" and itemId==${itemd}`,
      },
    }).json(),
    { enabled: Boolean(itemd) },
  );

  return ({
    isLoading,
    isFetching,
    openLoans,
  });
};

export default useItemOpenLoansQuery;
