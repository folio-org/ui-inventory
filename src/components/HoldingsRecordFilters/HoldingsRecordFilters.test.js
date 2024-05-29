import React from 'react';
import '../../../test/jest/__mock__';
import { BrowserRouter as Router } from 'react-router-dom';
import { screen, waitFor } from '@folio/jest-config-stripes/testing-library/react';
import { ModuleHierarchyProvider } from '@folio/stripes/core';
import { FACETS } from '@folio/stripes-inventory-components';

import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import renderWithIntl from '../../../test/jest/helpers/renderWithIntl';
import HoldingsRecordFilters from './HoldingsRecordFilters';
import translationsProperties from '../../../test/jest/helpers/translationsProperties';

jest.mock('@folio/stripes-inventory-components', () => ({
  ...jest.requireActual('@folio/stripes-inventory-components'),
  CheckboxFacet: jest.fn().mockReturnValue('CheckboxFacet'),
}));

const filterConfig = {
  filters: [],
  indexes: [],
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
  query: {
    filters: 'language.eng,shared.true,tenantId.fake-tenant,effectiveLocation.fake-id,holdingsPermanentLocation.fake-loc,' +
      'holdingsType.fake-h,holdingsDiscoverySuppress.fake-hds,holdingsStatisticalCodeIds.fake-hsc,' +
      'holdingsCreatedDate.2024-05-01:A2024-05-24,holdingsUpdatedDate.2024-05-01:A2024-05-24,holdingsSource.fake-source',
  },
};

const onChange = jest.fn();
const onClear = jest.fn();

const renderHoldingsRecordFilters = () => {
  return renderWithIntl(
    <Router>
      <ModuleHierarchyProvider module="@folio/inventory">
        <HoldingsRecordFilters
          filterConfig={filterConfig}
          data={data}
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
    const shared = screen.getByRole('button', { name: 'Shared filter list' });
    userEvent.click(shared);
    const Clearselectedfilters = screen.getAllByRole('button');
    userEvent.click(Clearselectedfilters[1]);
    await waitFor(() => {
      expect(onClear).toHaveBeenCalledWith(FACETS.SHARED);
    });
  });

  it('Should Render Held by, Clear selectedfilters buttons', async () => {
    renderHoldingsRecordFilters();
    const heldBy = screen.getByRole('button', { name: 'Held by filter list' });
    userEvent.click(heldBy);
    const Clearselectedfilters = screen.getAllByRole('button');
    userEvent.click(Clearselectedfilters[3]);
    await waitFor(() => {
      expect(onClear).toHaveBeenCalledWith(FACETS.HELD_BY);
    });
  });

  it('Should Render effectiveLocation, Clear selectedfilters buttons', async () => {
    renderHoldingsRecordFilters();
    const effectiveLocation = screen.getByRole('button', { name: 'Effective location (item) filter list' });
    userEvent.click(effectiveLocation);
    const Clearselectedfilters = screen.getAllByRole('button');
    userEvent.click(Clearselectedfilters[5]);
    await waitFor(() => {
      expect(onClear).toHaveBeenCalledWith(FACETS.EFFECTIVE_LOCATION);
    });
  });

  it('Should Render holdingsPermanentLocation, Clear selectedfilters buttons', async () => {
    renderHoldingsRecordFilters();
    const holdingsPermanentLocation = screen.getByRole('button', { name: 'Holdings permanent location filter list' });
    userEvent.click(holdingsPermanentLocation);
    const Clearselectedfilters = screen.getAllByRole('button');
    userEvent.click(Clearselectedfilters[7]);
    await waitFor(() => {
      expect(onClear).toHaveBeenCalledWith(FACETS.HOLDINGS_PERMANENT_LOCATION);
    });
  });

  it('Should Render holdingsType, Clear selectedfilters buttons', async () => {
    renderHoldingsRecordFilters();
    const holdingsType = screen.getByRole('button', { name: 'Holdings type filter list' });
    userEvent.click(holdingsType);
    const Clearselectedfilters = screen.getAllByRole('button');
    userEvent.click(Clearselectedfilters[9]);
    await waitFor(() => {
      expect(onClear).toHaveBeenCalledWith(FACETS.HOLDINGS_TYPE);
    });
  });

  it('Should Render holdingsDiscoverySuppress, Clear selectedfilters buttons', async () => {
    renderHoldingsRecordFilters();
    const holdingsDiscoverySuppress = screen.getByRole('button', { name: 'Suppress from discovery filter list' });
    userEvent.click(holdingsDiscoverySuppress);
    const Clearselectedfilters = screen.getAllByRole('button');
    userEvent.click(Clearselectedfilters[11]);
    await waitFor(() => {
      expect(onClear).toHaveBeenCalledWith(FACETS.HOLDINGS_DISCOVERY_SUPPRESS);
    });
  });

  it('Should Render holdingsStatisticalCodeIds, Clear selectedfilters buttons', async () => {
    renderHoldingsRecordFilters();
    const holdingsStatisticalCodeIds = screen.getByRole('button', { name: 'Statistical code filter list' });
    userEvent.click(holdingsStatisticalCodeIds);
    const Clearselectedfilters = screen.getAllByRole('button');
    userEvent.click(Clearselectedfilters[13]);
    await waitFor(() => {
      expect(onClear).toHaveBeenCalledWith(FACETS.HOLDINGS_STATISTICAL_CODE_IDS);
    });
  });

  it('Should Render holdingsCreatedDate, Clear selectedfilters buttons', async () => {
    renderHoldingsRecordFilters();
    const holdingsCreatedDate = screen.getByRole('button', { name: 'Date created filter list' });
    userEvent.click(holdingsCreatedDate);
    const Clearselectedfilters = screen.getAllByRole('button');
    userEvent.click(Clearselectedfilters[15]);
    await waitFor(() => {
      expect(onClear).toHaveBeenCalledWith(FACETS.HOLDINGS_CREATED_DATE);
    });
  });

  it('Should Render holdingsUpdatedDate, Clear selectedfilters buttons', async () => {
    renderHoldingsRecordFilters();
    const holdingsUpdatedDate = screen.getByRole('button', { name: 'Date updated filter list' });
    userEvent.click(holdingsUpdatedDate);
    userEvent.click(screen.getByRole('button', { name: 'Clear selected filters for "Date updated"' }));
    await waitFor(() => {
      expect(onClear).toHaveBeenCalledWith(FACETS.HOLDINGS_UPDATED_DATE);
    });
  });

  it('Should Render holdingsSource, Clear selectedfilters buttons', async () => {
    renderHoldingsRecordFilters();
    const holdingsSource = screen.getByRole('button', { name: 'Source filter list' });
    userEvent.click(holdingsSource);
    userEvent.click(screen.getByRole('button', { name: 'Clear selected filters for "Source"' }));
    await waitFor(() => {
      expect(onClear).toHaveBeenCalledWith(FACETS.HOLDINGS_SOURCE);
    });
  });
});
