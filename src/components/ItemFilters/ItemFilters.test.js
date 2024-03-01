import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { screen, waitFor } from '@folio/jest-config-stripes/testing-library/react';
import '../../../test/jest/__mock__';
import { ModuleHierarchyProvider } from '@folio/stripes/core';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import renderWithIntl from '../../../test/jest/helpers/renderWithIntl';

import ItemFilters from './ItemFilters';
import translationsProperties from '../../../test/jest/helpers/translationsProperties';
import { FACETS } from '../../constants';

jest.mock('../CheckboxFacet/CheckboxFacet', () => jest.fn().mockReturnValue('CheckboxFacet'));

jest.mock('../../facetUtils', () => ({
  ...jest.requireActual('../../facetUtils'),
  getSourceOptions: jest.fn(),
  getSuppressedOptions: jest.fn(),
}));

const activeFilters = {
  [FACETS.SHARED]: ['shared1'],
  [FACETS.HELD_BY]: ['HELD_BY1'],
  [FACETS.EFFECTIVE_LOCATION]: ['loc1'],
  [FACETS.ITEM_STATUS]: ['ITEM_STATUS1'],
  [FACETS.HOLDINGS_PERMANENT_LOCATION]: ['loc2'],
  [FACETS.MATERIAL_TYPE]: ['MATERIAL_TYPE]1'],
  [FACETS.ITEMS_DISCOVERY_SUPPRESS]: ['DISCOVERYSUPPRESS1'],
  [FACETS.ITEMS_STATISTICAL_CODE_IDS]: ['STATISTICALCODEIDS1'],
  [FACETS.ITEMS_CREATED_DATE]: ['2022-01-01'],
  [FACETS.ITEMS_UPDATED_DATE]: ['2022-01-01'],
};

const resources = {
  facets: {
    hasLoaded: true,
    resource: 'facets',
    records: [{
      'shared': { values: ['shared1'] },
      'holdings.tenantId': { values: ['heldby1'] },
      'items.effectiveLocationId': { values: ['effectiveLocationId1'] },
      'holdings.permanentLocationId': { values: ['permanentLocationId1'] },
      'items.statisticalCodeIds': { values: ['statisticalCodeIds1'] },
      'items.discoverySuppress': { values: ['discoverySuppress1'] },
      'items.status.name': { values: ['name1'] },
      'itemTags': { values: ['itemTags1'] },
      'items.materialTypeId': { values: ['materialTypeId1'] },
    }],
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
  consortiaTenants: [],
  query: {
    filters: 'language.eng',
  },
  onFetchFacets: jest.fn(),
  parentResources: resources,
};
const onChange = jest.fn();
const onClear = jest.fn();
const renderItemFilters = () => {
  return renderWithIntl(
    <Router>
      <ModuleHierarchyProvider module="@folio/inventory">
        <ItemFilters
          activeFilters={activeFilters}
          data={data}
          onChange={onChange}
          onClear={onClear}
          parentResources={resources}
        />
      </ModuleHierarchyProvider>
    </Router>,
    translationsProperties
  );
};

describe('ItemFilters', () => {
  beforeEach(() => {
    renderItemFilters();
    jest.clearAllMocks();
  });

  it('Should Clear selected filters for shared', async () => {
    expect(screen.getByText('Shared')).toBeInTheDocument();
    const Clearselectedfilters = screen.getAllByRole('button');
    userEvent.click(Clearselectedfilters[1]);
    await waitFor(() => {
      expect(onClear).toHaveBeenCalledWith(FACETS.SHARED);
    });
  });

  it('Should Clear selected filters for Held by', async () => {
    expect(screen.getByText('Held by')).toBeInTheDocument();
    const Clearselectedfilters = screen.getAllByRole('button');
    userEvent.click(Clearselectedfilters[3]);
    await waitFor(() => {
      expect(onClear).toHaveBeenCalledWith(FACETS.HELD_BY);
    });
  });

  it('Should Clear selected filters for itemStatus', async () => {
    expect(screen.getByText('Item status')).toBeInTheDocument();
    const Clearselectedfilters = screen.getAllByRole('button');
    userEvent.click(Clearselectedfilters[5]);
    await waitFor(() => {
      expect(onClear).toHaveBeenCalledWith(FACETS.ITEM_STATUS);
    });
  });

  it('Should Clear selected filters for effectiveLocation', async () => {
    expect(screen.getByText('Effective location (item)')).toBeInTheDocument();
    const Clearselectedfilters = screen.getAllByRole('button');
    userEvent.click(Clearselectedfilters[7]);
    await waitFor(() => {
      expect(onClear).toHaveBeenCalledWith(FACETS.EFFECTIVE_LOCATION);
    });
  });

  it('Should Clear selected filters for holdingsPermanentLocation', async () => {
    expect(screen.getByText('Holdings permanent location')).toBeInTheDocument();
    const Clearselectedfilters = screen.getAllByRole('button');
    userEvent.click(Clearselectedfilters[9]);
    await waitFor(() => {
      expect(onClear).toHaveBeenCalledWith(FACETS.HOLDINGS_PERMANENT_LOCATION);
    });
  });

  it('Should Clear selected filters for materialType', async () => {
    expect(screen.getByText('Material type')).toBeInTheDocument();
    const Clearselectedfilters = screen.getAllByRole('button');
    userEvent.click(Clearselectedfilters[11]);
    await waitFor(() => {
      expect(onClear).toHaveBeenCalledWith(FACETS.MATERIAL_TYPE);
    });
  });

  it('Should Clear selected filters for itemsDiscoverySuppress', async () => {
    expect(screen.getByText('Suppress from discovery')).toBeInTheDocument();
    const Clearselectedfilters = screen.getAllByRole('button');
    userEvent.click(Clearselectedfilters[13]);
    await waitFor(() => {
      expect(onClear).toHaveBeenCalledWith(FACETS.ITEMS_DISCOVERY_SUPPRESS);
    });
  });

  it('Should Clear selected filters for itemsStatisticalCodeIds', async () => {
    expect(screen.getByText('Statistical code')).toBeInTheDocument();
    const Clearselectedfilters = screen.getAllByRole('button');
    userEvent.click(Clearselectedfilters[15]);
    await waitFor(() => {
      expect(onClear).toHaveBeenCalledWith(FACETS.ITEMS_STATISTICAL_CODE_IDS);
    });
  });

  it('Should Clear selected filters for items Created Date', async () => {
    expect(screen.getByText('Date created')).toBeInTheDocument();
    const Clearselectedfilters = screen.getAllByRole('button');
    userEvent.click(Clearselectedfilters[17]);
    await waitFor(() => {
      expect(onClear).toHaveBeenCalledWith(FACETS.ITEMS_CREATED_DATE);
    });
  });

  it('Should Clear selected filters for itemsUpdatedDate', async () => {
    expect(screen.getByText('Date updated')).toBeInTheDocument();
    const Clearselectedfilters = screen.getAllByRole('button');
    userEvent.click(Clearselectedfilters[24]);
    await waitFor(() => {
      expect(onClear).toHaveBeenCalledWith(FACETS.ITEMS_UPDATED_DATE);
    });
  });
});
