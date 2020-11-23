import React from 'react';
import { get } from 'lodash';

import HoldingsRecordFilters from './HoldingsRecordFilters';
import { getCurrentFilters } from '../../utils';

// holdingsRecordFilterRenderer is a function that takes a single argument `data`
// and returns a function that takes a single argument `onChange`.
const holdingsRecordFilterRenderer = ({ locations, query, tags }) => onChange => (
  <HoldingsRecordFilters
    activeFilters={getCurrentFilters(get(query, 'filters', ''))}
    data={{
      locations,
      tagsRecords: tags,
    }}
    onChange={onChange}
    onClear={(name) => onChange({ name, values: [] })}
  />
);

export default holdingsRecordFilterRenderer;
