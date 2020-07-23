import React, {
  useEffect,
  useState,
} from 'react';
import PropTypes from 'prop-types';

import { stripesConnect } from '@folio/stripes/core';

import ItemsList from './ItemsList';

const ItemsListContainer = ({ holding, mutator, ...rest }) => {
  const [items, setItems] = useState();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);

    mutator.instanceHoldingItems.GET()
      .then(setItems)
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  if (isLoading) return null;

  return (
    <ItemsList
      {...rest}
      holding={holding}
      items={items}
    />
  );
};

ItemsListContainer.manifest = Object.freeze({
  instanceHoldingItems: {
    type: 'okapi',
    records: 'items',
    path: 'inventory/items',
    params: {
      query: 'holdingsRecordId==!{holding.id}',
      limit: '5000',
    },
    accumulate: true,
    resourceShouldRefresh: true,
  },
});

ItemsListContainer.propTypes = {
  mutator: PropTypes.object.isRequired,
  holding: PropTypes.object.isRequired,
};

export default stripesConnect(ItemsListContainer);
