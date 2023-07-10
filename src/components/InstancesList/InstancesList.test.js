import React from 'react';
import { Router } from 'react-router-dom';
import { noop } from 'lodash';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import { createMemoryHistory } from 'history';
import {
  act,
  cleanup,
  fireEvent,
  screen,
  within,
} from '@folio/jest-config-stripes/testing-library/react';

import '../../../test/jest/__mock__';

import { StripesContext, ModuleHierarchyProvider } from '@folio/stripes/core';

import renderWithIntl from '../../../test/jest/helpers/renderWithIntl';
import translationsProperties from '../../../test/jest/helpers/translationsProperties';
import { instances as instancesFixture } from '../../../test/fixtures/instances';
import { getFilterConfig } from '../../filterConfig';
import InstancesList from './InstancesList';
import { setItem } from '../../storage';
import { SORTABLE_SEARCH_RESULT_LIST_COLUMNS } from '../../constants';

const updateMock = jest.fn();
const mockQueryReplace = jest.fn();
const mockResultOffsetReplace = jest.fn();
const mockStoreLastSearch = jest.fn();
const mockRecordsReset = jest.fn();
const mockGetLastSearchOffset = jest.fn();
const mockStoreLastSearchOffset = jest.fn();
const mockGetLastSearch = jest.fn();

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

const stripesStub = {
  connect: Component => <Component />,
  hasPerm: () => true,
  hasInterface: () => true,
  logger: { log: noop },
  locale: 'en-US',
  plugins: {},
};
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

let history;

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
      <StripesContext.Provider value={stripesStub}>
        <ModuleHierarchyProvider module="@folio/inventory">
          <InstancesList
            parentResources={resources}
            parentMutator={{
              resultOffset: { replace: mockResultOffsetReplace },
              resultCount: { replace: noop },
              query: { update: updateMock, replace: mockQueryReplace },
              records: { reset: mockRecordsReset },
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
      </StripesContext.Provider>
    </Router>,
    translationsProperties,
    rerender,
  );
};

describe('InstancesList', () => {
  describe('rendering InstancesList with instances segment', () => {
    beforeEach(() => {
      history = createMemoryHistory();
      renderInstancesList({ segment: 'instances' });
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    describe('when the component is mounted', () => {
      it('should write location.search to the session storage', () => {
        const search = '?qindex=title&query=book&sort=title';
        history.push({ search });
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
          const search = '?qindex=title&query=book&sort=title';
          mockStoreLastSearch.mockClear();
          history.push({ search });
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
        cleanup();
        const search = '?qindex=subjects&query=book';

        jest.spyOn(history, 'push');

        renderInstancesList({
          segment: 'instances',
          getLastBrowse: () => search,
        });

        fireEvent.click(screen.getByRole('button', { name: 'Browse' }));

        expect(history.push).toHaveBeenCalledWith(expect.objectContaining({ search }));
      });

      it('should store last opened record id', () => {
        cleanup();
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
      expect(document.querySelectorAll('#pane-results-content .mclRowContainer > [role=row]').length).toEqual(3);
    });

    describe('opening action menu', () => {
      beforeEach(() => {
        fireEvent.change(screen.getByRole('combobox'), {
          target: { value: 'all' }
        });

        userEvent.click(screen.getByRole('button', { name: 'Actions' }));
      });

      it('should disable toggleable columns', () => {
        expect(screen.getByText(/show columns/i)).toBeInTheDocument();
      });

      describe('"New MARC Bib Record" button', () => {
        it('should render', () => {
          expect(screen.getByRole('button', { name: 'New MARC Bib Record' })).toBeInTheDocument();
        });

        it('should redirect to the correct layer', async () => {
          jest.spyOn(history, 'push');

          const button = screen.getByRole('button', { name: 'New MARC Bib Record' });

          fireEvent.click(button);

          expect(history.push).toHaveBeenCalledWith('/inventory/quick-marc/create-bib?');
        });
      });

      describe('hiding contributors column', () => {
        beforeEach(() => {
          userEvent.click(screen.getByTestId('contributors'));
        });

        it('should hide contributors column', () => {
          expect(document.querySelector('#clickable-list-column-contributors')).not.toBeInTheDocument();
        });
      });

      describe('select sort by', () => {
        it('should render menu option', () => {
          expect(screen.getByTestId('menu-section-sort-by')).toBeInTheDocument();
        });

        it('should render select', () => {
          expect(screen.getByTestId('sort-by-selection')).toBeInTheDocument();
        });

        it('should render as many options as defined plus Relevance', () => {
          const options = within(screen.getByTestId('sort-by-selection')).getAllByRole('option');
          expect(options).toHaveLength(Object.keys(SORTABLE_SEARCH_RESULT_LIST_COLUMNS).length + 1);
        });
      });

      describe('select proper sort options', () => {
        it('should select Title as default selected sort option', () => {
          const search = '?segment=instances&sort=title';
          history.push({ search });

          const option = within(screen.getByTestId('menu-section-sort-by')).getByRole('option', { name: 'Title' });
          expect(option.selected).toBeTruthy();
        });

        it('should select Contributors option', () => {
          userEvent.click(screen.getByRole('button', { name: 'Actions' }));
          userEvent.selectOptions(screen.getByTestId('sort-by-selection'), 'contributors');

          const option = within(screen.getByTestId('menu-section-sort-by')).getByRole('option', { name: 'Contributors' });
          expect(option.selected).toBeTruthy();
        });

        it('should select option value "Contributors" after column "Contributors" click', async () => {
          await act(async () => fireEvent.click(document.querySelector('#clickable-list-column-contributors')));

          expect((screen.getByRole('option', { name: 'Contributors' })).selected).toBeTruthy();
        });
      });
    });

    describe('filters pane', () => {
      it('should have selected effective call number option', async () => {
        await act(async () => userEvent.selectOptions(screen.getByLabelText('Search field index'), 'callNumber'));

        expect((screen.getByRole('option', { name: 'Effective call number (item), shelving order' })).selected).toBeTruthy();
      });

      it('should have query in search input', () => {
        userEvent.type(screen.getByRole('searchbox', { name: 'Search' }), 'search query');
        userEvent.click(screen.getAllByRole('button', { name: 'Search' })[1]);

        expect(screen.getByRole('searchbox', { name: 'Search' })).toHaveValue('search query');
      });
    });
  });

  describe('rendering InstancesList with holdings segment', () => {
    it('should show Save Holdings UUIDs button', () => {
      renderInstancesList({ segment: 'holdings' });

      fireEvent.change(screen.getByRole('combobox'), {
        target: { value: 'all' }
      });

      userEvent.click(screen.getByRole('button', { name: 'Actions' }));

      expect(screen.getByRole('button', { name: 'Save holdings UUIDs' })).toBeVisible();
    });
  });
});
