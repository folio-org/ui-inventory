import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { noop } from 'lodash';
import { screen } from '@testing-library/react';

import { ModuleHierarchyProvider } from '@folio/stripes-core/src/components/ModuleHierarchy';

import '../../../test/jest/__mock__';
import renderWithIntl from '../../../test/jest/helpers/renderWithIntl';

import { InstanceFiltersBrowse } from '..';

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
  query: [],
  onFetchFacets: noop,
  parentResources: resources,
};

const renderInstanceFilters = () => {
  return renderWithIntl(
    <Router>
      <ModuleHierarchyProvider module="@folio/inventory">
        <InstanceFiltersBrowse
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
  it('Contains a filter for creation date ', () => {
    renderInstanceFilters();

    expect(screen.getByText('ui-inventory.filters.effectiveLocation')).toBeInTheDocument();
  });
});
