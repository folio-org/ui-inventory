import React from 'react';
import { get } from 'lodash';

import HoldingsRecordFilters from './HoldingsRecordFilters';
import { getCurrentFilters } from '../../utils';

// holdingsRecordFilterRenderer is a function that takes a single argument `data`
// and returns a function that takes a single argument `onChange`.
const holdingsRecordFilterRenderer = data => onChange => {
  const {
    locations,
    query,
    tags,
    onFetchFacets,
    parentResources,
  } = data;

  return (
    <HoldingsRecordFilters
      activeFilters={getCurrentFilters(get(query, 'filters', ''))}
      data={{
        locations,
        tagsRecords: tags,
        query,
        onFetchFacets,
        parentResources,
      }}
      onChange={onChange}
      onClear={(name) => onChange({ name, values: [] })}
    />
  );
};

export default holdingsRecordFilterRenderer;
