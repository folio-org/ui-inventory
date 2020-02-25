import React from 'react';
import { get } from 'lodash';

import InstanceFilters from './InstanceFilters';
import { getCurrentFilters } from '../../utils';

// instanceFilterRenderer is a function that takes a single argument `data`
// and returns a function that takes a single argument `onChange`.
const instanceFilterRenderer = data => onChange => {
  const {
    locations,
    instanceTypes,
    instanceFormats,
    modesOfIssuance,
    natureOfContentTerms,
    query,
  } = data;
  const activeFilters = getCurrentFilters(get(query, 'filters', ''));

  return (
    <InstanceFilters
      activeFilters={activeFilters}
      data={{
        locations,
        resourceTypes: instanceTypes,
        instanceFormats,
        modesOfIssuance,
        natureOfContentTerms
      }}
      onChange={onChange}
      onClear={(name) => onChange({ name, values: [] })}
    />
  );
};

export default instanceFilterRenderer;
