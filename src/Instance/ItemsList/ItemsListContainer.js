import React, {
  useEffect,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';

import { stripesConnect } from '@folio/stripes/core';

import ItemsList from './ItemsList';

const ItemsListContainer = ({ holding, mutator, setOpen, ...rest }) => {
  const [items, setItems] = useState();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);

    mutator.instanceHoldingItems.GET()
      .then(data => {
        setItems(data);
        if (!isEmpty(data)) setOpen(true);
      })
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
  setOpen: PropTypes.func.isRequired,
};

export default stripesConnect(ItemsListContainer);
