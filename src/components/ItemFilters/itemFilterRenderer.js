import React from 'react';

import { resetFacetSearchValue } from '@folio/stripes-inventory-components';

import ItemFilters from './ItemFilters';

// itemFilterRenderer is a function that takes a single argument `data`
// and returns a function that takes a single argument `onChange`.
const itemFilterRenderer = data => onChange => {
  const {
    query,
    materialTypes,
    statisticalCodes,
    locations,
    tags,
    consortiaTenants,
    filterConfig,
  } = data;

  return (
    <ItemFilters
      filterConfig={filterConfig}
      data={{
        materialTypes,
        statisticalCodes,
        locations,
        tagsRecords: tags,
        query,
        consortiaTenants,
      }}
      onChange={onChange}
      onClear={(name) => {
        resetFacetSearchValue(name);
        onChange({ name, values: [] });
      }}
    />
  );
};

export default itemFilterRenderer;
