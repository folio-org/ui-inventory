import { render } from '@folio/jest-config-stripes/testing-library/react';
import {
  translationsProperties,
  Harness,
} from '../../../test/jest/helpers';

import EffectiveLocationFacet from './EffectiveLocationFacet';
import { FACETS } from '../../constants';
import { useLocationsOfAllTenantsQuery } from '../../hooks';

jest.mock('../../hooks', () => ({
  ...jest.requireActual('../../hooks'),
  useLocationsOfAllTenantsQuery: jest.fn(),
}));

const mockOnChange = jest.fn();
const mockOnClear = jest.fn();
const mockOnFetchFacets = jest.fn();
const mockOnFilterSearch = jest.fn();

const locations = [
  {
    'id': 'a9c99b1a-96ab-44ea-ac5e-17633e20fe4b',
    'name': 'Film/Fiche',
  },
  {
    'id': 'edc88657-7510-4ec6-b5e6-43a364eee358',
    'name': 'General Collection',
  },
  {
    'id': 'cced3456-1a55-42b2-b872-994d12e57405',
    'name': 'Serials',
  },
  {
    'id': '3371ffbf-d360-4f32-a3d2-c8754b249695',
    'name': 'Migration',
  },
  {
    'id': 'f879459a-6b91-4d49-92f2-b55f5d35b3c8',
    'name': 'Undergrad Law',
  },
  {
    'id': '5ff8a207-24f7-4d20-a893-c0b192c54d40',
    'name': 'Grad Students Law',
  },
  {
    'id': '3905ebe5-0947-48c5-baa8-ac9c3d7ea779',
    'name': 'autotest_location_name_949.1013758958569327',
  },
  {
    'id': '108ef496-ef5b-421b-baa9-109833493599',
    'name': 'Comic Collection',
  },
  {
    'id': '8ce6d0fc-014b-428d-a01b-7774090771c8',
    'name': 'General Stacks',
  },
  {
    'id': 'dbb41ca3-c6f1-4de5-9c95-4c771513e847',
    'name': 'Journals',
  },
  {
    'id': 'db6d88f9-3f7e-4427-94cf-2de54a674acc',
    'name': 'Migration',
  },
  {
    'id': 'c6f80a64-8932-406f-a60f-d04775106758',
    'name': 'North Stacks',
  },
  {
    'id': '773e5ce3-c226-4818-a78d-4de7ee0c9418',
    'name': 'Special Collections',
  },
  {
    'id': '20e7f901-ed35-48d4-bffb-b6400e6350f6',
    'name': 'Test',
  },
  {
    'id': '68d29c83-dbec-469f-9485-3bfb023bd122',
    'name': 'autotest_location_name_334.1160515515200669',
  },
  {
    'id': 'c374936b-458c-4222-a988-4e82495af3d4',
    'name': 'autotest_location_name_508.16218336790735350',
  },
];

const facetOptions = [
  {
    'id': 'edc88657-7510-4ec6-b5e6-43a364eee358',
    'totalRecords': 136827,
  },
  {
    'id': 'cced3456-1a55-42b2-b872-994d12e57405',
    'totalRecords': 136732,
  },
  {
    'id': 'a9c99b1a-96ab-44ea-ac5e-17633e20fe4b',
    'totalRecords': 136301,
  },
  {
    'id': '5ff8a207-24f7-4d20-a893-c0b192c54d40',
    'totalRecords': 136300,
  },
  {
    'id': 'f879459a-6b91-4d49-92f2-b55f5d35b3c8',
    'totalRecords': 136231,
  },
  {
    'id': '97a13d3a-3557-47ff-8eeb-e61c2137d6fc',
    'totalRecords': 126439,
  }
];

const allTenantIds = [
  'cs00000int_0005',
  'cs00000int_0001',
  'cs00000int_0003',
  'cs00000int_0004',
  'cs00000int_0007',
  'cs00000int_0006',
  'cs00000int',
  'cs00000int_0002'
];

const renderEffectiveLocationFacet = (props = {}) => render(
  <Harness
    translations={translationsProperties}
    dataContextValue={{
      allTenantIds,
    }}
  >
    <EffectiveLocationFacet
      open
      facetOptions={facetOptions}
      isLoadingFacets={false}
      name={FACETS.EFFECTIVE_LOCATION}
      onChange={mockOnChange}
      onClear={mockOnClear}
      onFetchFacets={mockOnFetchFacets}
      onFilterSearch={mockOnFilterSearch}
      {...props}
    />
  </Harness>
);

describe('EffectiveLocationFacet', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useLocationsOfAllTenantsQuery.mockReturnValue({
      data: locations,
      isLoading: false,
    });
  });

  describe('when facet is open', () => {
    it('should fetch locations of all tenants', () => {
      renderEffectiveLocationFacet();

      expect(useLocationsOfAllTenantsQuery).toHaveBeenCalledWith({
        enabled: true,
        tenantIds: allTenantIds,
      });
    });
  });

  describe('when facet is closed', () => {
    it('should not fetch locations of all tenants', () => {
      renderEffectiveLocationFacet({ open: false });

      expect(useLocationsOfAllTenantsQuery).toHaveBeenCalledWith({
        enabled: false,
        tenantIds: allTenantIds,
      });
    });
  });

  describe('when there is a deleted option', () => {
    it('should not be displayed', () => {
      const locationIndex = locations.findIndex(item => item.name === 'General Collection');

      useLocationsOfAllTenantsQuery.mockReturnValue({
        data: locations.toSpliced(locationIndex, 1),
        isLoading: false,
      });

      const { queryByText } = renderEffectiveLocationFacet();

      expect(facetOptions.some(option => option.id === 'edc88657-7510-4ec6-b5e6-43a364eee358')).toBeTruthy();
      expect(queryByText('General Collection')).not.toBeInTheDocument();
    });
  });

  it('should display label', () => {
    const { getByText } = renderEffectiveLocationFacet();

    expect(getByText('Effective location (item)')).toBeVisible();
  });

  it('should display five options with count and +More button', () => {
    const { getByText } = renderEffectiveLocationFacet();

    expect(getByText('General Collection')).toBeVisible();
    expect(getByText('136827')).toBeVisible();

    expect(getByText('Serials')).toBeVisible();
    expect(getByText('136732')).toBeVisible();

    expect(getByText('Film/Fiche')).toBeVisible();
    expect(getByText('136301')).toBeVisible();

    expect(getByText('Grad Students Law')).toBeVisible();
    expect(getByText('136300')).toBeVisible();

    expect(getByText('Undergrad Law')).toBeVisible();
    expect(getByText('136231')).toBeVisible();

    expect(getByText('More')).toBeVisible();
  });
});
