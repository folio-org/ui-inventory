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
  }, [instanceHoldings]);

  return items;
}

export default useFetchItems;
