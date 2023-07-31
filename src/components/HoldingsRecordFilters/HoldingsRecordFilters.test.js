import React from 'react';
import '../../../test/jest/__mock__';
import { BrowserRouter as Router } from 'react-router-dom';
import { screen, waitFor } from '@testing-library/react';
import { ModuleHierarchyProvider } from '@folio/stripes-core/src/components/ModuleHierarchy';

import userEvent from '@testing-library/user-event';
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
    const shared = document.querySelector('[id="accordion-toggle-button-shared"]');
    userEvent.click(shared);
    const Clearselectedfilters = screen.getAllByRole('button');
    userEvent.click(Clearselectedfilters[1]);
    await waitFor(() => {
      expect(onClear).toBeCalledWith(FACETS.SHARED);
    });
  });

  it('Should Render effectiveLocation, Clear selectedfilters buttons', async () => {
    renderHoldingsRecordFilters();
    const effectiveLocation = document.querySelector('[id="accordion-toggle-button-effectiveLocation"]');
    userEvent.click(effectiveLocation);
    const Clearselectedfilters = screen.getAllByRole('button');
    userEvent.click(Clearselectedfilters[3]);
    await waitFor(() => {
      expect(onClear).toBeCalledWith(FACETS.EFFECTIVE_LOCATION);
    });
  });

  it('Should Render holdingsPermanentLocation, Clear selectedfilters buttons', async () => {
    renderHoldingsRecordFilters();
    const holdingsPermanentLocation = document.querySelector('[id="accordion-toggle-button-holdingsPermanentLocation"]');
    userEvent.click(holdingsPermanentLocation);
    const Clearselectedfilters = screen.getAllByRole('button');
    userEvent.click(Clearselectedfilters[5]);
    await waitFor(() => {
      expect(onClear).toBeCalledWith(FACETS.HOLDINGS_PERMANENT_LOCATION);
    });
  });

  it('Should Render holdingsType, Clear selectedfilters buttons', async () => {
    renderHoldingsRecordFilters();
    const holdingsType = document.querySelector('[id="accordion-toggle-button-holdingsType"]');
    userEvent.click(holdingsType);
    const Clearselectedfilters = screen.getAllByRole('button');
    userEvent.click(Clearselectedfilters[7]);
    await waitFor(() => {
      expect(onClear).toBeCalledWith(FACETS.HOLDINGS_TYPE);
    });
  });

  it('Should Render holdingsDiscoverySuppress, Clear selectedfilters buttons', async () => {
    renderHoldingsRecordFilters();
    const holdingsDiscoverySuppress = document.querySelector('[id="accordion-toggle-button-holdingsDiscoverySuppress"]');
    userEvent.click(holdingsDiscoverySuppress);
    const Clearselectedfilters = screen.getAllByRole('button');
    userEvent.click(Clearselectedfilters[9]);
    await waitFor(() => {
      expect(onClear).toBeCalledWith(FACETS.HOLDINGS_DISCOVERY_SUPPRESS);
    });
  });

  it('Should Render holdingsStatisticalCodeIds, Clear selectedfilters buttons', async () => {
    renderHoldingsRecordFilters();
    const holdingsStatisticalCodeIds = document.querySelector('[id="accordion-toggle-button-holdingsStatisticalCodeIds"]');
    userEvent.click(holdingsStatisticalCodeIds);
    const Clearselectedfilters = screen.getAllByRole('button');
    userEvent.click(Clearselectedfilters[11]);
    await waitFor(() => {
      expect(onClear).toBeCalledWith(FACETS.HOLDINGS_STATISTICAL_CODE_IDS);
    });
  });

  it('Should Render holdingsCreatedDate, Clear selectedfilters buttons', async () => {
    renderHoldingsRecordFilters();
    const holdingsCreatedDate = document.querySelector('[id="accordion-toggle-button-holdingsCreatedDate"]');
    userEvent.click(holdingsCreatedDate);
    const Clearselectedfilters = screen.getAllByRole('button');
    userEvent.click(Clearselectedfilters[13]);
    await waitFor(() => {
      expect(onClear).toBeCalledWith(FACETS.HOLDINGS_CREATED_DATE);
    });
  });

  it('Should Render holdingsUpdatedDate, Clear selectedfilters buttons', async () => {
    renderHoldingsRecordFilters();
    const holdingsUpdatedDate = document.querySelector('[id="accordion-toggle-button-holdingsUpdatedDate"]');
    userEvent.click(holdingsUpdatedDate);
    const Clearselectedfilters = screen.getAllByRole('button');
    userEvent.click(Clearselectedfilters[20]);
    await waitFor(() => {
      expect(onClear).toBeCalledWith(FACETS.HOLDINGS_UPDATED_DATE);
    });
  });
  it('Should Render holdingsSource, Clear selectedfilters buttons', async () => {
    renderHoldingsRecordFilters();
    const holdingsSource = document.querySelector('[id="accordion-toggle-button-holdingsSource"]');
    userEvent.click(holdingsSource);
    const Clearselectedfilters = screen.getAllByRole('button');
    userEvent.click(Clearselectedfilters[27]);
    await waitFor(() => {
      expect(onClear).toBeCalledWith(FACETS.HOLDINGS_SOURCE);
    });
  });
});
