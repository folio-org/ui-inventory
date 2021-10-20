import React from 'react';
// import { screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { noop } from 'lodash';

import { ModuleHierarchyProvider } from '@folio/stripes-core/src/components/ModuleHierarchy';

import '../../../test/jest/__mock__';
import renderWithIntl from '../../../test/jest/helpers/renderWithIntl';


import { FACETS } from '../../constants';

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
      <ModuleHierarchyProvider value={['@folio/inventory']}>
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
});