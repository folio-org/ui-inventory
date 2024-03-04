import '../../../test/jest/__mock__';

import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import { screen, waitFor } from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import { ModuleHierarchyProvider } from '@folio/stripes/core';

import InstanceFilters from './InstanceFilters';
import { FACETS, USER_TOUCHED_STAFF_SUPPRESS_STORAGE_KEY } from '../../constants';
import renderWithIntl from '../../../test/jest/helpers/renderWithIntl';
import translationsProperties from '../../../test/jest/helpers/translationsProperties';


jest.mock('../CheckboxFacet/CheckboxFacet', () => ({ name, onChange }) => ((
  <button type="button" onClick={() => onChange()}>change facet {name}</button>
)));

jest.mock('../../facetUtils', () => ({
  ...jest.requireActual('../../facetUtils'),
  getSourceOptions: jest.fn(),
  getSuppressedOptions: jest.fn(),
}));

const activeFilters = {
  [FACETS.SHARED]: ['SHARED1'],
  [FACETS.HELD_BY]: ['HELD_BY1'],
  [FACETS.EFFECTIVE_LOCATION]: ['loc1'],
  [FACETS.ITEM_STATUS]: ['ITEM_STATUS1'],
  [FACETS.RESOURCE]: ['RESOURCE1'],
  [FACETS.FORMAT]: ['Format1'],
  [FACETS.LANGUAGE]: ['languages'],
  [FACETS.MODE]: ['Mode1'],
  [FACETS.NATURE_OF_CONTENT]: ['NATUREOFCONTENT1'],
  [FACETS.STAFF_SUPPRESS]: ['STAFFSUPPRESS1'],
  [FACETS.INSTANCES_DISCOVERY_SUPPRESS]: ['DISCOVERYSUPPRESS1'],
  [FACETS.STATISTICAL_CODE_IDS]: ['STATISTICALCODEIDS1'],
  [FACETS.CREATED_DATE]: ['2022-01-01'],
  [FACETS.UPDATED_DATE]: ['2022-01-01'],
  [FACETS.STATUS]: ['STATUS1'],
  [FACETS.SOURCE]: ['SOURCE1']
};

const resources = {
  facets: {
    hasLoaded: true,
    resource: 'facets',
    records: [{
      'shared': { values: ['shared1'] },
      'holdings.tenantId': { values: ['heldby1'] },
      'items.effectiveLocationId': { values: ['effectiveLocationId1'] },
      'languages': { values: ['languages'] },
      'statisticalCodeIds': { values: ['statisticalCodeIds1'] },
      'discoverySuppress': { values: ['discoverySuppress1'] },
      'source': { values: ['source1'] },
      'instanceTags': { values: ['instanceTags1'] },
      'statusId': { values: ['statusId1'] },
      'staffSuppress': { values: ['staffSuppress1'] },
      'natureOfContentTermIds': { values: ['natureOfContentTermIds1'] },
      'modeOfIssuanceId': { values: ['modeOfIssuanceId1'] },
      'instanceFormatIds': { values: ['instanceFormatIds1'] },
      'instanceTypeId': { values: ['instanceTypeId1'] },
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
  consortiaTenants: [],
  tagsRecords: [],
  natureOfContentTerms: [],
  query: {
    filters: 'language.eng',
  },
  onFetchFacets: jest.fn(),
  parentResources: resources,
};
const onChange = jest.fn();
const onClear = jest.fn();
const renderInstanceFilters = () => {
  return renderWithIntl(
    <Router>
      <ModuleHierarchyProvider module="@folio/inventory">
        <InstanceFilters
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

describe('InstanceFilters', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Should Clear selected filters for shared', async () => {
    renderInstanceFilters();
    const Clearselectedfilters = screen.getByRole('button', { name: 'Clear selected filters for "Shared"' });
    userEvent.click(Clearselectedfilters);
    await waitFor(() => {
      expect(onClear).toBeCalledWith(FACETS.SHARED);
    });
  });

  it('Should Clear selected filters for Held By', async () => {
    renderInstanceFilters();
    const Clearselectedfilters = screen.getByRole('button', { name: 'Clear selected filters for "Held by"' });
    userEvent.click(Clearselectedfilters);
    await waitFor(() => {
      expect(onClear).toBeCalledWith(FACETS.HELD_BY);
    });
  });

  it('Should Clear selected filters for effective Location', async () => {
    renderInstanceFilters();
    const Clearselectedfilters = screen.getByRole('button', { name: 'Clear selected filters for "Effective location (item)"' });
    userEvent.click(Clearselectedfilters);
    await waitFor(() => {
      expect(onClear).toBeCalledWith(FACETS.EFFECTIVE_LOCATION);
    });
  });

  it('Should Clear selected filters for language', async () => {
    renderInstanceFilters();
    const Clearselectedfilters = screen.getByRole('button', { name: 'Clear selected filters for "Language"' });

    userEvent.click(Clearselectedfilters);
    await waitFor(() => {
      expect(onClear).toBeCalledWith(FACETS.LANGUAGE);
    });
  });

  it('Should Clear selected filters for resource', async () => {
    renderInstanceFilters();
    const Clearselectedfilters = screen.getByRole('button', { name: 'Clear selected filters for "Resource Type"' });
    userEvent.click(Clearselectedfilters);
    await waitFor(() => {
      expect(onClear).toBeCalledWith(FACETS.RESOURCE);
    });
  });

  it('Should Clear selected filters for format', async () => {
    renderInstanceFilters();
    const Clearselectedfilters = screen.getByRole('button', { name: 'Clear selected filters for "Format"' });
    userEvent.click(Clearselectedfilters);
    await waitFor(() => {
      expect(onClear).toBeCalledWith(FACETS.FORMAT);
    });
  });

  it('Should Clear selected filters for mode', async () => {
    renderInstanceFilters();
    const Clearselectedfilters = screen.getByRole('button', { name: 'Clear selected filters for "Mode of issuance"' });
    userEvent.click(Clearselectedfilters);
    await waitFor(() => {
      expect(onClear).toBeCalledWith(FACETS.MODE);
    });
  });

  it('Should Clear selected filters for nature Of Content', async () => {
    renderInstanceFilters();
    const Clearselectedfilters = screen.getByRole('button', { name: 'Clear selected filters for "Nature of content"' });
    userEvent.click(Clearselectedfilters);
    await waitFor(() => {
      expect(onClear).toBeCalledWith(FACETS.NATURE_OF_CONTENT);
    });
  });

  it('Should Clear selected filters for staffSuppress', async () => {
    renderInstanceFilters();
    const Clearselectedfilters = screen.getByRole('button', { name: 'Clear selected filters for "Staff suppress"' });
    userEvent.click(Clearselectedfilters);
    await waitFor(() => {
      expect(onClear).toBeCalledWith(FACETS.STAFF_SUPPRESS);
    });
  });

  it('Should Clear selected filters for Suppress from discovery', async () => {
    renderInstanceFilters();
    const Clearselectedfilters = screen.getByRole('button', { name: 'Clear selected filters for "Suppress from discovery"' });
    userEvent.click(Clearselectedfilters);
    await waitFor(() => {
      expect(onClear).toBeCalledWith(FACETS.INSTANCES_DISCOVERY_SUPPRESS);
    });
  });

  it('Should Clear selected filters for Statistical code filter list', async () => {
    renderInstanceFilters();
    const Clearselectedfilters = screen.getByRole('button', { name: 'Clear selected filters for "Statistical code"' });
    userEvent.click(Clearselectedfilters);
    await waitFor(() => {
      expect(onClear).toBeCalledWith(FACETS.STATISTICAL_CODE_IDS);
    });
  });

  it('Should Clear selected filters for Date created filter list', async () => {
    renderInstanceFilters();
    const Clearselectedfilters = screen.getByRole('button', { name: 'Clear selected filters for "Date created"' });
    userEvent.click(Clearselectedfilters);
    await waitFor(() => {
      expect(onClear).toBeCalledWith(FACETS.CREATED_DATE);
    });
  });

  it('Should Clear selected filters for Date updated filter list', async () => {
    renderInstanceFilters();
    const Clearselectedfilters = screen.getByRole('button', { name: 'Clear selected filters for "Date updated"' });
    userEvent.click(Clearselectedfilters);
    await waitFor(() => {
      expect(onClear).toBeCalledWith(FACETS.UPDATED_DATE);
    });
  });

  it('Should Clear selected filters for Instance status filter list', async () => {
    renderInstanceFilters();
    const Clearselectedfilters = screen.getByRole('button', { name: 'Clear selected filters for "Instance status"' });
    userEvent.click(Clearselectedfilters);
    await waitFor(() => {
      expect(onClear).toBeCalledWith(FACETS.STATUS);
    });
  });

  it('Should Clear selected filters for Source filter list', async () => {
    renderInstanceFilters();
    const Clearselectedfilters = screen.getByRole('button', { name: 'Clear selected filters for "Source"' });
    userEvent.click(Clearselectedfilters);
    await waitFor(() => {
      expect(onClear).toBeCalledWith(FACETS.SOURCE);
    });
  });

  describe('when user selects staff suppress options', () => {
    const mockSetItem = jest.fn();
    beforeEach(() => {
      global.Storage.prototype.setItem = mockSetItem;
    });

    afterEach(() => {
      global.Storage.prototype.setItem.mockReset();
    });

    it('should set a flag that user selected some option', async () => {
      renderInstanceFilters();
      const staffSuppressFacet = screen.queryByRole('button', { name: 'Staff suppress filter list' });
      await userEvent.click(staffSuppressFacet);
      await userEvent.click(screen.getByText('change facet staffSuppress'));

      expect(mockSetItem).toHaveBeenCalledWith(USER_TOUCHED_STAFF_SUPPRESS_STORAGE_KEY, true);
    });
  });
});
