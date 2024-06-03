import React from 'react';

import { resetFacetSearchValue } from '@folio/stripes-inventory-components';

import InstanceFilters from './InstanceFilters';

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
    statisticalCodes,
    consortiaTenants,
    filterConfig,
  } = data;

  const dataProp = {
    locations,
    instanceTypes,
    instanceFormats,
    modesOfIssuance,
    tagsRecords: tags,
    natureOfContentTerms,
    statisticalCodes,
    query,
    instanceStatuses,
    consortiaTenants,
  };

  return (
    <InstanceFilters
      filterConfig={filterConfig}
      data={dataProp}
      onChange={onChange}
      onClear={(name) => {
        resetFacetSearchValue(name);
        onChange({ name, values: [] });
      }}
    />
  );
};

export default instanceFilterRenderer;
