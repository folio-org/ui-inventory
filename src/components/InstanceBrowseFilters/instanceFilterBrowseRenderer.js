import React from 'react';
import { get } from 'lodash';

import InstanceFiltersBrowse from './InstanceFilterBrowse';
import { getCurrentFilters } from '../../utils';

// instanceFilterRenderer is a function that takes a single argument `data`
// and returns a function that takes a single argument `onChange`.
const InstanceFilterBrowseRenderer = data => onChange => {
  const {
    locations,
    instanceTypes,
    instanceFormats,
    modesOfIssuance,
    natureOfContentTerms,
    query,
    tags,
    onFetchFacets,
    parentResources,
    statisticalCodes,
    browseType,
  } = data;
  const activeFilters = getCurrentFilters(get(query, 'filters', ''));

  return (
    <InstanceFiltersBrowse
      activeFilters={activeFilters}
      data={{
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
        browseType,
      }}
      onChange={onChange}
      onClear={(name) => onChange({ name, values: [] })}
    />
  );
};

export default InstanceFilterBrowseRenderer;
