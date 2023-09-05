import React from 'react';
import { Router } from 'react-router-dom';
import { noop } from 'lodash';
import { createMemoryHistory } from 'history';
import {
  act,
  fireEvent,
  screen,
  waitFor,
  within,
} from '@folio/jest-config-stripes/testing-library/react';

import '../../../test/jest/__mock__';

import { ModuleHierarchyProvider } from '@folio/stripes/core';

import renderWithIntl from '../../../test/jest/helpers/renderWithIntl';
import translationsProperties from '../../../test/jest/helpers/translationsProperties';
import { instances as instancesFixture } from '../../../test/fixtures/instances';
import { getFilterConfig } from '../../filterConfig';
import InstancesList from './InstancesList';
import { setItem } from '../../storage';
import { SORTABLE_SEARCH_RESULT_LIST_COLUMNS } from '../../constants';
import * as utils from '../../utils';

const updateMock = jest.fn();
const mockQueryReplace = jest.fn();
const mockResultOffsetReplace = jest.fn();
const mockStoreLastSearch = jest.fn();
const mockRecordsReset = jest.fn();
const mockGetLastSearchOffset = jest.fn();
const mockStoreLastSearchOffset = jest.fn();
const mockGetLastSearch = jest.fn();
const mockItemsByQuery = jest.fn();
const spyOnIsUserInConsortiumMode = jest.spyOn(utils, 'isUserInConsortiumMode');
const spyOnCheckIfUserInCentralTenant = jest.spyOn(require('@folio/stripes/core'), 'checkIfUserInCentralTenant');

jest.mock('../../storage', () => ({
  ...jest.requireActual('../../storage'),
  setItem: jest.fn(),
}));

jest.mock('../../hooks', () => ({
  ...jest.requireActual('../../hooks'),
  useLastSearchTerms: () => ({
    getLastSearch: mockGetLastSearch,
  }),
}));

const data = {
  contributorTypes: [],
  contributorNameTypes: [],
  instanceTypes: [],
  locations: [],
  instanceFormats: [],
  modesOfIssuance: [],
  natureOfContentTerms: [],
  tagsRecords: [],
  facets: [],
};
const query = {
  query: '',
  sort: 'title',
};

const resources = {
  query,
  records: {
    hasLoaded: true,
    resource: 'records',
    records: instancesFixture,
    other: { totalRecords: instancesFixture.length },
    isPending: false,
  },
  facets: {
    hasLoaded: true,
    resource: 'facets',
    records: [],
    other: { totalRecords: 0 }
  },
  resultCount: instancesFixture.length,
  resultOffset: 0,
};

let history = createMemoryHistory();

const openActionMenu = () => {
  fireEvent.change(screen.getByRole('combobox', { name: /search field index/i }), {
    target: { value: 'all' }
  });
  fireEvent.click(screen.getByRole('button', { name: 'Actions' }));
};

const renderInstancesList = ({
  segment,
  ...rest
}, rerender) => {
  const {
    indexes,
    indexesES,
    renderer,
  } = getFilterConfig(segment);

  return renderWithIntl(
    <Router history={history}>
      <ModuleHierarchyProvider module="@folio/inventory">
        <InstancesList
          parentResources={resources}
          parentMutator={{
            resultOffset: { replace: mockResultOffsetReplace },
            resultCount: { replace: noop },
            query: { update: updateMock, replace: mockQueryReplace },
            records: { reset: mockRecordsReset },
            itemsByQuery: { reset: noop, GET: mockItemsByQuery },
          }}
          data={{
            ...data,
            query
          }}
          onSelectRow={noop}
          renderFilters={renderer({
            ...data,
            query,
            parentResources: resources,
          })}
          segment={segment}
          searchableIndexes={indexes}
          searchableIndexesES={indexesES}
          fetchFacets={noop}
          getLastBrowse={jest.fn()}
          getLastSearchOffset={mockGetLastSearchOffset}
          storeLastSearch={mockStoreLastSearch}
          storeLastSearchOffset={mockStoreLastSearchOffset}
          storeLastSegment={noop}
          {...rest}
        />
      </ModuleHierarchyProvider>
    </Router>,
    translationsProperties,
    rerender,
  );
};

describe('InstancesList', () => {
  describe('rendering InstancesList with instances segment', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    describe('when the component is mounted', () => {
      it('should write location.search to the session storage', () => {
        renderInstancesList({ segment: 'instances' });

        const search = '?qindex=title&query=book&sort=title';
        act(() => { history.push({ search }); });
        expect(mockStoreLastSearch).toHaveBeenCalledWith(search, 'instances');
      });

      describe('and browse result was selected', () => {
        it('should reset offset', () => {
          mockResultOffsetReplace.mockClear();
          const params = {
            selectedBrowseResult: 'true',
            filters: 'searchContributors.2b94c631-fca9-4892-a730-03ee529ffe2a',
            qindex: 'contributor',
            query: 'Abdill, Aasha M.,',
          };

          renderInstancesList({
            segment: 'instances',
            getParams: () => params,
          });

          expect(mockResultOffsetReplace).toHaveBeenCalledWith(0);
        });
      });

      describe('and browse result was not selected', () => {
        it('should replace resultOffset', () => {
          mockResultOffsetReplace.mockClear();

          renderInstancesList({
            segment: 'instances',
            getLastSearchOffset: () => 100,
          });

          expect(mockResultOffsetReplace).toHaveBeenCalledWith(100);
        });
      });
    });

    describe('when the component is updated', () => {
      describe('and location.search has been changed', () => {
        it('should write location.search to the session storage', () => {
          renderInstancesList({ segment: 'instances' });

          const search = '?qindex=title&query=book&sort=title';
          act(() => { history.push({ search }); });

          expect(mockStoreLastSearch).toHaveBeenCalledWith(search, 'instances');
        });
      });

      describe('and offset has been changed', () => {
        it('should write offset to storage', () => {
          const offset = 100;
          mockStoreLastSearchOffset.mockClear();

          const { rerender } = renderInstancesList({ segment: 'instances' });

          renderInstancesList({
            segment: 'instances',
            parentResources: {
              ...resources,
              resultOffset: offset,
            },
          }, rerender);

          expect(mockStoreLastSearchOffset).toHaveBeenCalledWith(offset, 'instances');
        });
      });
    });

    describe('when the component is unmounted', () => {
      it('should reset records', () => {
        mockRecordsReset.mockClear();

        const { unmount } = renderInstancesList({ segment: 'instances' });
        unmount();
        expect(mockRecordsReset).toHaveBeenCalled();
      });
    });

    describe('when clicking on the `Browse` tab', () => {
      it('should pass the correct search by clicking on the `Browse` tab', () => {
        const search = '?qindex=subject&query=book';

        jest.spyOn(history, 'push');

        renderInstancesList({
          segment: 'instances',
          getLastBrowse: () => search,
        });

        fireEvent.click(screen.getByRole('button', { name: 'Browse' }));

        expect(history.push).toHaveBeenCalledWith(expect.objectContaining({ search }));
      });

      it('should store last opened record id', () => {
        history = createMemoryHistory({ initialEntries: [{
          pathname: '/inventory/view/test-id',
        }] });

        renderInstancesList({
          segment: 'instances',
        });

        fireEvent.click(screen.getByRole('button', { name: 'Browse' }));

        expect(setItem).toHaveBeenCalledWith('@folio/inventory.instances.lastOpenRecord', 'test-id');
      });
    });

    it('should have proper list results size', () => {
      renderInstancesList({ segment: 'instances' });

      expect(document.querySelectorAll('#pane-results-content .mclRowContainer > [role=row]').length).toEqual(4);
    });

    describe('opening action menu', () => {
      it('should disable toggleable columns', () => {
        renderInstancesList({ segment: 'instances' });
        openActionMenu();

        expect(screen.getByText(/show columns/i)).toBeInTheDocument();
      });

      describe('"New record" button', () => {
        describe('for non-consortial tenant', () => {
          it('should display the default "New" menu option', () => {
            spyOnIsUserInConsortiumMode.mockReturnValue(false);

            renderInstancesList({ segment: 'instances' });
            openActionMenu();

            expect(screen.getByRole('button', { name: 'New' })).toBeInTheDocument();
          });
        });

        describe('for a Consortial central tenant', () => {
          it('should display "New shared record" menu option', () => {
            spyOnIsUserInConsortiumMode.mockReturnValue(true);
            spyOnCheckIfUserInCentralTenant.mockReturnValue(true);

            renderInstancesList({ segment: 'instances' });
            openActionMenu();

            expect(screen.getByRole('button', { name: 'New shared record' })).toBeInTheDocument();
          });
        });

        describe('for a Member library tenant', () => {
          it('should display "New local record" menu option', () => {
            spyOnIsUserInConsortiumMode.mockReturnValue(true);
            spyOnCheckIfUserInCentralTenant.mockReturnValue(false);

            renderInstancesList({ segment: 'instances' });
            openActionMenu();

            expect(screen.getByRole('button', { name: 'New local record' })).toBeInTheDocument();
          });
        });
      });

      describe('"New MARC Bib Record" button', () => {
        it('should render', () => {
          renderInstancesList({ segment: 'instances' });
          openActionMenu();

          expect(screen.getByRole('button', { name: 'New MARC Bib Record' })).toBeInTheDocument();
        });

        it('should redirect to the correct layer', async () => {
          jest.spyOn(history, 'push');
          renderInstancesList({ segment: 'instances' });
          openActionMenu();

          const button = screen.getByRole('button', { name: 'New MARC Bib Record' });

          fireEvent.click(button);

          expect(history.push).toHaveBeenCalledWith('/inventory/quick-marc/create-bib?');
        });
      });

      describe('hiding contributors column', () => {
        it('should hide contributors column', () => {
          renderInstancesList({ segment: 'instances' });
          fireEvent.click(screen.getByTestId('contributors'));

          expect(document.querySelector('#clickable-list-column-contributors')).not.toBeInTheDocument();
        });
      });

      describe('select sort by', () => {
        it('should render menu option', () => {
          renderInstancesList({ segment: 'instances' });

          expect(screen.getByTestId('menu-section-sort-by')).toBeInTheDocument();
        });

        it('should render select', () => {
          renderInstancesList({ segment: 'instances' });

          expect(screen.getByTestId('sort-by-selection')).toBeInTheDocument();
        });

        it('should render as many options as defined', () => {
          renderInstancesList({ segment: 'instances' });
          openActionMenu();

          const options = within(screen.getByTestId('sort-by-selection')).getAllByRole('option');

          expect(options).toHaveLength(Object.keys(SORTABLE_SEARCH_RESULT_LIST_COLUMNS).length);
        });
      });

      describe('select proper sort options', () => {
        it('should select Title as default selected sort option', () => {
          renderInstancesList({ segment: 'instances' });

          const search = '?segment=instances&sort=title';
          act(() => { history.push({ search }); });
          openActionMenu();

          const option = within(screen.getByTestId('menu-section-sort-by')).getByRole('option', { name: 'Title' });
          expect(option.selected).toBeTruthy();
        });

        it('should select Contributors option', () => {
          renderInstancesList({ segment: 'instances' });

          openActionMenu();
          fireEvent.change(screen.getByTestId('sort-by-selection'), { target: { value: 'contributors' } });
          openActionMenu();

          const option = within(screen.getByTestId('menu-section-sort-by')).getByRole('option', { name: 'Contributors' });
          expect(option.selected).toBeTruthy();
        });

        it('should select option value "Contributors" after column "Contributors" click', async () => {
          renderInstancesList({ segment: 'instances' });

          await act(async () => fireEvent.click(document.querySelector('#clickable-list-column-contributors')));
          openActionMenu();

          expect((screen.getByRole('option', { name: 'Contributors' })).selected).toBeTruthy();
        });

        it('should select Relevance selected sort option when in search query', () => {
          renderInstancesList({ segment: 'instances' });

          const search = '?segment=instances&sort=relevance';
          act(() => { history.push({ search }); });
          openActionMenu();

          const option = within(screen.getByTestId('menu-section-sort-by')).getByRole('option', { name: 'Relevance' });
          expect(option.selected).toBeTruthy();
        });

        it('should set aria-sort to none on sorted columns after query sort by Relevance', () => {
          renderInstancesList({
            segment: 'instances',
            parentResources: {
              ...resources,
              query: {
                query: '',
                sort: 'relevance',
              }
            },
          });

          const sortCols = document.querySelectorAll('[aria-sort="ascending"], [aria-sort="descending"]');
          expect(sortCols).toHaveLength(0);
        });
      });
    });

    describe('filters pane', () => {
      it('should have selected effective call number option', async () => {
        renderInstancesList({ segment: 'instances' });

        await act(async () => fireEvent.change(screen.getByLabelText('Search field index'), { target: { value: 'callNumber' } }));

        expect((screen.getByRole('option', { name: 'Effective call number (item), shelving order' })).selected).toBeTruthy();
      });

      it('should have query in search input', () => {
        renderInstancesList({ segment: 'instances' });

        fireEvent.change(screen.getByRole('searchbox', { name: 'Search' }), { target: { value: 'search query' } });
        fireEvent.click(screen.getAllByRole('button', { name: 'Search' })[1]);

        expect(screen.getByRole('searchbox', { name: 'Search' })).toHaveValue('search query');
      });
    });

    describe('when using advanced search', () => {
      it('should set advanced search query in search input', () => {
        renderInstancesList({ segment: 'instances' });

        fireEvent.click(screen.getByRole('button', { name: 'Advanced search' }));
        fireEvent.change(screen.getAllByRole('textbox', { name: 'Search for' })[0], {
          target: { value: 'test' }
        });

        const advancedSearchSubmit = screen.getAllByRole('button', { name: 'Search' })[0];
        fireEvent.click(advancedSearchSubmit);

        expect(screen.getAllByLabelText('Search')[0].value).toEqual('keyword containsAll test');
      });

      describe('when current search option is advancedSearch and user clicks Search in the advanced search modal', () => {
        it('should not fire onChangeIndex functionality', async () => {
          history = createMemoryHistory({ initialEntries: [{
            search: '?qindex=advancedSearch&query=test',
          }] });

          renderInstancesList({ segment: 'instances' });

          fireEvent.click(screen.getByRole('button', { name: 'Advanced search' }));
          fireEvent.change(screen.getAllByRole('textbox', { name: 'Search for' })[0], {
            target: { value: 'test2' }
          });
          const advancedSearchSubmit = screen.getAllByRole('button', { name: 'Search' })[0];

          await act(async () => { fireEvent.click(advancedSearchSubmit); });

          expect(updateMock).not.toHaveBeenCalled();
        });
      });

      describe('when current search option is advancedSearch and user clicks Search in the advanced search modal', () => {
        it('should not reset filters', async () => {
          history = createMemoryHistory({ initialEntries: [{
            search: '?qindex=advancedSearch&query=keyword containsAll test&filters=language.eng',
          }] });
          history.push = jest.fn();

          renderInstancesList({ segment: 'instances' });

          fireEvent.click(screen.getByRole('button', { name: 'Advanced search' }));
          fireEvent.change(screen.getAllByRole('textbox', { name: 'Search for' })[0], {
            target: { value: 'test2' }
          });
          const advancedSearchSubmit = screen.getAllByRole('button', { name: 'Search' })[0];

          await act(async () => { fireEvent.click(advancedSearchSubmit); });

          await waitFor(() => { expect(history.push).toHaveBeenCalledWith(
            '/?filters=language.eng&qindex=advancedSearch&query=keyword%20containsAll%20test2'
          ); })
        });
      });

      describe('when current search option is not the advancedSearch and user clicks Search in the advanced search modal', () => {
        it('should reset filters', async () => {
          history = createMemoryHistory({ initialEntries: [{
            search: '?qindex=title&query=test&filters=language.eng',
          }] });
          history.push = jest.fn();

          renderInstancesList({ segment: 'instances' });

          fireEvent.click(screen.getByRole('button', { name: 'Advanced search' }));
          fireEvent.change(screen.getAllByRole('textbox', { name: 'Search for' })[0], {
            target: { value: 'test2' }
          });
          const advancedSearchSubmit = screen.getAllByRole('button', { name: 'Search' })[0];

          await act(async () => { fireEvent.click(advancedSearchSubmit); });

          await waitFor(() => {
            expect(history.push).toHaveBeenCalledWith('/?qindex=advancedSearch&query=title%20containsAll%20test2');
          })
        });
      });
    });
  });

  describe('rendering InstancesList with holdings segment', () => {
    it('should show Save Holdings UUIDs button', () => {
      renderInstancesList({ segment: 'holdings' });

      fireEvent.change(screen.getByRole('combobox'), {
        target: { value: 'all' }
      });

      fireEvent.click(screen.getByRole('button', { name: 'Actions' }));

      expect(screen.getByRole('button', { name: 'Save holdings UUIDs' })).toBeVisible();
    });
  });

  describe('rendering InstancesList with Item segment', () => {
    [
      { qindex: 'items.barcode', query: '1234567(89)', option: 'barcode' },
      { qindex: 'isbn', query: '1234567(89)', option: 'isbn' },
      { qindex: 'issn', query: '1234567(89)', option: 'issn' },
      { qindex: 'itemHrid', query: '1234567(89)', option: 'hrid' },
      { qindex: 'iid', query: '1234567(89)', option: 'id' },
    ].forEach(({ qindex, query: _query, option }) => {
      describe('when open item view', () => {
        it(`should enclose the ${option} query in quotes`, async () => {
          renderInstancesList({
            segment: 'items',
            parentResources: {
              ...resources,
              query: {
                ...query,
                qindex,
                query: _query,
              },
            },
          });

          await act(async () => fireEvent.change(screen.getByLabelText('Search field index'), { target: { value: qindex } }));

          fireEvent.change(screen.getByRole('searchbox', { name: 'Search' }), { target: { value: _query } });
          fireEvent.click(screen.getAllByRole('button', { name: 'Search' })[1]);

          const row = screen.getAllByText('ABA Journal')[0];
          fireEvent.click(row);

          expect(mockItemsByQuery).toHaveBeenCalledWith({
            params: {
              query: `${option}=="${_query}"`,
            },
          });
        });
      });
    });
  });
});
