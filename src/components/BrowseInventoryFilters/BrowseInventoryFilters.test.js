import { act, screen, fireEvent } from '@folio/jest-config-stripes/testing-library/react';

import '../../../test/jest/__mock__';

import { FACETS } from '@folio/stripes-inventory-components';
import {
  renderWithIntl,
  translationsProperties,
} from '../../../test/jest/helpers';
import BrowseInventoryFilters from './BrowseInventoryFilters';

const facetOptions = {
  effectiveLocationOptions: [
    {
      label: 'Annex',
      value: '53cf956f-c1df-410b-8bea-27f712cca7c0',
      count: 10,
    },
    {
      label: 'Main Library',
      value: 'fcd64ce1-6995-48f0-840e-89ffa2288371',
      count: 2,
    },
  ],
  nameTypeOptions: [],
  heldByOptions: [
    {
      label: 'College',
      value: 'college',
      count: 13,
    },
    {
      label: 'University',
      value: 'university',
      count: 8,
    },
  ],
};

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(() => ({ search: '' })),
}));
jest.mock('../../common/hooks', () => ({
  ...jest.requireActual('../../common/hooks'),
  useFacets: jest.fn(() => ([
    { effectiveLocation: true, nameType: false },
    jest.fn(),
    jest.fn(),
    jest.fn(),
    facetOptions,
    jest.fn(),
  ])),
}));

const defaultProps = {
  activeFilters: {},
  applyFilters: jest.fn(),
  fetchFacets: jest.fn(),
  resources: {
    facets: { records: [] },
  },
  searchIndex: 'callNumbers',
};

const renderBrowseInventoryFilters = (props = {}) => renderWithIntl(
  <BrowseInventoryFilters
    {...defaultProps}
    {...props}
  />,
  translationsProperties,
);

describe('BrowseInventoryFilters', () => {
  beforeEach(() => {
    defaultProps.applyFilters.mockClear();
  });

  it('should render filters for inventory browse', () => {
    renderBrowseInventoryFilters();

    expect(screen.getByText('Effective location (item)')).toBeInTheDocument();
  });

  it('should call "applyFilters" when facet filter was applied', async () => {
    renderBrowseInventoryFilters();

    const facetOption = await screen.findByText(facetOptions.effectiveLocationOptions[0].label);

    await act(async () => fireEvent.click(facetOption));

    expect(defaultProps.applyFilters).toHaveBeenCalled();
  });

  it('should call "applyFilters" when clear button was clicked for facet acccordion', async () => {
    const { container } = renderBrowseInventoryFilters({
      activeFilters: {
        [FACETS.EFFECTIVE_LOCATION]: [facetOptions.effectiveLocationOptions[0].value],
      },
    });

    const clearBtn = container.querySelector('[data-test-clear-button="true"]');

    await act(async () => fireEvent.click(clearBtn));

    expect(defaultProps.applyFilters).toHaveBeenCalled();
  });
});
