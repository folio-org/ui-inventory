import React from 'react';
import '../../../test/jest/__mock__';
import { BrowserRouter as Router } from 'react-router-dom';
import { screen, waitFor } from '@folio/jest-config-stripes/testing-library/react';
import { ModuleHierarchyProvider } from '@folio/stripes/core';

import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import renderWithIntl from '../../../test/jest/helpers/renderWithIntl';
import {
  FACETS
} from '../../constants';
import HoldingsRecordFilters from './HoldingsRecordFilters';
import translationsProperties from '../../../test/jest/helpers/translationsProperties';

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
  [FACETS.HOLDINGS_PERMANENT_LOCATION]: ['loc2'],
  [FACETS.HOLDINGS_TYPE]: ['loc3'],
  [FACETS.HOLDINGS_DISCOVERY_SUPPRESS]: ['loc4'],
  [FACETS.HOLDINGS_STATISTICAL_CODE_IDS]: ['loc5'],
  [FACETS.HOLDINGS_CREATED_DATE]: ['2022-01-01'],
  [FACETS.HOLDINGS_UPDATED_DATE]: ['2022-01-01'],
  [FACETS.HOLDINGS_SOURCE]: ['loc8']
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
      'holdings.statisticalCodeIds': { values: ['statisticalCodeIds1'] },
      'holdings.discoverySuppress': { values: ['discoverySuppress1'] },
      'holdings.sourceId': { values: ['sourceId1'] },
      'holdingsTags': { values: ['holdingsTags1'] },
      'holdings.holdingsTypeId': { values: ['holdingsTypeId1'] },
    }],
    other: { totalRecords: 0 }
  },
};

const data = {
  locations: [],
  statisticalCodes: [],
  holdingsSources: [],
  holdingsTypes: [],
  resourceTypes: [],
  instanceFormats: [],
  modesOfIssuance: [],
  tagsRecords: [],
  natureOfContentTerms: [],
  consortiaTenants: [],
  query: [],
  onFetchFacets: jest.fn(),
  parentResources: resources,
};

const onChange = jest.fn();
const onClear = jest.fn();

const renderHoldingsRecordFilters = () => {
  return renderWithIntl(
    <Router>
      <ModuleHierarchyProvider module="@folio/inventory">
        <HoldingsRecordFilters
          activeFilters={activeFilters}
          data={data}
          parentResources={resources}
          onChange={onChange}
          onClear={onClear}
        />
      </ModuleHierarchyProvider>
    </Router>,
    translationsProperties
  );
};

describe('HoldingsRecordFilters', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Should Render shared, Clear selectedfilters buttons', async () => {
    renderHoldingsRecordFilters();
    const shared = screen.getByLabelText('Shared filter list');
    userEvent.click(shared);
    const Clearselectedfilters = screen.getAllByRole('button');
    userEvent.click(Clearselectedfilters[1]);
    await waitFor(() => {
      expect(onClear).toBeCalledWith(FACETS.SHARED);
    });
  });

  it('Should Render Held by, Clear selectedfilters buttons', async () => {
    renderHoldingsRecordFilters();
    const heldBy = screen.getByLabelText('Held by filter list');
    userEvent.click(heldBy);
    const Clearselectedfilters = screen.getAllByRole('button');
    userEvent.click(Clearselectedfilters[3]);
    await waitFor(() => {
      expect(onClear).toBeCalledWith(FACETS.HELD_BY);
    });
  });

  it('Should Render effectiveLocation, Clear selectedfilters buttons', async () => {
    renderHoldingsRecordFilters();
    const effectiveLocation = screen.getByLabelText('Effective location (item) filter list');
    userEvent.click(effectiveLocation);
    const Clearselectedfilters = screen.getAllByRole('button');
    userEvent.click(Clearselectedfilters[5]);
    await waitFor(() => {
      expect(onClear).toBeCalledWith(FACETS.EFFECTIVE_LOCATION);
    });
  });

  it('Should Render holdingsPermanentLocation, Clear selectedfilters buttons', async () => {
    renderHoldingsRecordFilters();
    const holdingsPermanentLocation = screen.getByLabelText('Holdings permanent location filter list');
    userEvent.click(holdingsPermanentLocation);
    const Clearselectedfilters = screen.getAllByRole('button');
    userEvent.click(Clearselectedfilters[7]);
    await waitFor(() => {
      expect(onClear).toBeCalledWith(FACETS.HOLDINGS_PERMANENT_LOCATION);
    });
  });

  it('Should Render holdingsType, Clear selectedfilters buttons', async () => {
    renderHoldingsRecordFilters();
    const holdingsType = screen.getByLabelText('Holdings type filter list');
    userEvent.click(holdingsType);
    const Clearselectedfilters = screen.getAllByRole('button');
    userEvent.click(Clearselectedfilters[9]);
    await waitFor(() => {
      expect(onClear).toBeCalledWith(FACETS.HOLDINGS_TYPE);
    });
  });

  it('Should Render holdingsDiscoverySuppress, Clear selectedfilters buttons', async () => {
    renderHoldingsRecordFilters();
    const holdingsDiscoverySuppress = screen.getByLabelText('Suppress from discovery filter list');
    userEvent.click(holdingsDiscoverySuppress);
    const Clearselectedfilters = screen.getAllByRole('button');
    userEvent.click(Clearselectedfilters[11]);
    await waitFor(() => {
      expect(onClear).toBeCalledWith(FACETS.HOLDINGS_DISCOVERY_SUPPRESS);
    });
  });

  it('Should Render holdingsStatisticalCodeIds, Clear selectedfilters buttons', async () => {
    renderHoldingsRecordFilters();
    const holdingsStatisticalCodeIds = screen.getByLabelText('Statistical code filter list');
    userEvent.click(holdingsStatisticalCodeIds);
    const Clearselectedfilters = screen.getAllByRole('button');
    userEvent.click(Clearselectedfilters[13]);
    await waitFor(() => {
      expect(onClear).toBeCalledWith(FACETS.HOLDINGS_STATISTICAL_CODE_IDS);
    });
  });

  it('Should Render holdingsCreatedDate, Clear selectedfilters buttons', async () => {
    renderHoldingsRecordFilters();
    const holdingsCreatedDate = screen.getByLabelText('Date created filter list');
    userEvent.click(holdingsCreatedDate);
    const Clearselectedfilters = screen.getAllByRole('button');
    userEvent.click(Clearselectedfilters[15]);
    await waitFor(() => {
      expect(onClear).toBeCalledWith(FACETS.HOLDINGS_CREATED_DATE);
    });
  });

  it('Should Render holdingsUpdatedDate, Clear selectedfilters buttons', async () => {
    renderHoldingsRecordFilters();
    const holdingsUpdatedDate = screen.getByLabelText('Date updated filter list');
    userEvent.click(holdingsUpdatedDate);
    const Clearselectedfilters = screen.getAllByRole('button');
    userEvent.click(Clearselectedfilters[22]);
    await waitFor(() => {
      expect(onClear).toBeCalledWith(FACETS.HOLDINGS_UPDATED_DATE);
    });
  });
  it('Should Render holdingsSource, Clear selectedfilters buttons', async () => {
    renderHoldingsRecordFilters();
    const holdingsSource = screen.getByLabelText('Source filter list');
    userEvent.click(holdingsSource);
    const Clearselectedfilters = screen.getAllByRole('button');
    userEvent.click(Clearselectedfilters[29]);
    await waitFor(() => {
      expect(onClear).toBeCalledWith(FACETS.HOLDINGS_SOURCE);
    });
  });
});
