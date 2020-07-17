import React, {
  useEffect,
  useState,
} from 'react';
import PropTypes from 'prop-types';

import { stripesConnect } from '@folio/stripes/core';

import ItemsList from './ItemsList';
import ItemsListMovement from './ItemsListMovement';

const ItemsListContainer = ({ holding, mutator, isMovement, ...rest }) => {
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

  return isMovement ? (
    <ItemsListMovement
      {...rest}
      holding={holding}
      items={items}
    />
  ) : (
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
  isMovement: PropTypes.bool,
};

export default stripesConnect(ItemsListContainer);
