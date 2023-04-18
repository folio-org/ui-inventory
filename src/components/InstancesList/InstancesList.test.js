import React from 'react';
import { Router } from 'react-router-dom';
import { noop } from 'lodash';
import userEvent from '@testing-library/user-event';
import { createMemoryHistory } from 'history';
import {
  act,
  fireEvent,
  screen,
  waitFor,
  cleanup,
} from '@testing-library/react';

import '../../../test/jest/__mock__';

import { StripesContext, ModuleHierarchyProvider } from '@folio/stripes/core';

import renderWithIntl from '../../../test/jest/helpers/renderWithIntl';
import translationsProperties from '../../../test/jest/helpers/translationsProperties';
import { instances as instancesFixture } from '../../../test/fixtures/instances';
import { getFilterConfig } from '../../filterConfig';
import InstancesList from './InstancesList';

const updateMock = jest.fn();
const mockQueryReplace = jest.fn();
const mockResultOffsetReplace = jest.fn();
const mockStoreLastSearch = jest.fn();
const mockRecordsReset = jest.fn();
const mockGetLastSearchOffset = jest.fn();
const mockStoreLastSearchOffset = jest.fn();

jest.mock('../../storage');

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
        expect(mockStoreLastSearch).toHaveBeenCalledWith(search);
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
          expect(mockStoreLastSearch).toHaveBeenCalledWith(search);
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

          expect(mockStoreLastSearchOffset).toHaveBeenCalledWith(offset);
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

          waitFor(() => {
            fireEvent.click(button);
            expect(history.push).toHaveBeenCalledWith('/?layer=create-bib');
          });
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
