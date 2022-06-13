import React from 'react';
import { get } from 'lodash';

import InstanceFilters from './InstanceFilters';
import InstanceBrowseFilters from '../InstanceBrowseFilters';
import { getCurrentFilters } from '../../utils';

// instanceFilterRenderer is a function that takes a single argument `data`
// and returns a function that takes a single argument `onChange`.
const instanceFilterRenderer = data => onChange => {
  const {
    locations,
    instanceTypes,
    instanceFormats,
    instanceStatuses,
    modesOfIssuance,
    natureOfContentTerms,
    query,
    tags,
    onFetchFacets,
    parentResources,
    statisticalCodes,
    browseType,
    contributorNameTypes,
  } = data;
  const activeFilters = getCurrentFilters(get(query, 'filters', ''));
  const FilterComponent = browseType ? InstanceBrowseFilters : InstanceFilters;

  return (
    <FilterComponent
      activeFilters={activeFilters}
      data={{
        locations,
        resourceTypes: instanceTypes,
        instanceFormats,
        instanceStatuses,
        modesOfIssuance,
        tagsRecords: tags,
        natureOfContentTerms,
        statisticalCodes,
        query,
        onFetchFacets,
        parentResources,
        browseType,
        contributorNameTypes,
      }}
      onChange={onChange}
      onClear={(name) => onChange({ name, values: [] })}
    />
  );
};

export default instanceFilterRenderer;
