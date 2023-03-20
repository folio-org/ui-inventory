import '../../../test/jest/__mock__';

import userEvent from '@testing-library/user-event';
import { act, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { useLocalStorageFilters } from '@folio/stripes-acq-components';

import {
  renderWithIntl,
  translationsProperties,
} from '../../../test/jest/helpers';
import { browseModeOptions } from '../../constants';
import BrowseInventory from './BrowseInventory';
import { SearchModeNavigation, BrowseInventoryFilters } from '../../components';
import * as storage from '../../storage';

jest.mock('../../storage');
jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  useLocalStorageFilters: jest.fn(() => ([])),
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
const getFiltersUtils = ({
  filters = {},
  searchQuery = 'searchQuery',
  searchIndex = browseModeOptions.CONTRIBUTORS,
} = {}) => [
  filters,
  searchQuery,
  applyFilters,
  applySearch,
  changeSearch,
  resetFilters,
  changeSearchIndex,
  searchIndex,
];

describe('BrowseInventory', () => {
  beforeEach(() => {
    applySearch.mockClear();
    applyFilters.mockClear();
    changeSearch.mockClear();
    resetFilters.mockClear();
    changeSearchIndex.mockClear();
    useLocalStorageFilters.mockClear().mockReturnValue(getFiltersUtils());
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

  it('should not call "changeSearch" when search query is not valid', async () => {
    useLocalStorageFilters.mockClear().mockReturnValue(getFiltersUtils({
      searchQuery: 'with asterisks ***',
    }));

    const { container } = renderBrowseInventory();

    await act(async () => userEvent.click(container.querySelector('[data-test-single-search-form-submit="true"]')));

    expect(applySearch).not.toHaveBeenCalled();
  });

  describe('when the user clicks on the "Search" tab', () => {
    it('should remove pageConfig from the storage', () => {
      renderBrowseInventory();

      expect(SearchModeNavigation).toHaveBeenCalledWith({
        search: '?selectedSearchMode=true',
      }, {});
    });
  });

  describe('when filters have been changed', () => {
    it('should remove the page config from storage', () => {
      useLocalStorageFilters.mockImplementation((storageKey, location, history, cb) => {
        const filters = {};
        const searchQuery = 'searchQuery';
        const searchIndex = browseModeOptions.CONTRIBUTORS;

        return [
          filters,
          searchQuery,
          cb,
          applySearch,
          changeSearch,
          resetFilters,
          changeSearchIndex,
          searchIndex,
        ];
      });

      const storageKey = '@folio/inventory/browse.pageConfig';

      renderBrowseInventory();

      BrowseInventoryFilters.mock.calls.at(-1)[0].applyFilters();

      expect(storage.removeItem).toHaveBeenCalledWith(storageKey);

      useLocalStorageFilters.mockRestore();
    });
  });
});
