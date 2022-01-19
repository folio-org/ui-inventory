import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { noop } from 'lodash';

import { ModuleHierarchyProvider } from '@folio/stripes-core/src/components/ModuleHierarchy';

import '../../../test/jest/__mock__';
import renderWithIntl from '../../../test/jest/helpers/renderWithIntl';

import HoldingsRecordFilters from './HoldingsRecordFilters';

const resources = {
  facets: {
    hasLoaded: true,
    resource: 'facets',
    records: [],
    other: { totalRecords: 0 }
  },
};

const data = {
  locations: [],
  resourceTypes: [],
  instanceFormats: [],
  modesOfIssuance: [],
  statisticalCodes: [],
  tagsRecords: [],
  natureOfContentTerms: [],
  query: [],
  onFetchFacets: noop,
  parentResources: resources,
};

const renderHoldingsRecordFilters = () => {
  return renderWithIntl(
    <Router>
      <ModuleHierarchyProvider module="@folio/inventory">
        <HoldingsRecordFilters
          activeFilters={{ 'language': ['eng'] }}
          data={data}
          onChange={noop}
          onClear={noop}
          parentResources={resources}
        />
      </ModuleHierarchyProvider>
    </Router>
  );
};

describe('HoldingsRecordFilters', () => {
  beforeEach(() => {
    renderHoldingsRecordFilters();
  });

  it('Contains a filter for creation date', () => {
    expect(document.querySelector('#holdingsCreatedDate')).toBeInTheDocument();
  });

  it('Contains a filter for update date', () => {
    expect(document.querySelector('#holdingsUpdatedDate')).toBeInTheDocument();
  });

  it('Contains a filter for statistical code', () => {
    expect(document.querySelector('#statisticalCodes')).toBeInTheDocument();
  });
});
