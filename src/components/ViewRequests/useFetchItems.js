import { useEffect, useState } from 'react';

import { batchFetchItems } from './utils';

function useFetchItems(mutatorItems, instanceHoldings) {
  const [items, setItems] = useState();

  useEffect(() => {
    if (instanceHoldings?.length) {
      batchFetchItems(mutatorItems, instanceHoldings)
        .then(
          setItems,
          () => setItems([])
        );
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [instanceHoldings]);

  return items;
}

export default useFetchItems;
