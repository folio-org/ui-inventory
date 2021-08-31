import React from 'react';
import { get } from 'lodash';

import ItemFilters from './ItemFilters';
import { getCurrentFilters } from '../../utils';
import { itemStatuses } from '../../constants';

// itemFilterRenderer is a function that takes a single argument `data`
// and returns a function that takes a single argument `onChange`.
const itemFilterRenderer = data => onChange => {
  const {
    query,
    materialTypes,
    locations,
    tags,
    onFetchFacets,
    parentResources,
  } = data;
  const activeFilters = getCurrentFilters(get(query, 'filters', ''));

  return (
    <ItemFilters
      activeFilters={activeFilters}
      data={{
        materialTypes,
        itemStatuses,
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

export default itemFilterRenderer;
