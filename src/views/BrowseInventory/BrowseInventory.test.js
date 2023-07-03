import '../../../test/jest/__mock__';

import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import { act, screen } from '@folio/jest-config-stripes/testing-library/react';

import { useLocationFilters } from '@folio/stripes-acq-components';

import {
  renderWithIntl,
  translationsProperties,
} from '../../../test/jest/helpers';
import { browseModeOptions } from '../../constants';
import BrowseInventory from './BrowseInventory';
import { SearchModeNavigation } from '../../components';
import { INIT_PAGE_CONFIG } from '../../hooks/useInventoryBrowse';
import {
  useLastSearchTerms,
  useInventoryBrowse,
} from '../../hooks';

const mockGetLastSearch = jest.fn();
const mockGetLastBrowseOffset = jest.fn().mockImplementation(() => INIT_PAGE_CONFIG);
const mockStoreLastBrowse = jest.fn();
const mockStoreLastBrowseOffset = jest.fn();

jest.mock('../../storage');
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
  useLastSearchTerms: jest.fn().mockReturnValue({
    getLastSearch: jest.fn(),
    getLastBrowseOffset: jest.fn(),
    storeLastBrowse: jest.fn(),
    storeLastBrowseOffset: jest.fn(),
  }),
  useInventoryBrowse: jest.fn(() => ({}))
}));

let history;

const renderBrowseInventory = (props = {}, rerender) => renderWithIntl(
  <Router history={history}>
    <BrowseInventory
      {...props}
    />
  </Router>,
  translationsProperties,
  rerender,
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
    history = createMemoryHistory();
    applySearch.mockClear();
    applyFilters.mockClear();
    changeSearch.mockClear();
    resetFilters.mockClear();
    changeSearchIndex.mockClear();
    mockGetLastSearch.mockClear();
    mockGetLastBrowseOffset.mockClear();
    mockStoreLastBrowse.mockClear();
    mockStoreLastBrowseOffset.mockClear();
    useLocationFilters.mockClear().mockReturnValue(getFiltersUtils());
    useLastSearchTerms.mockClear().mockReturnValue({
      getLastSearch: mockGetLastSearch,
      getLastBrowseOffset: mockGetLastBrowseOffset,
      storeLastBrowse: mockStoreLastBrowse,
      storeLastBrowseOffset: mockStoreLastBrowseOffset,
    });
  });

  describe('when the component is mounted', () => {
    it('should take the initial state for pageConfig from the session storage', () => {
      const offset = [3, 'next', 'Aachen, Carlovingian Palace.'];
      mockGetLastBrowseOffset.mockClear().mockImplementation(() => offset);

      renderBrowseInventory();

      expect(mockStoreLastBrowseOffset).toHaveBeenCalledWith(offset);

      mockGetLastBrowseOffset.mockRestore();
    });
  });

  it('should write location.search and offset to the session storage', () => {
    const offset = [4, 'next', 'Aachen, Carlovingian Palace.'];
    const search = '?qindex=title&query=book&sort=title';
    const newSearch = search.replace('book', 'newBook');

    history.push({ search });
    mockGetLastBrowseOffset.mockClear().mockImplementation(() => offset);

    const { rerender } = renderBrowseInventory();

    expect(mockStoreLastBrowse).toHaveBeenCalledWith(search);
    expect(mockStoreLastBrowseOffset).toHaveBeenCalledWith(offset);

    history.push({ search: newSearch });

    renderBrowseInventory({}, rerender);

    expect(mockStoreLastBrowse).toHaveBeenNthCalledWith(2, newSearch);
    expect(mockStoreLastBrowseOffset).toHaveBeenNthCalledWith(2, offset);

    mockGetLastBrowseOffset.mockRestore();
  });

  it('should have search prop in SearchModeNavigation component', () => {
    const search = '?qindex=title&query=book&sort=title';

    mockGetLastSearch.mockClear().mockImplementation(() => search);
    renderBrowseInventory();

    expect(SearchModeNavigation).toHaveBeenCalledWith({ search }, {});
    mockGetLastSearch.mockRestore();
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
    useLocationFilters.mockClear().mockReturnValue(getFiltersUtils({
      searchQuery: 'with asterisks ***',
    }));

    const { container } = renderBrowseInventory();

    await act(async () => userEvent.click(container.querySelector('[data-test-single-search-form-submit="true"]')));

    expect(applySearch).not.toHaveBeenCalled();
  });
});
