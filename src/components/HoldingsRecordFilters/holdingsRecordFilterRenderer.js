import React from 'react';

import { resetFacetSearchValue } from '@folio/stripes-inventory-components';

import HoldingsRecordFilters from './HoldingsRecordFilters';

// holdingsRecordFilterRenderer is a function that takes a single argument `data`
// and returns a function that takes a single argument `onChange`.
const holdingsRecordFilterRenderer = data => onChange => {
  const {
    locations,
    statisticalCodes,
    holdingsSources,
    holdingsTypes,
    query,
    tags,
    consortiaTenants,
    filterConfig,
  } = data;

  return (
    <HoldingsRecordFilters
      filterConfig={filterConfig}
      data={{
        locations,
        statisticalCodes,
        holdingsSources,
        holdingsTypes,
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

export default holdingsRecordFilterRenderer;
