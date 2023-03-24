import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { noop } from 'lodash';

import '../../../test/jest/__mock__';

import { ModuleHierarchyProvider } from '@folio/stripes/core';
import renderWithIntl from '../../../test/jest/helpers/renderWithIntl';

import ItemFilters from './ItemFilters';

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

const renderItemFilters = () => {
  return renderWithIntl(
    <Router>
      <ModuleHierarchyProvider module="@folio/inventory">
        <ItemFilters
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

describe('ItemFilters', () => {
  beforeEach(() => {
    renderItemFilters();
  });

  it('Contains a filter for creation date ', () => {
    expect(document.querySelector('#itemsCreatedDate')).toBeInTheDocument();
  });

  it('Contains a filter for update date ', () => {
    expect(document.querySelector('#itemsUpdatedDate')).toBeInTheDocument();
  });

  it('Contains a filter for statistical code', () => {
    expect(document.querySelector('#itemsStatisticalCodeIds')).toBeInTheDocument();
  });
});
