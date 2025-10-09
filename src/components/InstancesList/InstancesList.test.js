import { act } from 'react';
import { Router } from 'react-router-dom';
import { noop } from 'lodash';
import { createMemoryHistory } from 'history';
import {
  fireEvent,
  screen,
  waitFor,
  within,
} from '@folio/jest-config-stripes/testing-library/react';

import '../../../test/jest/__mock__';

import { ModuleHierarchyProvider } from '@folio/stripes/core';
import { SearchAndSort } from '@folio/stripes/smart-components';
import {
  filterConfig,
  queryIndexes,
  buildSearchQuery,
  SORT_OPTIONS,
  segments,
  TOGGLEABLE_COLUMNS,
} from '@folio/stripes-inventory-components';

import { renderWithIntl, translationsProperties } from '../../../test/jest/helpers';
import { instancesCollapsed as instancesCollapsedFixture } from '../../../test/fixtures/instancesCollapsed';
import InstancesList from './InstancesList';
import { setItem } from '../../storage';
import * as utils from '../../utils';

const updateMock = jest.fn();
const mockQueryReplace = jest.fn();
const mockResultOffsetReplace = jest.fn();
const mockStoreLastSearch = jest.fn();
const mockRecordsReset = jest.fn();
const mockRecordPost = jest.fn().mockResolvedValue({ hrid: 'TestHRID' });
const mockGetLastSearchOffset = jest.fn();
const mockStoreLastSearchOffset = jest.fn();
const mockGetLastSearch = jest.fn();
const mockItemsByQuery = jest.fn().mockResolvedValue([{
  id: 'itemId',
  holdingsRecordId: 'holdingsRecordId',
  instanceId: '69640328-788e-43fc-9c3c-af39e243f3b7',
}]);
const mockFullInstanceQuery = jest.fn().mockResolvedValue([{
  id: 'instanceId',
  items: [{
    tenantId: 'college',
  }],
}]);
const mockUnsubscribeFromReset = jest.fn();
const mockPublishOnReset = jest.fn();

const spyOnIsUserInConsortiumMode = jest.spyOn(utils, 'isUserInConsortiumMode');
const spyOnHasMemberTenantPermission = jest.spyOn(utils, 'hasMemberTenantPermission');
const spyOnCheckIfUserInCentralTenant = jest.spyOn(require('@folio/stripes/core'), 'checkIfUserInCentralTenant');
const spyOnCheckIfUserInMemberTenant = jest.spyOn(require('@folio/stripes/core'), 'checkIfUserInMemberTenant');

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

const mockGetResourcesIds = jest.fn().mockResolvedValue(['id-1']);

jest.mock('../../hocs', () => ({
  ...jest.requireActual('../../hocs'),
  withUseResourcesIds: jest.fn().mockImplementation((WrappedComponent) => {
    const WithUseResourcesIds = (props) => (
      <WrappedComponent
        {...props}
        getResourcesIds={mockGetResourcesIds}
      />
    );

    return WithUseResourcesIds;
  }),
}));

jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  Pluggable: ({ renderTrigger, onClose }) => (
    <>
      {renderTrigger()}
      <button
        data-testid="plugin-save&close"
        type="button"
        onClick={() => {
          onClose({ instanceRecord: { id: 'fast-add-record-id' } });
        }}
      >
        Save & close
      </button>
      <button
        type="button"
        data-testid="plugin-cancel"
        onClick={onClose}
      >
        Cancel
      </button>
    </>
  ),
  TitleManager: ({ page }) => (
    <div>{page}</div>
  ),
  getUserTenantsPermissions: jest.fn(() => Promise.resolve([])),
}));

jest.mock('@folio/stripes-inventory-components', () => ({
  ...jest.requireActual('@folio/stripes-inventory-components'),
  withReset: (Comp) => (props) => (
    <Comp
      {...props}
      unsubscribeFromReset={mockUnsubscribeFromReset}
      publishOnReset={mockPublishOnReset}
    />
  ),
  deleteFacetStates: jest.fn(),
  resetFacetStates: jest.fn(),
  buildSearchQuery: jest.fn(),
}));

const data = {
  contributorTypes: [],
  contributorNameTypes: [],
  instanceTypes: [],
  locations: [],
  instanceFormats: [],
  modesOfIssuance: [],
  natureOfContentTerms: [],
  displaySettings: {
    defaultSort: SORT_OPTIONS.CONTRIBUTORS,
    defaultColumns: TOGGLEABLE_COLUMNS,
  },
  instanceDateTypes: [],
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
    records: instancesCollapsedFixture,
    other: { totalRecords: instancesCollapsedFixture.length },
    isPending: false,
  },
  resultCount: instancesCollapsedFixture.length,
  resultOffset: 0,
};

let history = createMemoryHistory();

const openActionMenu = () => {
  fireEvent.change(screen.getByRole('combobox', { name: /search field index/i }), {
    target: { value: queryIndexes.INSTANCE_KEYWORD }
  });
  fireEvent.click(screen.getByRole('button', { name: 'Actions' }));
};

const getInstancesListTree = ({ segment = segments.instances, ...rest } = {}) => {
  const {
    indexes,
  } = filterConfig[segment];

  return (
    <Router history={history}>
      <ModuleHierarchyProvider module="@folio/inventory">
        <div id="ModuleContainer">
          <InstancesList
            isRequestUrlExceededLimit={false}
            parentResources={resources}
            parentMutator={{
              resultOffset: { replace: mockResultOffsetReplace },
              resultCount: { replace: noop },
              query: { update: updateMock, replace: mockQueryReplace },
              records: { reset: mockRecordsReset, POST: mockRecordPost },
              itemsByQuery: { reset: noop, GET: mockItemsByQuery },
              fullInstanceQuery: { GET: mockFullInstanceQuery },
            }}
            data={{
              ...data,
              query
            }}
            onSelectRow={noop}
            renderFilters={noop}
            segment={segment}
            searchableIndexes={indexes}
            getLastSearch={mockGetLastSearch}
            getLastBrowse={jest.fn()}
            getLastSearchOffset={mockGetLastSearchOffset}
            storeLastSearch={mockStoreLastSearch}
            storeLastSearchOffset={mockStoreLastSearchOffset}
            storeLastSegment={noop}
            {...rest}
          />
        </div>
      </ModuleHierarchyProvider>
    </Router>
  );
};

const renderInstancesList = (props = {}, rerender) => renderWithIntl(getInstancesListTree(props), translationsProperties, rerender);

describe('InstancesList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Instances segment', () => {
    describe('rendering', () => {
      describe('when switching segment (Instance/Holdings/Item)', () => {
        it('should unsubscribe from reset event', async () => {
          await act(async () => renderInstancesList());

          fireEvent.click(screen.getByRole('button', { name: 'Holdings' }));

          expect(mockUnsubscribeFromReset).toHaveBeenCalled();
        });
      });

      describe('when the component is mounted', () => {
        describe('and sort parameter does not match the one selected in Settings', () => {
          it('should not be replaced', async () => {
            jest.spyOn(history, 'replace');

            act(() => history.push('/inventory?sort=title'));

            await act(async () => renderInstancesList({
              segment: 'instances',
              data: {
                ...data,
                query: {
                  query: '',
                },
                displaySettings: {
                  defaultSort: SORT_OPTIONS.RELEVANCE,
                },
              },
            }));

            expect(history.replace).not.toHaveBeenLastCalledWith(expect.objectContaining({
              search: expect.stringContaining('sort=relevance'),
            }));
          });
        });

        describe('and sort parameter is missing', () => {
          it('should call history.replace with the default sort parameter', async () => {
            jest.spyOn(history, 'replace');

            act(() => history.push('/inventory'));

            await act(async () => renderInstancesList({
              data: {
                ...data,
                query: {
                  query: '',
                },
                displaySettings: {
                  defaultSort: SORT_OPTIONS.RELEVANCE,
                },
              },
            }));

            expect(history.replace).toHaveBeenLastCalledWith(expect.objectContaining({
              search: expect.stringContaining('sort=relevance'),
            }));
          });
        });

        describe('when query is present', () => {
          it('should display correct document title', async () => {
            await act(async () => renderInstancesList({
              segment: 'instances',
              data: {
                ...data,
                query: {
                  query: 'test',
                },
              },
            }));

            expect(screen.getByText('Inventory - test - Search')).toBeInTheDocument();
          });
        });

        describe('and browse result was selected', () => {
          it('should reset offset', async () => {
            mockResultOffsetReplace.mockClear();
            const params = {
              selectedBrowseResult: 'true',
              filters: 'searchContributors.2b94c631-fca9-4892-a730-03ee529ffe2a',
              qindex: 'contributor',
              query: 'Abdill, Aasha M.,',
            };

            await act(async () => renderInstancesList({
              segment: 'instances',
              getParams: () => params,
            }));

            expect(mockResultOffsetReplace).toHaveBeenCalledWith(0);
          });
        });

        describe('and browse result was not selected', () => {
          it('should replace resultOffset', async () => {
            mockResultOffsetReplace.mockClear();

            await act(async () => renderInstancesList({
              segment: 'instances',
              getLastSearchOffset: () => 100,
            }));

            expect(mockResultOffsetReplace).toHaveBeenCalledWith(100);
          });
        });

        describe('and a user is in a member tenant', () => {
          it('should select current tenant as a default value in Held By facet', async () => {
            jest.spyOn(history, 'replace');
            spyOnCheckIfUserInMemberTenant.mockReturnValue(true);

            act(() => history.push('/inventory?sort=title'));

            await act(async () => renderInstancesList({
              segment: 'instances',
              data: {
                ...data,
                query: {
                  query: '',
                },
              },
            }));

            expect(history.replace).toHaveBeenLastCalledWith(expect.objectContaining({
              search: expect.stringContaining('tenantId.diku&_isInitial=true'),
            }));
          });

          describe('when a component was mounted with search parameters in the url', () => {
            it('should not select current tenant as a default value in Held By facet', async () => {
              jest.spyOn(history, 'replace');
              spyOnCheckIfUserInMemberTenant.mockReturnValue(true);

              act(() => history.push('/inventory?sort=title&filters=source.FOLIO'));

              await act(async () => renderInstancesList({
                segment: 'instances',
                data: {
                  ...data,
                  query: {
                    query: '',
                  },
                },
              }));

              expect(history.replace).toHaveBeenLastCalledWith(expect.objectContaining({
                search: expect.stringContaining('sort=title&filters=source.FOLIO'),
              }));
            });
          });
        });
      });

      describe('when the component is updated', () => {
        describe('and location.search has been changed', () => {
          it('should write location.search to the session storage', async () => {
            await act(async () => renderInstancesList({ segment: 'instances' }));

            const search = '?qindex=title&query=book&sort=title';
            act(() => { history.push({ search }); });

            expect(mockStoreLastSearch).toHaveBeenCalledWith(search, 'instances');
          });
        });

        describe('and offset has been changed', () => {
          it('should write offset to storage', async () => {
            const offset = 100;
            mockStoreLastSearchOffset.mockClear();

            const { rerender } = await act(async () => renderInstancesList({ segment: 'instances' }));

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

        describe('and segment has been changed', () => {
          it('should apply offset from storage', async () => {
            const lastSearchOffset = 200;

            const { rerender } = await act(async () => renderInstancesList({
              segment: segments.instances,
            }));

            mockStoreLastSearchOffset.mockClear();
            mockResultOffsetReplace.mockClear();
            mockGetLastSearchOffset.mockReturnValueOnce(lastSearchOffset);

            renderInstancesList({ segment: segments.holdings }, rerender);

            expect(mockGetLastSearchOffset).toHaveBeenCalledWith(segments.holdings);
            expect(mockResultOffsetReplace).toHaveBeenCalledWith(lastSearchOffset);
          });
        });
      });

      describe('when user clicks Reset all', () => {
        it('should move focus to query input', async () => {
          await act(async () => renderInstancesList({
            segment: 'instances',
          }));

          fireEvent.change(screen.getByRole('textbox', { name: 'Search' }), { target: { value: 'test' } });
          fireEvent.click(screen.getAllByRole('button', { name: 'Search' })[1]);
          fireEvent.click(screen.getByRole('button', { name: 'Reset all' }));

          expect(screen.getByRole('textbox', { name: 'Search' })).toHaveFocus();
        });

        it('should publish the reset event', async () => {
          await act(async () => renderInstancesList());

          await act(() => SearchAndSort.mock.calls[0][0].onResetAll());

          expect(mockPublishOnReset).toHaveBeenCalled();
        });

        it('should call history.replace to add the default sort query parameter from inventory settings', async () => {
          jest.spyOn(history, 'replace');
          spyOnCheckIfUserInMemberTenant.mockReturnValue(false);

          act(() => history.push('/inventory?filters=staffSuppress.true&sort=contributors'));

          await act(async () => renderInstancesList({
            segment: 'instances',
            data: {
              ...data,
              query: {
                query: '',
                sort: SORT_OPTIONS.CONTRIBUTORS,
              },
              displaySettings: {
                defaultSort: SORT_OPTIONS.RELEVANCE,
              },
            }
          }));

          fireEvent.change(screen.getByRole('textbox', { name: 'Search' }), { target: { value: 'test' } });
          fireEvent.click(screen.getByRole('button', { name: 'Reset all' }));

          expect(history.replace).toHaveBeenLastCalledWith({
            pathname: '/',
            search: 'sort=relevance',
            state: undefined,
          });
        });

        describe('when a user is in a member tenant', () => {
          it('should select current tenant as a default value in Held By facet', async () => {
            jest.spyOn(history, 'replace');
            spyOnCheckIfUserInMemberTenant.mockReturnValue(true);

            act(() => history.push('/inventory?filters=staffSuppress.true&sort=contributors'));

            await act(async () => renderInstancesList({
              segment: 'instances',
              data: {
                ...data,
                query: {
                  query: '',
                  sort: SORT_OPTIONS.CONTRIBUTORS,
                },
                displaySettings: {
                  defaultSort: SORT_OPTIONS.RELEVANCE,
                },
              }
            }));

            fireEvent.change(screen.getByRole('textbox', { name: 'Search' }), { target: { value: 'test' } });
            fireEvent.click(screen.getByRole('button', { name: 'Reset all' }));

            expect(history.replace).toHaveBeenLastCalledWith(expect.objectContaining({
              search: expect.stringContaining('tenantId.diku&_isInitial=true'),
            }));
          });
        });
      });

      describe('when search segment is changed', () => {
        it('should clear selected rows', async () => {
          const {
            getAllByLabelText,
            getByText,
          } = await act(async () => renderInstancesList({
            segment: 'instances',
          }));

          fireEvent.click(getAllByLabelText('Select instance')[0]);
          fireEvent.click(getByText('Holdings'));

          expect(getAllByLabelText('Select instance')[0].checked).toBeFalsy();
        });

        describe('when a user is in a member tenant', () => {
          it('should select current tenant as a default value in Held By facet', async () => {
            jest.spyOn(history, 'replace');
            spyOnCheckIfUserInMemberTenant.mockReturnValue(true);

            const {
              getAllByLabelText,
              getByText,
            } = await act(async () => renderInstancesList({
              segment: 'instances',
            }));

            fireEvent.click(getAllByLabelText('Select instance')[0]);
            fireEvent.click(getByText('Holdings'));

            expect(history.replace).toHaveBeenLastCalledWith(expect.objectContaining({
              search: expect.stringContaining('tenantId.diku&_isInitial=true'),
            }));
          });
        });
      });

      describe('when a user performs a search and clicks the `Next` button in the list of records', () => {
        describe('then clicks on the `Browse` lookup tab and then clicks `Search` lookup tab', () => {
          it('should avoid infinity loading by resetting the records on unmounting', async () => {
            mockRecordsReset.mockClear();

            const { unmount } = await act(async () => renderInstancesList({ segment: 'instances' }));
            unmount();
            expect(mockRecordsReset).toHaveBeenCalled();
          });
        });
      });

      describe('when clicking on the `Browse` tab', () => {
        it('should pass the correct search by clicking on the `Browse` tab', async () => {
          const search = '?qindex=subject&query=book';

          jest.spyOn(history, 'push');

          await act(async () => renderInstancesList({
            segment: 'instances',
            getLastBrowse: () => search,
          }));

          fireEvent.click(screen.getByRole('button', { name: 'Browse' }));

          expect(history.push).toHaveBeenCalledWith(expect.objectContaining({ search }));
        });
        it('should store last opened record id', async () => {
          history = createMemoryHistory({ initialEntries: [{
            pathname: '/inventory/view/test-id',
          }] });

          await act(async () => renderInstancesList({
            segment: 'instances',
          }));

          fireEvent.click(screen.getByRole('button', { name: 'Browse' }));

          expect(setItem).toHaveBeenCalledWith('@folio/inventory.instances.lastOpenRecord', 'test-id');
        });
      });

      it('should have proper list results size', async () => {
        await act(async () => renderInstancesList({ segment: 'instances' }));

        expect(document.querySelectorAll('#pane-results-content .mclRowContainer > [role=row]').length).toEqual(4);
      });
    });
    describe('action menu', () => {
      describe('opening action menu', () => {
        it('should disable toggleable columns', async () => {
          await act(async () => renderInstancesList({ segment: 'instances' }));
          openActionMenu();

          expect(screen.getByText(/show columns/i)).toBeInTheDocument();
        });

        describe('"New record" button', () => {
          describe('for non-consortial tenant', () => {
            it('should display the default "New" menu option', async () => {
              spyOnIsUserInConsortiumMode.mockReturnValue(false);

              await act(async () => renderInstancesList({ segment: 'instances' }));
              openActionMenu();

              expect(screen.getByRole('button', { name: 'New' })).toBeInTheDocument();
            });
          });

          describe('for a Consortial central tenant', () => {
            it('should display "New shared record" menu option', async () => {
              spyOnIsUserInConsortiumMode.mockReturnValue(true);
              spyOnCheckIfUserInCentralTenant.mockReturnValue(true);

              await act(async () => renderInstancesList({ segment: 'instances' }));
              openActionMenu();

              expect(screen.getByRole('button', { name: 'New shared record' })).toBeInTheDocument();
            });
          });

          describe('for a Member library tenant', () => {
            it('should display "New local record" menu option', async () => {
              spyOnIsUserInConsortiumMode.mockReturnValue(true);
              spyOnCheckIfUserInCentralTenant.mockReturnValue(false);

              await act(async () => renderInstancesList({ segment: 'instances' }));
              openActionMenu();

              expect(screen.getByRole('button', { name: 'New local record' })).toBeInTheDocument();
            });
          });

          describe('when canceling a record', () => {
            it('should remove the "layer" parameter and focus on the search field', async () => {
              act(() => history.push('/inventory?layer=foo'));
              spyOnCheckIfUserInMemberTenant.mockReturnValue(false);

              jest.spyOn(history, 'push');

              const { getByRole } = await act(async () => renderInstancesList({ segment: 'instances' }));
              await act(() => SearchAndSort.mock.calls[0][0].onCloseNewRecord());

              expect(history.push).toHaveBeenCalledWith('/?sort=contributors');
              await waitFor(() => expect(getByRole('textbox', { name: /search/i })).toHaveFocus());
            });
          });

          describe('when create new instance', () => {
            it('should show success message', async () => {
              await act(async () => renderInstancesList({ segment: 'instances' }));

              SearchAndSort.mock.calls[0][0].onCreate({
                discoverySuppress: false,
                staffSuppress: false,
                previouslyHeld: false,
                source: 'FOLIO',
                title: 'Test title',
                instanceTypeId: '9bce18bd-45bf-4949-8fa8-63163e4b7d7f'
              });

              expect(screen.queryByText('The instance - HRID TestHRID has been successfully saved.')).toBeDefined();
            });
          });
        });

        describe('"New fast add record" button', () => {
          it('should render', async () => {
            await act(async () => renderInstancesList({ segment: 'instances' }));
            openActionMenu();

            expect(screen.getByRole('button', { name: 'New fast add record' })).toBeInTheDocument();
          });

          describe('when saving the record', () => {
            it('should redirect to new Instance record', async () => {
              jest.spyOn(history, 'push');
              spyOnCheckIfUserInMemberTenant.mockReturnValue(false);
              await act(async () => renderInstancesList({ segment: 'instances' }));
              openActionMenu();

              const button = screen.getByRole('button', { name: 'New fast add record' });

              fireEvent.click(button);
              fireEvent.click(screen.getByTestId('plugin-save&close'));

              expect(history.push).toHaveBeenCalledWith({
                pathname: '/inventory/view/fast-add-record-id',
                search: '?sort=contributors',
              });
            });
          });

          describe('when canceling the record', () => {
            it('should focus on search field', async () => {
              jest.useFakeTimers();

              const { getByRole } = await act(async () => renderInstancesList({ segment: 'instances' }));

              openActionMenu();

              fireEvent.click(screen.getByRole('button', { name: 'New fast add record' }));
              fireEvent.click(screen.getByTestId('plugin-cancel'));

              act(() => jest.runAllTimers());

              expect(getByRole('textbox', { name: /search/i })).toHaveFocus();
            });
          });
        });

        describe('"New MARC bibliographic record" button', () => {
          it('should render', async () => {
            await act(async () => renderInstancesList({ segment: 'instances' }));
            openActionMenu();

            expect(screen.getByRole('button', { name: 'New MARC bibliographic record' })).toBeInTheDocument();
          });

          it('should redirect to the correct layer', async () => {
            jest.spyOn(history, 'push');
            spyOnCheckIfUserInMemberTenant.mockReturnValue(false);
            await act(async () => renderInstancesList({ segment: 'instances' }));
            openActionMenu();

            const button = screen.getByRole('button', { name: 'New MARC bibliographic record' });

            fireEvent.click(button);

            expect(history.push).toHaveBeenCalledWith('/inventory/quick-marc/create-bibliographic?sort=contributors');
          });
        });

        describe('hiding contributors column', () => {
          it('should hide contributors column', async () => {
            await act(async () => renderInstancesList({ segment: 'instances' }));
            fireEvent.click(screen.getByTestId('contributors'));

            expect(document.querySelector('#clickable-list-column-contributors')).not.toBeInTheDocument();
          });
        });

        describe('select sort by', () => {
          it('should render menu option', async () => {
            await act(async () => renderInstancesList({ segment: 'instances' }));

            expect(screen.getByTestId('menu-section-sort-by')).toBeInTheDocument();
          });

          it('should render select', async () => {
            await act(async () => renderInstancesList({ segment: 'instances' }));

            expect(screen.getByTestId('sort-by-selection')).toBeInTheDocument();
          });

          it('should render correct order of options', async () => {
            await act(async () => renderInstancesList({ segment: 'instances' }));
            openActionMenu();

            const options = within(screen.getByTestId('sort-by-selection')).getAllByRole('option');

            expect(options).toHaveLength(Object.keys(SORT_OPTIONS).length);
            expect(options[0]).toHaveTextContent('Title');
            expect(options[1]).toHaveTextContent('Contributors');
            expect(options[2]).toHaveTextContent('Date');
            expect(options[3]).toHaveTextContent('Relevance');
          });
        });

        describe('select proper sort options', () => {
          it('should select Title as default selected sort option', async () => {
            await act(async () => renderInstancesList({ segment: 'instances' }));

            const search = '?segment=instances&sort=title';
            act(() => { history.push({ search }); });
            openActionMenu();

            const option = within(screen.getByTestId('menu-section-sort-by')).getByRole('option', { name: 'Title' });
            expect(option.selected).toBeTruthy();
          });

          it('should select Contributors option', async () => {
            await act(async () => renderInstancesList({ segment: 'instances' }));

            openActionMenu();
            fireEvent.change(screen.getByTestId('sort-by-selection'), { target: { value: 'contributors' } });
            openActionMenu();

            const option = within(screen.getByTestId('menu-section-sort-by')).getByRole('option', { name: 'Contributors' });
            expect(option.selected).toBeTruthy();
          });

          it('should select option value "Contributors" after column "Contributors" click', async () => {
            await act(async () => renderInstancesList({ segment: 'instances' }));

            await act(async () => fireEvent.click(document.querySelector('#clickable-list-column-contributors')));
            openActionMenu();

            expect((screen.getByRole('option', { name: 'Contributors' })).selected).toBeTruthy();
          });

          it('should select Relevance selected sort option when in search query', async () => {
            await act(async () => renderInstancesList({ segment: 'instances' }));

            const search = '?segment=instances&sort=relevance';
            act(() => { history.push({ search }); });
            openActionMenu();

            const option = within(screen.getByTestId('menu-section-sort-by')).getByRole('option', { name: 'Relevance' });
            expect(option.selected).toBeTruthy();
          });

          it('should set aria-sort to none on sorted columns after query sort by Relevance', async () => {
            await act(async () => renderInstancesList({
              segment: 'instances',
              parentResources: {
                ...resources,
                query: {
                  query: '',
                  sort: 'relevance',
                }
              },
            }));

            const sortCols = document.querySelectorAll('[aria-sort="ascending"], [aria-sort="descending"]');
            expect(sortCols).toHaveLength(0);
          });

          it('should select Date option', async () => {
            await act(async () => renderInstancesList());

            openActionMenu();
            fireEvent.change(screen.getByTestId('sort-by-selection'), { target: { value: SORT_OPTIONS.DATE } });
            openActionMenu();

            const option = within(screen.getByTestId('menu-section-sort-by')).getByRole('option', { name: 'Date' });
            expect(option.selected).toBeTruthy();
          });
        });
      });

      describe('when clicking on the `Holdings` or `Items` segments', () => {
        it('should take default sort option from data for Holdings or Item segments', async () => {
          await act(async () => renderInstancesList({ segment: 'instances' }));

          const search = '?segment=instances&sort=title';
          act(() => { history.push({ search }); });
          await act(async () => fireEvent.click(screen.getByRole('button', { name: /^holdings$/i })));
          const paramSortHoldings = new URLSearchParams(history.location.search).get('sort');

          await act(async () => fireEvent.click(screen.getByRole('button', { name: /^item$/i })));
          const paramSortItems = new URLSearchParams(history.location.search).get('sort');

          expect(paramSortHoldings).toEqual(data.displaySettings.defaultSort);
          expect(paramSortItems).toEqual(data.displaySettings.defaultSort);
        });
      });
    });

    describe('filters pane', () => {
      it('should have query in search input', async () => {
        await act(async () => renderInstancesList({ segment: 'instances' }));

        fireEvent.change(screen.getByRole('textbox', { name: 'Search' }), { target: { value: 'search query' } });
        fireEvent.click(screen.getAllByRole('button', { name: 'Search' })[1]);

        expect(screen.getByRole('textbox', { name: 'Search' })).toHaveValue('search query');
      });

      describe('when the search option is changed', () => {
        it('should not change the URL in the onChangeIndex function', async () => {
          history.push = jest.fn();

          await act(async () => renderInstancesList({ segment: 'instances' }));

          fireEvent.change(screen.getByLabelText('Search field index'), { target: { value: 'Title (all)' } });

          expect(updateMock).not.toHaveBeenCalled();
          expect(mockQueryReplace).not.toHaveBeenCalled();
          expect(history.push).not.toHaveBeenCalled();
        });
      });
    });

    describe('when using advanced search', () => {
      it('should set advanced search query in search input', async () => {
        await act(async () => renderInstancesList({ segment: 'instances' }));

        fireEvent.click(screen.getByRole('button', { name: 'Advanced search' }));
        fireEvent.change(screen.getAllByTestId('advanced-search-query')[0], {
          target: { value: 'test' }
        });

        fireEvent.click(document.querySelector('[data-test-advanced-search-button-search]'));

        expect(screen.getAllByLabelText('Search')[0].value).toEqual('keyword containsAll test');
      });
    });

    describe('when exporting Instances UUIDs', () => {
      it('should call `getResourcesIds` with correct arguments', async () => {
        const qindex = queryIndexes.QUERY_SEARCH;
        const _query = 'keyword all test';

        buildSearchQuery.mockReturnValue(() => _query);

        await act(async () => renderInstancesList({
          segment: 'instances',
          parentResources: {
            ...resources,
            query: {
              ...query,
              qindex,
              query: _query,
            },
          },
        }));

        openActionMenu();

        await act(async () => fireEvent.click(screen.getByRole('button', { name: 'Save instances UUIDs' })));

        expect(mockGetResourcesIds).toHaveBeenCalledWith(_query, 'INSTANCE');
      });
    });
  });

  describe('Holdings segment', () => {
    it('should show Save Holdings UUIDs button', async () => {
      await act(async () => renderInstancesList({ segment: 'holdings' }));

      fireEvent.change(screen.getByRole('combobox'), {
        target: { value: queryIndexes.INSTANCE_KEYWORD }
      });

      fireEvent.click(screen.getByRole('button', { name: 'Actions' }));

      expect(screen.getByRole('button', { name: 'Save holdings UUIDs' })).toBeVisible();
    });

    describe('when exporting Holdings UUIDs', () => {
      it('should call `getResourcesIds` with correct arguments', async () => {
        const qindex = queryIndexes.QUERY_SEARCH;
        const _query = 'keyword all test';

        buildSearchQuery.mockReturnValue(() => _query);

        await act(async () => renderInstancesList({
          segment: 'holdings',
          parentResources: {
            ...resources,
            query: {
              ...query,
              qindex,
              query: _query,
            },
          },
        }));

        openActionMenu();

        await act(async () => fireEvent.click(screen.getByRole('button', { name: 'Save holdings UUIDs' })));

        expect(mockGetResourcesIds).toHaveBeenCalledWith(_query, 'HOLDINGS');
      });
    });
  });

  describe('Items segment', () => {
    describe('item view queries', () => {
      [
        { qindex: 'items.barcode', query: '1234567(89)', option: 'barcode' },
        { qindex: 'isbn', query: '1234567(89)', option: 'isbn' },
        { qindex: 'issn', query: '1234567(89)', option: 'issn' },
        { qindex: 'itemHrid', query: '1234567(89)', option: 'hrid' },
        { qindex: 'iid', query: '1234567(89)', option: 'id' },
      ].forEach(({ qindex, query: _query, option }) => {
        describe(`when open item view for ${option}`, () => {
          it(`should enclose the ${option} query in quotes`, async () => {
            spyOnHasMemberTenantPermission.mockReturnValue(true);

            await act(async () => renderInstancesList({
              segment: 'items',
              parentResources: {
                ...resources,
                query: {
                  ...query,
                  qindex,
                  query: _query,
                },
              },
              stripes: {
                hasPerm: () => false,
                hasInterface: () => true,
                user: { user: { tenants: [{ id: 'college' }] } },
                okapi: { tenant: 'diku', token: '' },
              },
            }));

            await act(() => fireEvent.change(screen.getByLabelText('Search field index'), { target: { value: qindex } }));
            await act(() => fireEvent.change(screen.getByRole('textbox', { name: 'Search' }), { target: { value: _query } }));

            fireEvent.click(screen.getAllByRole('button', { name: 'Search' })[1]);

            const row = screen.getAllByText('ABA Journal')[0];

            await act(async () => fireEvent.click(row));

            expect(mockItemsByQuery).toHaveBeenCalledWith({
              headers: {
                'Content-Type': 'application/json',
                'X-Okapi-Tenant': 'college',
              },
              params: {
                query: `${option}=="${_query}"`,
              },
            });
          });
        });
      });
    });

    describe('when there is one item found', () => {
      it.skip('should navigate to item details page', async () => {
        await act(async () => renderInstancesList({
          segment: 'items',
          parentResources: {
            ...resources,
            query: {
              ...query,
              qindex: 'items.barcode',
              query: '1234567(89)',
            },
          },
          stripes: {
            hasPerm: () => true,
            hasInterface: () => true,
            user: { user: { tenants: [{ id: 'college' }] } },
            okapi: { tenant: 'diku' },
          },
        }));

        jest.spyOn(history, 'push');

        await act(() => fireEvent.change(screen.getByLabelText('Search field index'), { target: { value: 'items.barcode' } }));
        await act(() => fireEvent.change(screen.getByRole('textbox', { name: 'Search' }), { target: { value: '1234567(89)' } }));

        fireEvent.click(screen.getAllByRole('button', { name: 'Search' })[1]);

        await waitFor(() => expect(history.push).toHaveBeenCalledWith(expect.objectContaining({
          pathname: '/inventory/view/69640328-788e-43fc-9c3c-af39e243f3b7/holdingsRecordId/itemId',
          state: {
            tenantFrom: 'diku',
            tenantTo: 'college',
          },
        })));
      });
    });

    describe('when dismissing a record detail view', () => {
      it('should reset selected row and focus on the search field', async () => {
        SearchAndSort.mockClear();
        history = createMemoryHistory();
        act(() => history.push('inventory/view/5bf370e0-8cca-4d9c-82e4-5170ab2a0a39'));

        const mockResetSelectedItem = jest.fn();

        const { getByText } = await act(async () => renderInstancesList({ segment: 'instances' }));
        const clickedListItem = getByText('A semantic web primer');

        SearchAndSort.mock.calls[0][0].onDismissDetail(mockResetSelectedItem);

        expect(mockResetSelectedItem).toHaveBeenCalled();
        expect(clickedListItem).toHaveFocus();
      });
    });
  });

  describe('Date column', () => {
    describe('when there is no delimiter', () => {
      it('should use a comma', async () => {
        const { getByText } = await act(async () => renderInstancesList({
          parentResources: {
            ...resources,
            records: {
              ...resources.records,
              records: [{
                id: 'id-1',
                title: 'testDate',
                dates: {
                  date1: '2022',
                  date2: '2024',
                },
              }],
            },
          },
        }));

        expect(getByText('2022, 2024')).toBeVisible();
      });
    });

    describe('when delimiter is a comma', () => {
      it('should be displayed with a space after comma', async () => {
        const { getByText } = await act(async () => renderInstancesList({
          data: {
            ...data,
            ...query,
            instanceDateTypes: [{
              id: 'id-1',
              displayFormat: {
                delimiter: ',',
                keepDelimiter: true,
              },
            }],
          },
          parentResources: {
            ...resources,
            records: {
              ...resources.records,
              records: [{
                id: 'record-id',
                title: 'testDate',
                dates: {
                  date1: '2023',
                  date2: '2024',
                  dateTypeId: 'id-1',
                },
              }],
            },
          },
        }));

        expect(getByText('2023, 2024')).toBeVisible();
      });
    });

    describe('when keepDelimiter is true', () => {
      it('should display the delimiter', async () => {
        const { getByText } = await act(async () => renderInstancesList({
          data: {
            ...data,
            ...query,
            instanceDateTypes: [{
              id: 'id-1',
              displayFormat: {
                delimiter: '-',
                keepDelimiter: true,
              },
            }],
          },
          parentResources: {
            ...resources,
            records: {
              ...resources.records,
              records: [{
                id: 'record-id',
                title: 'testDate',
                dates: {
                  date2: '2024',
                  dateTypeId: 'id-1',
                },
              }],
            },
          },
        }));

        expect(getByText('-2024')).toBeVisible();
      });
    });

    describe('when keepDelimiter is false', () => {
      it('should not display a delimiter', async () => {
        const { getByText } = await act(async () => renderInstancesList({
          data: {
            ...data,
            ...query,
            instanceDateTypes: [{
              id: 'id-1',
              displayFormat: {
                delimiter: '-',
                keepDelimiter: false,
              },
            }],
          },
          parentResources: {
            ...resources,
            records: {
              ...resources.records,
              records: [{
                id: 'record-id',
                title: 'testDate',
                dates: {
                  date2: '2024',
                  dateTypeId: 'id-1',
                },
              }],
            },
          },
        }));

        expect(getByText('2024')).toBeVisible();
      });
    });
  });

  describe('search columns and show columns', () => {
    it('should have correct order of search columns', async () => {
      const { getAllByRole } = await act(async () => renderInstancesList());

      const searchColumns = getAllByRole('columnheader');

      expect(searchColumns[0]).toHaveTextContent('');
      expect(searchColumns[1]).toHaveTextContent('Title');
      expect(searchColumns[2]).toHaveTextContent('Contributors');
      expect(searchColumns[3]).toHaveTextContent('Publishers');
      expect(searchColumns[4]).toHaveTextContent('Date');
      expect(searchColumns[5]).toHaveTextContent('Relation');
      expect(searchColumns[6]).toHaveTextContent('Instance HRID');
    });

    it('should render correct order of options in "Show columns" section of actions', async () => {
      await act(async () => renderInstancesList());
      openActionMenu();

      const checkboxes = within(document.getElementById('columns-menu-section')).getAllByText(
        /Contributors|Date|Publishers|Relation|Instance HRID/
      );

      expect(checkboxes[0]).toHaveTextContent('Contributors');
      expect(checkboxes[1]).toHaveTextContent('Date');
      expect(checkboxes[2]).toHaveTextContent('Publishers');
      expect(checkboxes[3]).toHaveTextContent('Relation');
      expect(checkboxes[4]).toHaveTextContent('Instance HRID');
    });
  });
});
