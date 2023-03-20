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
} from '@testing-library/react';

import '../../../test/jest/__mock__';

import { StripesContext } from '@folio/stripes-core/src/StripesContext';
import { ModuleHierarchyProvider } from '@folio/stripes-core/src/components/ModuleHierarchy';

import renderWithIntl from '../../../test/jest/helpers/renderWithIntl';
import translationsProperties from '../../../test/jest/helpers/translationsProperties';
import { instances as instancesFixture } from '../../../test/fixtures/instances';
import { getFilterConfig } from '../../filterConfig';
import InstancesList from './InstancesList';
import * as storage from '../../storage';

const updateMock = jest.fn();
const mockQueryReplace = jest.fn();
const mockResultOffsetReplace = jest.fn();
const mockStoredOffset = 100;
const mockStoredParams = {
  qindex: 'title',
  query: 'a',
  sort: 'title',
};
const resultOffset = { replace: mockResultOffsetReplace };
const mockGetItem = (name = '') => {
  if (name.includes('/search.params')) {
    return mockStoredParams;
  }

  if (name.includes('/search.resultOffset')) {
    return mockStoredOffset;
  }

  return undefined;
};

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

const paramsKey = '@folio/inventory/search.params';
const offsetKey = '@folio/inventory/search.resultOffset';

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
              resultOffset,
              resultCount: { replace: noop },
              query: { update: updateMock, replace: mockQueryReplace },
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
      describe('and browse result was selected', () => {
        it('should write URL parameters to storage and reset offset', () => {
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

          expect(storage.setItem).toHaveBeenNthCalledWith(1, paramsKey, params, { toLocalStorage: true });
          expect(storage.setItem).toHaveBeenNthCalledWith(2, offsetKey, 0, { toLocalStorage: true });
        });
      });

      describe('and browse result was not selected', () => {
        it('should update location and replace resultOffset', () => {
          mockResultOffsetReplace.mockClear();
          jest.spyOn(history, 'replace');
          storage.getItem.mockImplementation(mockGetItem);

          renderInstancesList({ segment: 'instances' });

          expect(history.replace).toHaveBeenCalledWith('/?qindex=title&query=a&sort=title');
          expect(mockResultOffsetReplace).toHaveBeenCalledWith(mockStoredOffset);

          storage.getItem.mockRestore();
        });

        it('should not update location and resultOffset', () => {
          jest.spyOn(history, 'replace');
          mockResultOffsetReplace.mockClear();

          renderInstancesList({ segment: 'instances' });

          expect(history.replace).not.toHaveBeenCalled();
          expect(mockResultOffsetReplace).not.toHaveBeenCalled();
        });
      });
    });

    describe('when the component is updated', () => {
      describe('and previously the user returned from the "Browse" search by clicking the "Search" tab', () => {
        it('should remove the selectedSearchMode parameter', () => {
          mockQueryReplace.mockClear();

          const newParentResources = {
            ...resources,
            query: { ...query, selectedSearchMode: 'true' },
          };

          const { rerender } = renderInstancesList({
            segment: 'instances',
            parentResources: newParentResources,
          });

          renderInstancesList({
            segment: 'instances',
            parentResources: {
              ...newParentResources,
              resultOffset: 100,
            },
          }, rerender);

          expect(mockQueryReplace).toHaveBeenCalledWith({ selectedSearchMode: false });
        });
      });

      describe('and location.search has been changed', () => {
        it('should write parameters to storage', () => {
          history.push({ search: '?qindex=title&query=book&sort=title' });
          const paramsToStore = { qindex: 'title', query: 'book', sort: 'title' };
          expect(storage.setItem).toHaveBeenCalledWith(paramsKey, paramsToStore, { toLocalStorage: true });
        });
      });

      describe('and offset has been changed', () => {
        it('should write offset to storage', () => {
          const offset = 100;
          const { rerender } = renderInstancesList({ segment: 'instances' });

          renderInstancesList({
            segment: 'instances',
            parentResources: {
              ...resources,
              resultOffset: offset,
            },
          }, rerender);

          expect(storage.setItem).toHaveBeenCalledWith(offsetKey, offset, { toLocalStorage: true });
        });
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

          await waitFor(() => {
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
