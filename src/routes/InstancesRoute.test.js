import { BrowserRouter as Router } from 'react-router-dom';
import {
  screen,
  getByText,
  getByRole,
  getAllByRole,
  waitFor,
  fireEvent,
} from '@folio/jest-config-stripes/testing-library/react';
import { noop } from 'lodash';

import '../../test/jest/__mock__';

import { CalloutContext, StripesContext, ModuleHierarchyProvider } from '@folio/stripes/core';

import {
  Layer,
  Paneset
} from '@folio/stripes/components';
import { SORT_OPTIONS } from '@folio/stripes-inventory-components';

import renderWithIntl from '../../test/jest/helpers/renderWithIntl';
import OverlayContainer from '../../test/helpers/OverlayContainer';
import translationsProperties from '../../test/jest/helpers/translationsProperties';
import { instancesExpanded as instancesExpandedFixture } from '../../test/fixtures/instancesExpanded';
import { items as callNumbers } from '../../test/fixtures/callNumbers';
import { QUICK_EXPORT_LIMIT } from '../constants';
import { DataContext, LastSearchTermsContext } from '../contexts';
import InstancesRoute from './InstancesRoute';

jest.mock('../components/BrowseInventoryFilters', () => 'BrowseInventoryFilters');
jest.mock('@folio/stripes-acq-components');

const stripesStub = {
  connect: Component => <Component />,
  hasPerm: () => true,
  hasInterface: () => true,
  logger: { log: noop },
  locale: 'en-US',
  plugins: {},
  okapi: {
    tenant: 'diku',
  },
};

const InstancesRouteSetup = ({
  instances = instancesExpandedFixture,
  sendCallout = noop,
  quickExportPOST = noop,
} = {}) => (
  <Router>
    <StripesContext.Provider value={stripesStub}>
      <CalloutContext.Provider value={{ sendCallout }}>
        <ModuleHierarchyProvider module="@folio/inventory">
          <DataContext.Provider value={{
            contributorTypes: [],
            instanceTypes: [],
            locations: [],
            instanceFormats: [],
            modesOfIssuance: [],
            natureOfContentTerms: [],
            displaySettings: {
              defaultSort: SORT_OPTIONS.TITLE,
            },
            instanceDateTypes: [],
          }}
          >
            <LastSearchTermsContext.Provider value={{
              getLastSearch: jest.fn(),
              getLastBrowse: jest.fn(),
              getLastSearchOffset: jest.fn(),
              getLastBrowseOffset: jest.fn(),
              storeLastSearch: jest.fn(),
              storeLastBrowse: jest.fn(),
              storeLastSearchOffset: jest.fn(),
              storeLastBrowseOffset: jest.fn(),
              storeLastSegment: jest.fn(),
            }}
            >
              <div id="ModuleContainer">
                <Paneset>
                  <Layer
                    isOpen
                    contentLabel="label"
                  >
                    <OverlayContainer />
                    <InstancesRoute
                      tenantId="diku"
                      resources={{
                        query: {
                          query: '',
                          sort: 'title',
                        },
                        records: {
                          hasLoaded: true,
                          resource: 'records',
                          records: instances,
                          other: { totalRecords: instances.length },
                        },
                        recordsBrowseCallNumber : {
                          hasLoaded: true,
                          resource: 'records',
                          records: callNumbers,
                          other: {
                            totalRecords: callNumbers.length
                          },
                        },
                        resultCount: instances.length,
                        resultOffset: 0,
                      }}
                      mutator={{
                        quickExport: { POST: quickExportPOST },
                        resultCount: { replace: noop },
                        resultOffset: { replace: noop },
                        query: {
                          update: jest.fn(),
                          replace: jest.fn(),
                        },
                        browseModeRecords: { reset: jest.fn() },
                        records: { reset: jest.fn() },
                      }}
                    />
                  </Layer>
                </Paneset>
              </div>
            </LastSearchTermsContext.Provider>
          </DataContext.Provider>
        </ModuleHierarchyProvider>
      </CalloutContext.Provider>
    </StripesContext.Provider>
  </Router>
);

describe('InstancesRoute', () => {
  const quickExportAPICallMock = jest.fn(Promise.resolve.bind(Promise));
  const sendCalloutMock = jest.fn();
  let renderWithIntlResult;

  describe('rendering InstancesRoute', () => {
    beforeEach(() => {
      renderWithIntlResult = renderWithIntl(
        <InstancesRouteSetup
          quickExportPOST={quickExportAPICallMock}
          sendCallout={sendCalloutMock}
        />,
        translationsProperties
      );
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should have proper list results size', () => {
      expect(document.querySelectorAll('#pane-results-content .mclRowContainer > [role=row]').length).toEqual(4);
    });

    it('should render nothing for select row column header', () => {
      expect(screen.getAllByRole('columnheader')[0].textContent).toEqual('');
    });

    it('should display unchecked select row checkbox', () => {
      const selectRowCheckboxes = screen.getAllByRole('checkbox', { name: 'Select instance' });

      expect(selectRowCheckboxes[0]).not.toBeChecked();
    });

    it('should not display information about selected items', () => {
      expect(document.querySelector('[data-test-custom-pane-sub]')).not.toBeInTheDocument();
    });

    describe('opening action menu', () => {
      beforeEach(() => {
        fireEvent.click(screen.getByRole('button', { name: 'Actions' }));
      });

      it('should not display exceeded quick export limit warning', () => {
        expect(screen.queryByText(`Selected record limit of ${QUICK_EXPORT_LIMIT} exceeded`)).not.toBeInTheDocument();
      });

      it('should disable export instances (MARC) action button if there are no selected rows', () => {
        expect(screen.getByRole('button', { name: 'Export instances (MARC)' })).toBeDisabled();
      });

      it('should disable show selected records action button if there are no selected rows', () => {
        expect(screen.getByRole('button', { name: 'Show selected records' })).toBeDisabled();
      });
    });

    describe('selecting row', () => {
      let selectRowCheckboxes;

      beforeEach(() => {
        selectRowCheckboxes = screen.getAllByRole('checkbox', { name: 'Select instance' });

        fireEvent.click(selectRowCheckboxes[1]);
      });

      it('should display checked select row checkbox', () => {
        expect(selectRowCheckboxes[1]).toBeChecked();
      });

      it('should display selected rows count message in the sub header', () => {
        expect(screen.getByText('1 record selected')).toBeInTheDocument();
      });

      describe('selecting one more row and clicking on show selected records action button', () => {
        beforeEach(() => {
          fireEvent.click(selectRowCheckboxes[2]);
          fireEvent.click(screen.getByRole('button', { name: 'Actions' }));
          fireEvent.click(screen.getByRole('button', { name: 'Show selected records' }));
        });

        it('should open selected records modal', () => {
          expect(screen.getByTestId('selected-record-modal')).toBeInTheDocument();
        });

        it('should have correct heading', () => {
          expect(screen.getByText('Selected records', { selector: 'h1' })).toBeInTheDocument();
        });

        it('should display correct amount of records in modal', () => {
          const modal = screen.getByTestId('selected-record-modal');

          expect(modal.querySelectorAll('.mclRowContainer > [role=row]').length).toEqual(2);
        });

        it('should display correct data in list', () => {
          const modal = screen.getByTestId('selected-record-modal');
          const row = modal.querySelector('.mclRowContainer > [role=row]');
          const cells = getAllByRole(row, 'gridcell');

          expect(getByRole(cells[0], 'checkbox', { name: 'Select instance' })).toBeVisible();
          expect(getByText(cells[1], '#youthaction')).toBeVisible();
          expect(getByText(cells[2], 'Kirshner, Benjamin ; Middaugh, Ellen')).toBeVisible();
          expect(getByText(cells[3], 'Information Age Publishing, Inc. (2015)')).toBeVisible();
        });

        it('should have all rows selected', () => {
          const modal = screen.getByTestId('selected-record-modal');
          const selectRowCheckboxesInModal = getAllByRole(modal, 'checkbox', { name: 'Select instance' });

          selectRowCheckboxesInModal.forEach(checkbox => expect(checkbox).toBeChecked());
        });

        describe('unselecting rows in the modal', () => {
          beforeEach(() => {
            const modal = screen.getByTestId('selected-record-modal');
            const selectRowCheckboxesInModal = getAllByRole(modal, 'checkbox', { name: 'Select instance' });

            selectRowCheckboxesInModal.forEach(fireEvent.click);
          });

          it('should preserve the selected state for the corresponding rows in the results list after close of the modal upon click on cancel button', async () => {
            const cancelBt = await screen.findByText(/cancel/i);
            fireEvent.click(cancelBt);

            expect(selectRowCheckboxes[1]).toBeChecked();
            expect(selectRowCheckboxes[2]).toBeChecked();
          });

          it('should unselect corresponding rows in the results list after close of the modal upon click on save button', async () => {
            fireEvent.click(screen.getByRole('button', { name: 'Save & close' }));

            expect(selectRowCheckboxes[1]).not.toBeChecked();
            expect(selectRowCheckboxes[2]).not.toBeChecked();
          });
        });
      });

      describe('selecting more than one row', () => {
        beforeEach(() => {
          fireEvent.click(selectRowCheckboxes[2]);
        });

        it('should display selected rows count message (plural form) in the sub header', () => {
          expect(screen.getByText('2 records selected')).toBeInTheDocument();
        });

        it('should not initiate display of error callout and make an API call upon click on export instances (MARC) button', () => {
          fireEvent.click(screen.getByRole('button', { name: 'Actions' }));
          fireEvent.click(screen.getByRole('button', { name: 'Export instances (MARC)' }));

          expect(quickExportAPICallMock).toBeCalled();
          expect(sendCalloutMock).not.toBeCalled();
        });

        it('should initiate display of error callout and make an API call upon click on export instances (MARC) button with API request set up to fail', async () => {
          quickExportAPICallMock.mockImplementationOnce(Promise.reject.bind(Promise));
          fireEvent.click(screen.getByRole('button', { name: 'Actions' }));
          fireEvent.click(screen.getByRole('button', { name: 'Export instances (MARC)' }));

          expect(quickExportAPICallMock).toBeCalled();

          await waitFor(() => {
            expect(sendCalloutMock).toBeCalledWith(expect.objectContaining({ type: 'error' }));
            expect(sendCalloutMock.mock.calls[0][0].message.props.id).toBe('ui-inventory.communicationProblem');
          });
        });
      });

      /* TODO: Fix this. This test passes locally but fails on CI. */
      /*
      describe('should reset instances selection upon click on on reset all button', () => {
        beforeEach(async () => {
          const input = screen.getByLabelText('Search');

          fireEvent.change(input, { target: { value: '23' } });

          await waitFor(() => expect(screen.getByRole('button', { name: 'Reset all' })).not.toBeDisabled());
          userEvent.click(screen.getByRole('button', { name: 'Reset all' }));
        });

        it('should reset the selected state for the previously selected row', () => {
          expect(selectRowCheckboxes[0]).not.toBeChecked();
        });

        it('should hide selected rows count message in the subheader', () => {
          expect(document.querySelector('[data-test-custom-pane-sub]')).not.toBeInTheDocument();
        });
      });
      */
      describe('making previously selected items no longer displayed', () => {
        beforeEach(() => {
          renderWithIntl(
            <InstancesRouteSetup
              instances={[]}
              quickExportPOST={quickExportAPICallMock}
              sendCallout={sendCalloutMock}
            />,
            translationsProperties,
            renderWithIntlResult.rerender
          );
        });

        it('should have no results', () => {
          expect(document.querySelectorAll('#pane-results-content .mclRowContainer > [role=row]').length).toEqual(0);
        });

        it('should display selected rows count message in the sub header', () => {
          expect(screen.getByText('1 record selected')).toBeInTheDocument();
        });

        describe('making previously selected items displayed again', () => {
          beforeEach(() => {
            renderWithIntl(
              <InstancesRouteSetup
                quickExportPOST={quickExportAPICallMock}
                sendCallout={sendCalloutMock}
              />,
              translationsProperties,
              renderWithIntlResult.rerender
            );
          });

          it('should preserve the selected state for the previously selected row', () => {
            expect(selectRowCheckboxes[1]).toBeChecked();
          });

          it('should display selected rows count message in the sub header', () => {
            expect(screen.getByText('1 record selected')).toBeInTheDocument();
          });
        });
      });
    });
  });
});
