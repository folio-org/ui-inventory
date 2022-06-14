import React from 'react';
import { get } from 'lodash';

import InstanceFilters from './InstanceFilters';
import InstanceFiltersBrowse from './InstanceBrowseFilters';
import { getCurrentFilters } from '../../utils';
import { browseModeMap } from '../../constants';

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
  const isBrowseOption = !!browseModeMap[query.qindex];

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
    ...(isBrowseOption && {
      browseType,
      contributorNameTypes,
    }),
    ...(!isBrowseOption && { instanceStatuses }),
  };

  const Filters = browseModeMap[query.qindex] ? InstanceFiltersBrowse : InstanceFilters;

  return (
    <Filters
      activeFilters={activeFilters}
      data={dataProp}
      onChange={onChange}
      onClear={(name) => onChange({ name, values: [] })}
    />
  );
};

export default instanceFilterRenderer;
