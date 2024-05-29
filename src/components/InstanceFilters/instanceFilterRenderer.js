import React from 'react';
import { get } from 'lodash';

import { facetsStore } from '@folio/stripes-inventory-components';

import InstanceFilters from './InstanceFilters';
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
    consortiaTenants,
  } = data;

  const activeFilters = getCurrentFilters(get(query, 'filters', ''));

  const dataProp = {
    locations,
    resourceTypes: instanceTypes,
    instanceFormats,
    modesOfIssuance,
    tagsRecords: tags,
    natureOfContentTerms,
    statisticalCodes,
    query,
    onFetchFacets,
    parentResources,
    instanceStatuses,
    consortiaTenants,
  };

  return (
    <InstanceFilters
      activeFilters={activeFilters}
      data={dataProp}
      onChange={onChange}
      onClear={(name) => {
        facetsStore.getState().resetFacetByName(name);
        onChange({ name, values: [] });
      }}
    />
  );
};

export default instanceFilterRenderer;
