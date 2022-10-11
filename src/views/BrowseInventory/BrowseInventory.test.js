import '../../../test/jest/__mock__';

import userEvent from '@testing-library/user-event';
import { act, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { useLocationFilters } from '@folio/stripes-acq-components';

import {
  renderWithIntl,
  translationsProperties,
} from '../../../test/jest/helpers';
import { browseModeOptions } from '../../constants';
import BrowseInventory from './BrowseInventory';

jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  useLocationFilters: jest.fn(() => ([])),
}));
jest.mock('../../components', () => ({
  BrowseInventoryFilters: jest.fn(() => <>BrowseInventoryFilters</>),
  BrowseResultsPane: jest.fn(() => <>BrowseResultsPane</>),
  SearchModeNavigation: jest.fn(() => <>SearchModeNavigation</>),
}));
jest.mock('../../hooks', () => ({
  ...jest.requireActual('../../hooks'),
  useInventoryBrowse: jest.fn(() => ({}))
}));

const renderBrowseInventory = (props = {}) => renderWithIntl(
  <MemoryRouter>
    <BrowseInventory
      {...props}
    />
  </MemoryRouter>,
  translationsProperties,
);

const applyFilters = jest.fn();
const applySearch = jest.fn();
const changeSearch = jest.fn();
const resetFilters = jest.fn();
const changeSearchIndex = jest.fn();
const filtersUtils = [
  {},
  'searchQuery',
  applyFilters,
  applySearch,
  changeSearch,
  resetFilters,
  changeSearchIndex,
  browseModeOptions.CALL_NUMBERS,
];

describe('BrowseInventory', () => {
  beforeEach(() => {
    applySearch.mockClear();
    applyFilters.mockClear();
    changeSearch.mockClear();
    resetFilters.mockClear();
    changeSearchIndex.mockClear();
    useLocationFilters.mockClear().mockReturnValue(filtersUtils);
  });

  it('should render browse filters and results panes', () => {
    renderBrowseInventory();

    expect(screen.getByText(/BrowseInventoryFilters/)).toBeInTheDocument();
    expect(screen.getByText(/BrowseResultsPane/)).toBeInTheDocument();
    expect(screen.getByText(/SearchModeNavigation/)).toBeInTheDocument();
  });

  it('should call "changeSearchIndex" when browse mode option was changed', async () => {
    renderBrowseInventory();

    await act(async () => userEvent.selectOptions(screen.getByRole('combobox'), 'contributors'));

    expect(changeSearchIndex).toHaveBeenCalled();
  });

  it('should call "changeSearch" when search query was changed', async () => {
    const { container } = renderBrowseInventory();

    await act(async () => userEvent.type(screen.getByRole('searchbox'), 'newQuery'));
    await act(async () => userEvent.click(container.querySelector('[data-test-single-search-form-submit="true"]')));

    expect(applySearch).toHaveBeenCalled();
  });
});
