import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { noop } from 'lodash';

import '../../../test/jest/__mock__';

import { ModuleHierarchyProvider } from '@folio/stripes/core';

import renderWithIntl from '../../../test/jest/helpers/renderWithIntl';

import InstanceFilters from './InstanceFilters';

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
  statisticalCodes: [],
  instanceFormats: [],
  modesOfIssuance: [],
  tagsRecords: [],
  natureOfContentTerms: [],
  query: [],
  onFetchFacets: noop,
  parentResources: resources,
};

const renderInstanceFilters = () => {
  return renderWithIntl(
    <Router>
      <ModuleHierarchyProvider module="@folio/inventory">
        <InstanceFilters
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

describe('InstanceFilters', () => {
  beforeEach(() => {
    renderInstanceFilters();
  });

  it('Contains a filter for creation date ', () => {
    expect(document.querySelector('#createdDate')).toBeInTheDocument();
  });

  it('Contains a filter for update date ', () => {
    expect(document.querySelector('#updatedDate')).toBeInTheDocument();
  });

  it('Contains a filter for statistical code', () => {
    expect(document.querySelector('#statisticalCodeIds')).toBeInTheDocument();
  });
});
