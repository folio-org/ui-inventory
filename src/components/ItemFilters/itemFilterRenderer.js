import React from 'react';
import { get } from 'lodash';

import { facetsStore } from '@folio/stripes-inventory-components';

import ItemFilters from './ItemFilters';
import { getCurrentFilters } from '../../utils';
import { itemStatuses } from '../../constants';

// itemFilterRenderer is a function that takes a single argument `data`
// and returns a function that takes a single argument `onChange`.
const itemFilterRenderer = data => onChange => {
  const {
    query,
    materialTypes,
    statisticalCodes,
    locations,
    tags,
    onFetchFacets,
    parentResources,
    consortiaTenants,
  } = data;
  const activeFilters = getCurrentFilters(get(query, 'filters', ''));

  return (
    <ItemFilters
      activeFilters={activeFilters}
      data={{
        materialTypes,
        itemStatuses,
        statisticalCodes,
        locations,
        tagsRecords: tags,
        query,
        onFetchFacets,
        parentResources,
        consortiaTenants,
      }}
      onChange={onChange}
      onClear={(name) => {
        facetsStore.getState().resetFacetByName(name);
        onChange({ name, values: [] });
      }}
    />
  );
};

export default itemFilterRenderer;
