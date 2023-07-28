/* eslint-disable jsx-a11y/no-redundant-roles */
/* eslint-disable react/button-has-type */
import React from 'react';
import { Router } from 'react-router-dom';
import { noop } from 'lodash';
import userEvent from '@testing-library/user-event';
import { createMemoryHistory } from 'history';
import {
  screen
} from '@testing-library/react';

import '../../../test/jest/__mock__/stripesConfig.mock';
import '../../../test/jest/__mock__/currencyData.mock';
import '../../../test/jest/__mock__/documentCreateRange.mock';
import '../../../test/jest/__mock__/InstancePlugin.mock';
import '../../../test/jest/__mock__/stripesIcon.mock';
import '../../../test/jest/__mock__/stripesCore.mock';
import '../../../test/jest/__mock__/matchMedia.mock';
import '../../../test/jest/__mock__/quickMarc.mock';
import '../../../test/jest/__mock__/reactBeautifulDnd.mock';
import { StripesContext } from '@folio/stripes-core/src/StripesContext';
import { ModuleHierarchyProvider } from '@folio/stripes-core/src/components/ModuleHierarchy';
import { CalloutContext } from '@folio/stripes-core';
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

jest.useFakeTimers();
jest.mock('@folio/stripes-util');
jest.mock('file-saver');
jest.mock('../../storage');
jest.mock('../SearchModeNavigation', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(({ search }) => {
    return (
      <button type="button" onClick={search}>
        Save Search
      </button>
    );
  }),
}));
jest.mock('../FilterNavigation', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(({ onChange }) => {
    return (
      <button type="button" onClick={onChange}>
        Save Filter
      </button>
    );
  }),
}));
jest.mock('../../utils', () => ({
  ...jest.requireActual('../../utils'),
  isTestEnv: jest.fn().mockReturnValue(false),
}));
jest.mock(
  '@folio/stripes/smart-components',
  () => ({
    ...jest.requireActual('@folio/stripes/smart-components'),
    SearchAndSort: jest.fn().mockImplementation((props) => {
      return (
        <div data-testid="search-and-sort">
          <button
            role="searchbox"
            name="Search"
            aria-label="Search"
            disabled={!props.searchTerm}
            data-test-search-and-sort-submit
          >
            {props.searchFieldButtonLabel}
          </button>
          {props.actionMenu({ onToggle: jest.fn() })}
          <button role="button" onClick={props.onCreate}>
            Call Create
          </button>
          <button role="button" onClick={props.onSelectRow}>
            Call Row
          </button>
          <button role="button" onClick={props.onChangeIndex}>
            Call Index
          </button>
          <button role="button" onClick={props.getCellClass}>
            Call Cell
          </button>
          <button role="button" onClick={props.renderNavigation}>
            Call Navigate
          </button>
          {props.resultsFormatter.select({ id: 1, rowData: [] })}
          {props.resultsFormatter.title({
            title: 'formatter Title',
            discoverySuppress: true,
            isBoundWith: true,
            staffSuppress: true,
            id: 1,
          })}
          {props.resultsFormatter.relation(1)}
          {props.resultsFormatter.publishers(1)}
          {props.resultsFormatter.contributors(1)}
          {props.resultsFormatter['publication date']({ publication: [] })}
          <button
            role="button"
            onClick={() => props.onFilterChange({ name: '', values: '' })}
          >
            Call Filter
          </button>
          <button role="button" onClick={props.onResetAll}>
            Call Reset
          </button>
          <button
            role="button"
            onClick={() => props.detailProps.onCopy({
              precedingTitles: [{}],
              succeedingTitles: [{}],
              childInstances: [{}],
              parentInstances: [{}],
            })
            }
          >
            Call Copy
          </button>
          <button role="button" onClick={props.onCreate}>
            Call Create
          </button>
          <button role="button" onClick={props.actionMenu}>
            Call Action
          </button>
          <button role="button" onClick={props.onSubmitSearch}>
            Call Submit
          </button>
          <button role="button" onClick={props.resultsOnMarkPosition}>
            Call Result
          </button>
          <button role="button" onClick={props.resultsOnResetMarkedPosition}>
            Call ResultMark
          </button>
          <button role="button">Save holdings UUIDs</button>
          <button
            role="button"
            name="Search"
            aria-label="Search"
            data-test-search-and-sort-submit
          >
            {props.searchFieldButtonLabel}
          </button>
          <select
            id="searchFieldIndex"
            name="Search field index"
            value={props.searchFieldIndex}
            onChange={props.handleSearchFieldIndexChange}
          >
            <option value="">Select a search field index</option>
            <option value="callNumber">Call number</option>
            <option value="title">Title</option>
            <option value="author">Author</option>
          </select>
        </div>
      );
    }),
    useRemoteStorageMappings: () => {
      return {
        'holdings-id-1': {
          id: 'holdings-id-1',
          name: 'Storage A',
          description: 'Storage A description',
        },
        'holdings-id-2': {
          id: 'holdings-id-2',
          name: 'Storage B',
          description: 'Storage B description',
        },
      };
    },
  }),
  { virtual: true }
);

jest.mock('../SelectedRecordsModal', () => ({
  __esModule: true,
  default: jest
    .fn()
    .mockImplementation(
      ({ onSave, onCancel }) => {
        return (
          <>
            <button type="button" onClick={onSave}>
              Save Model
            </button>

            <button type="button" onClick={onCancel}>
              Cancel Model
            </button>
          </>
        );
      }
    ),
}));

jest.mock('../ImportRecordModal', () => ({
  __esModule: true,
  default: jest
    .fn()
    .mockImplementation(
      ({ handleSubmit, handleCancel }) => {
        return (
          <>
            <button type="button" onClick={handleSubmit}>
              Save Import
            </button>

            <button type="button" onClick={handleCancel}>
              Cancel Import
            </button>
          </>
        );
      }
    ),
}));

const stripesStub = {
  connect: (Component) => <Component />,
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
  query: true,
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
    other: { totalRecords: 0 },
  },
  resultCount: instancesFixture.length,
  resultOffset: 0,
};

let history;

const renderInstancesList = ({ segment, ...rest }, rerender) => {
  const { indexes, indexesES, renderer } = getFilterConfig(segment);

  return renderWithIntl(
    <Router history={history}>
      <StripesContext.Provider value={stripesStub}>
        <CalloutContext.Provider
          value={{ sendCallout: jest.fn(), removeCallout: jest.fn() }}
        >
          <ModuleHierarchyProvider module="@folio/inventory">
            <InstancesList
              parentResources={resources}
              parentMutator={{
                resultOffset: { replace: mockResultOffsetReplace },
                resultCount: { replace: noop },
                recordsToExportIDs: { reset: jest.fn() },
                itemsByQuery: { reset: jest.fn(), GET: jest.fn() },
                holdingsToExportIDs: { reset: jest.fn() },
                query: { update: updateMock, replace: mockQueryReplace },
                records: {
                  reset: mockRecordsReset,
                  POST: jest.fn().mockReturnValue(Promise.resolve(true)),
                },
              }}
              data={{
                ...data,
                query,
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
        </CalloutContext.Provider>
      </StripesContext.Provider>
    </Router>,
    translationsProperties,
    rerender
  );
};

describe('InstancesList', () => {
  describe('rendering InstancesList with instances segment', () => {
    beforeEach(() => {
      jest.advanceTimersByTime(1000);
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

      describe('browse result was selected', () => {
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

      describe('browse result was not selected', () => {
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
      describe('location.search has been changed', () => {
        it('should write location.search to the session storage', () => {
          const search = '?qindex=title&query=book&sort=title';
          mockStoreLastSearch.mockClear();
          history.push({ search });
          expect(mockStoreLastSearch).toHaveBeenCalledWith(search, 'instances');
        });
        it('should write location.search to the session storage', () => {
          const search = '?qindex=title&query=book&sort=title&reset=true';
          mockStoreLastSearch.mockClear();
          history.push({ search });
          expect(mockStoreLastSearch).toHaveBeenCalledWith(search, 'instances');
        });
      });

      describe('offset has been changed', () => {
        it('should write offset to storage', () => {
          const offset = 100;
          mockStoreLastSearchOffset.mockClear();

          const { rerender } = renderInstancesList({ segment: 'instances' });

          renderInstancesList(
            {
              segment: 'instances',
              parentResources: {
                ...resources,
                resultOffset: offset,
              },
            },
            rerender
          );

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

    describe('filters pane', () => {
      it('should have query in search input', () => {
        userEvent.click(screen.getByText('Save Model'));
        userEvent.click(screen.getByText('Cancel Model'));
        userEvent.click(screen.getByText('Save Import'));
        userEvent.click(screen.getByText('Cancel Import'));
        userEvent.type(
          screen.getByRole('searchbox', { name: 'Search' }),
          'search query'
        );
        expect(screen.getByText('Cancel Import')).toBeInTheDocument();
      });
    });
  });
});

describe('rendering InstancesList with holdings segment', () => {
  beforeEach(() => {
    jest.advanceTimersByTime(4000);
    history = createMemoryHistory();
    renderInstancesList({ segment: 'holdings' });
  });

  it('should show Save Holdings UUIDs button', () => {
    renderInstancesList({ segment: 'holdings' });

    userEvent.click(screen.getAllByRole('button', { name: 'Call Row' })[0]);
    userEvent.click(screen.getAllByRole('button', { name: 'Call Filter' })[0]);
    userEvent.click(screen.getAllByRole('button', { name: 'Call Reset' })[0]);
    userEvent.click(screen.getAllByRole('button', { name: 'Call Submit' })[0]);
    userEvent.click(screen.getAllByRole('button', { name: 'Call Create' })[0]);
    userEvent.click(screen.getAllByRole('button', { name: 'Call Copy' })[0]);
    userEvent.click(screen.getAllByRole('button', { name: 'Call Reset' })[0]);
    userEvent.click(screen.getAllByRole('button', { name: 'Call Result' })[0]);
    userEvent.click(screen.getAllByRole('button', { name: 'Call Index' })[0]);
    userEvent.click(screen.getAllByRole('button', { name: 'Call Cell' })[0]);
    userEvent.click(
      screen.getAllByRole('button', { name: 'Call Navigate' })[0]
    );
    userEvent.click(screen.getAllByRole('button')[0]);
    userEvent.click(screen.getAllByRole('button')[1]);
    userEvent.click(screen.getAllByRole('button')[2]);
    userEvent.click(screen.getAllByRole('button')[3]);
    userEvent.click(screen.getAllByRole('button')[4]);
    userEvent.click(screen.getAllByRole('button')[5]);
    userEvent.click(screen.getAllByRole('button')[6]);
    userEvent.click(screen.getAllByRole('button')[7]);
    userEvent.click(screen.getAllByRole('button')[8]);
    userEvent.click(screen.getAllByRole('button')[9]);
    userEvent.click(screen.getAllByRole('button')[10]);
    userEvent.click(screen.getAllByRole('button')[11]);
    userEvent.click(
      screen.getAllByRole('button', { name: 'Call ResultMark' })[0]
    );
    userEvent.click(
      screen.getAllByRole('link', { name: 'formatter Title' })[0]
    );
    userEvent.click(
      screen.getAllByRole('button', {
        name: 'In transit items report (CSV)',
      })[0]
    );
    userEvent.click(
      screen.getAllByRole('button', { name: 'Export instances (MARC)' })[0]
    );
    userEvent.click(screen.getAllByTestId('relation')[0]);
    userEvent.click(screen.getAllByTestId('publishers')[0]);
    userEvent.click(screen.getAllByTestId('contributors')[0]);
    expect(
      screen.getAllByRole('button', { name: 'Save holdings UUIDs' })[0]
    ).toBeVisible();
  });
});
