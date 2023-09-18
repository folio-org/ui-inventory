import React from 'react';
import { get } from 'lodash';

import HoldingsRecordFilters from './HoldingsRecordFilters';
import { getCurrentFilters } from '../../utils';
import facetsStore from '../../stores/facetsStore';

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
    onFetchFacets,
    parentResources,
    consortiaTenants,
  } = data;

  return (
    <HoldingsRecordFilters
      activeFilters={getCurrentFilters(get(query, 'filters', ''))}
      data={{
        locations,
        statisticalCodes,
        holdingsSources,
        holdingsTypes,
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

export default holdingsRecordFilterRenderer;
