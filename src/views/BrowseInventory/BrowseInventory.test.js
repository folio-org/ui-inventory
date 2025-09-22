import '../../../test/jest/__mock__';

import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import { act, screen, fireEvent, waitFor } from '@folio/jest-config-stripes/testing-library/react';

import stripesAcqComponents from '@folio/stripes-acq-components';
import { browseModeOptions, FACETS } from '@folio/stripes-inventory-components';
import { checkIfUserInMemberTenant } from '@folio/stripes/core';

import {
  renderWithIntl,
  translationsProperties,
} from '../../../test/jest/helpers';
import BrowseInventory from './BrowseInventory';
import { SearchModeNavigation } from '../../components';
import { INIT_PAGE_CONFIG } from '../../hooks/useInventoryBrowse';
import {
  useLastSearchTerms,
  useInventoryBrowse,
} from '../../hooks';

const { useLocationFilters } = stripesAcqComponents;

const mockGetLastSearch = jest.fn();
const mockGetLastBrowseOffset = jest.fn().mockImplementation(() => INIT_PAGE_CONFIG);
const mockStoreLastBrowse = jest.fn();
const mockStoreLastBrowseOffset = jest.fn();
const mockFocusPaneTitle = jest.fn();

jest.mock('../../storage');
jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  useLocationFilters: jest.fn(() => ([])),
}));
jest.mock('../../components', () => ({
  BrowseInventoryFilters: jest.fn(() => <>BrowseInventoryFilters</>),
  BrowseResultsPane: jest.fn(({ paneTitleRef }) => {
    paneTitleRef.current = { focus: mockFocusPaneTitle };
    return <>BrowseResultsPane</>;
  }),
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
const clearFilters = jest.fn();
const applyLocationFiltersAsync = jest.fn();
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
  clearFilters,
  applyLocationFiltersAsync,
];

describe('BrowseInventory', () => {
  beforeEach(() => {
    history = createMemoryHistory();
    jest.clearAllMocks();
    useLocationFilters.mockClear().mockReturnValue(getFiltersUtils());
    useLastSearchTerms.mockClear().mockReturnValue({
      getLastSearch: mockGetLastSearch,
      getLastBrowseOffset: mockGetLastBrowseOffset,
      storeLastBrowse: mockStoreLastBrowse,
      storeLastBrowseOffset: mockStoreLastBrowseOffset,
    });
    useInventoryBrowse.mockReturnValue({
      data: [],
      isFetched: false,
      isFetching: false,
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

  describe('when browse mode option was changed', () => {
    it('should call "changeSearchIndex" ', async () => {
      renderBrowseInventory();

      fireEvent.change(screen.getByRole('combobox'), { target: { value: 'contributors' } });
      expect(changeSearchIndex).toHaveBeenCalled();
    });

    describe('when the new option is one of Call Number Browse options', () => {
      describe('and a user is in a member tenant', () => {
        it('should apply a default value of a current tenant in Held By facet', () => {
          renderBrowseInventory();

          fireEvent.change(screen.getByRole('combobox'), { target: { value: 'callNumbers' } });

          waitFor(() => expect(applyFilters).toHaveBeenCalledWith(FACETS.CALL_NUMBERS_HELD_BY, ['diku']));
        });
      });

      describe('and a user is not in a member tenant', () => {
        it('should not apply a default value of a current tenant in Held By facet', () => {
          checkIfUserInMemberTenant.mockReturnValue(false);
          renderBrowseInventory();

          fireEvent.change(screen.getByRole('combobox'), { target: { value: 'callNumbers' } });

          waitFor(() => expect(applyFilters).not.toHaveBeenCalledWith(FACETS.CALL_NUMBERS_HELD_BY, ['diku']));
        });
      });
    });

    describe('when the new option is not one of Call Number Browse options', () => {
      describe('and a user is in a member tenant', () => {
        it('should not apply a default value of a current tenant in Held By facet', () => {
          renderBrowseInventory();

          fireEvent.change(screen.getByRole('combobox'), { target: { value: 'contributors' } });

          waitFor(() => expect(applyFilters).not.toHaveBeenCalledWith(FACETS.CALL_NUMBERS_HELD_BY, ['diku']));
        });
      });

      describe('and a user is not in a member tenant', () => {
        it('should not apply a default value of a current tenant in Held By facet', () => {
          checkIfUserInMemberTenant.mockReturnValue(false);
          renderBrowseInventory();

          fireEvent.change(screen.getByRole('combobox'), { target: { value: 'contributors' } });

          waitFor(() => expect(applyFilters).not.toHaveBeenCalledWith(FACETS.CALL_NUMBERS_HELD_BY, ['diku']));
        });
      });
    });
  });

  it('should call "changeSearch" when search query was changed', async () => {
    const { container } = renderBrowseInventory();

    await act(async () => userEvent.type(screen.getByRole('textbox'), 'newQuery'));
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

  describe('when changing search term', () => {
    it('should not be trimmed', async () => {
      useLocationFilters.mockClear().mockReturnValue(getFiltersUtils({
        searchQuery: '',
      }));

      const searchTerm = ' test ';

      renderBrowseInventory();

      await act(async () => userEvent.type(screen.getByRole('textbox'), searchTerm));

      expect(screen.getByRole('textbox').value).toBe(searchTerm);
    });
  });

  describe('when a new search query is submitted', () => {
    it('should focus pane title', async () => {
      const { getByRole } = renderBrowseInventory();

      userEvent.type(getByRole('textbox'), 'newQuery');
      userEvent.click(getByRole('button', { name: 'Search' }));

      await waitFor(() => {
        expect(mockFocusPaneTitle).toHaveBeenCalled();
      });
    });

    it('should remove the background from the previously selected record', async () => {
      const mockDeleteItemToView = jest.fn();

      jest.spyOn(stripesAcqComponents, 'useItemToView').mockReturnValueOnce({
        deleteItemToView: mockDeleteItemToView,
      });

      const { getByRole } = renderBrowseInventory();

      userEvent.type(getByRole('textbox'), 'newQuery');
      userEvent.click(getByRole('button', { name: 'Search' }));

      await waitFor(() => {
        expect(mockDeleteItemToView).toHaveBeenCalled();
      });
    });
  });

  describe('when page is mounted without predefined search', () => {
    it('should focus search option once', async () => {
      const mockSearchOptionFocus = jest.fn();

      jest.spyOn(stripesAcqComponents, 'SingleSearchForm')
        .mockImplementation(({ indexRef }) => {
          indexRef.current = { focus: mockSearchOptionFocus };
          return <>SingleSearchForm</>;
        });

      const { rerender } = renderBrowseInventory();

      useInventoryBrowse.mockReturnValue({
        isFetching: false,
      });

      renderBrowseInventory({}, rerender);

      expect(mockSearchOptionFocus).toHaveBeenCalledTimes(1);

      jest.spyOn(stripesAcqComponents, 'SingleSearchForm').mockRestore();
    });
  });

  describe('when page is mounted and data of last search is loaded', () => {
    it('should focus search option', async () => {
      const mockSearchOptionFocus = jest.fn();

      jest.spyOn(stripesAcqComponents, 'SingleSearchForm')
        .mockImplementation(({ indexRef }) => {
          indexRef.current = { focus: mockSearchOptionFocus };
          return <>SingleSearchForm</>;
        });

      history.push({ search: '?qindex=browseSubjects&query=book' });

      useInventoryBrowse.mockReturnValue({
        isFetched: false,
        isFetching: true,
      });

      const { rerender } = renderBrowseInventory();

      expect(mockSearchOptionFocus).not.toHaveBeenCalled();

      useInventoryBrowse.mockReturnValue({
        isFetched: true,
        isFetching: true,
      });

      renderBrowseInventory({}, rerender);

      expect(mockSearchOptionFocus).not.toHaveBeenCalled();

      useInventoryBrowse.mockReturnValue({
        isFetched: true,
        isFetching: false,
      });

      renderBrowseInventory({}, rerender);

      expect(mockSearchOptionFocus).toHaveBeenCalledTimes(1);

      jest.spyOn(stripesAcqComponents, 'SingleSearchForm').mockRestore();
    });
  });

  it('should display search indexes', () => {
    const { getByText, getAllByText } = renderBrowseInventory();

    expect(getByText('Call numbers (all)')).toBeDefined();
    expect(getAllByText('Dewey Decimal classification')[0]).toBeDefined();
    expect(getAllByText('Library of Congress classification')[0]).toBeDefined();
    expect(getByText('National Library of Medicine classification')).toBeDefined();
    expect(getByText('Classification (all)')).toBeDefined();
    expect(getAllByText('Dewey Decimal classification')[1]).toBeDefined();
    expect(getAllByText('Library of Congress classification')[1]).toBeDefined();
    expect(getByText('Contributors')).toBeDefined();
    expect(getByText('Subjects')).toBeDefined();
  });

  describe('when user clicks on Reset all', () => {
    it('should move focus to query input', () => {
      renderBrowseInventory();

      fireEvent.change(screen.getByRole('combobox'), { target: { value: 'contributors' } });
      userEvent.type(screen.getByRole('textbox'), 'test');
      fireEvent.click(screen.getByRole('button', { name: 'Search' }));
      fireEvent.click(screen.getByRole('button', { name: 'Reset all' }));

      expect(screen.getByRole('textbox')).toHaveFocus();
    });
  });

  describe('when search option is changed', () => {
    it('should reset itemToView to not highlight the first row', () => {
      const mockDeleteItemToView = jest.fn();

      jest.spyOn(stripesAcqComponents, 'useItemToView').mockReturnValueOnce({
        deleteItemToView: mockDeleteItemToView,
      });

      renderBrowseInventory();

      fireEvent.change(screen.getByRole('combobox'), { target: { value: 'contributors' } });
      expect(mockDeleteItemToView).toHaveBeenCalled();
    });

    it('should not reset query value', () => {
      renderBrowseInventory();

      fireEvent.change(screen.getByRole('combobox'), { target: { value: 'contributors' } });
      expect(screen.getByRole('textbox')).toHaveValue('searchQuery');
    });
  });
});
