import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import {
  screen,
  getByText,
  getByRole,
  getAllByRole,
  fireEvent,
  waitForElementToBeRemoved,
  waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { noop } from 'lodash';

import '../../test/jest/__mock__';

import { CalloutContext } from '@folio/stripes-core';
import { StripesContext } from '@folio/stripes-core/src/StripesContext';
import { ModuleHierarchyProvider } from '@folio/stripes-core/src/components/ModuleHierarchy';

import {
  Layer,
  Paneset
} from '@folio/stripes/components';

import renderWithIntl from '../../test/jest/helpers/renderWithIntl';
import OverlayContainer from '../../test/helpers/OverlayContainer';
import translationsProperties from '../../test/jest/helpers/translationsProperties';
import { instances as instancesFixture } from '../../test/fixtures/instances';
import { QUICK_EXPORT_LIMIT } from '../constants';
import { DataContext } from '../contexts';
import InstancesRoute from './InstancesRoute';

const stripesStub = {
  connect: Component => <Component />,
  hasPerm: () => true,
  hasInterface: () => true,
  logger: { log: noop },
  locale: 'en-US',
  plugins: {},
};

const InstancesRouteSetup = ({
  instances = instancesFixture,
  sendCallout = noop,
  quickExportPOST = noop,
} = {}) => (
  <Router>
    <StripesContext.Provider value={stripesStub}>
      <CalloutContext.Provider value={{ sendCallout }}>
        <ModuleHierarchyProvider value={['@folio/inventory']}>
          <DataContext.Provider value={{
            contributorTypes: [],
            instanceTypes: [],
            locations: [],
            instanceFormats: [],
            modesOfIssuance: [],
            natureOfContentTerms: [],
            tagsRecords: [],
          }}
          >
            <Paneset>
              <Layer
                isOpen
                contentLabel="label"
              >
                <OverlayContainer />
                <InstancesRoute
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
                    resultCount: instances.length,
                    resultOffset: 0,
                  }}
                  mutator={{
                    quickExport: { POST: quickExportPOST },
                    resultCount: { replace: noop },
                  }}
                />
              </Layer>
            </Paneset>
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
      expect(document.querySelectorAll('#pane-results-content .mclRowContainer > [role=row]').length).toEqual(3);
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
        userEvent.click(screen.getByRole('button', { name: 'Actions' }));
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

    describe('selecting rows so the quick export limit is exceed', () => {
      let selectRowCheckboxes;

      beforeEach(() => {
        selectRowCheckboxes = screen.getAllByRole('checkbox', { name: 'Select instance' });

        userEvent.click(selectRowCheckboxes[0]);
        userEvent.click(selectRowCheckboxes[1]);
        userEvent.click(selectRowCheckboxes[2]);

        userEvent.click(screen.getByRole('button', { name: 'Actions' }));
      });

      it('should display quick export limit warning', () => {
        expect(screen.queryByText(`Selected record limit of ${QUICK_EXPORT_LIMIT} exceeded`)).toBeInTheDocument();
      });

      it('should disable export instances (MARC) action button', () => {
        expect(screen.getByRole('button', { name: 'Export instances (MARC)' })).toBeDisabled();
      });
    });

    describe('selecting row', () => {
      let selectRowCheckboxes;

      beforeEach(() => {
        selectRowCheckboxes = screen.getAllByRole('checkbox', { name: 'Select instance' });

        userEvent.click(selectRowCheckboxes[0]);
      });

      it('should display checked select row checkbox', () => {
        expect(selectRowCheckboxes[0]).toBeChecked();
      });

      it('should display selected rows count message in the sub header', () => {
        expect(screen.getByText('1 record selected')).toBeInTheDocument();
      });

      describe('selecting one more row and clicking on show selected records action button', () => {
        beforeEach(() => {
          userEvent.click(selectRowCheckboxes[1]);
          userEvent.click(screen.getByRole('button', { name: 'Actions' }));
          userEvent.click(screen.getByRole('button', { name: 'Show selected records' }));
        });

        it('should open selected records modal', () => {
          expect(screen.getByRole('document', { label: 'Selected records' })).toBeInTheDocument();
        });

        it('should have correct heading', () => {
          expect(screen.getByRole('heading', { name: 'Selected records' })).toBeInTheDocument();
        });

        it('should display correct amount of records in modal', () => {
          const modal = screen.getByRole('document', { label: 'Selected records' });

          expect(modal.querySelectorAll('.mclRowContainer > [role=row]').length).toEqual(2);
        });

        it('should display correct data in list', () => {
          const modal = screen.getByRole('document', { label: 'Selected records' });
          const row = modal.querySelector('.mclRowContainer > [role=row]');
          const cells = getAllByRole(row, 'gridcell');

          expect(getByRole(cells[0], 'checkbox', { name: 'Select instance' })).toBeVisible();
          expect(getByText(cells[1], '#youthaction')).toBeVisible();
          expect(getByText(cells[2], 'Kirshner, Benjamin ; Middaugh, Ellen')).toBeVisible();
          expect(getByText(cells[3], 'Information Age Publishing, Inc. (2015)')).toBeVisible();
        });

        it('should have all rows selected', () => {
          const modal = screen.getByRole('document', { label: 'Selected records' });
          const selectRowCheckboxesInModal = getAllByRole(modal, 'checkbox', { name: 'Select instance' });

          selectRowCheckboxesInModal.forEach(checkbox => expect(checkbox).toBeChecked());
        });

        describe('unselecting rows in the modal', () => {
          beforeEach(() => {
            const modal = screen.getByRole('document', { label: 'Selected records' });
            const selectRowCheckboxesInModal = getAllByRole(modal, 'checkbox', { name: 'Select instance' });

            selectRowCheckboxesInModal.forEach(userEvent.click);
          });

          it('should preserve the selected state for the corresponding rows in the results list after close of the modal upon click on cancel button', async () => {
            userEvent.click(screen.getByRole('button', { name: 'Cancel' }));

            await waitForElementToBeRemoved(() => screen.getByRole('document', { label: 'Selected records' }));

            expect(selectRowCheckboxes[0]).toBeChecked();
            expect(selectRowCheckboxes[1]).toBeChecked();
          });

          it('should unselect corresponding rows in the results list after close of the modal upon click on save button', async () => {
            userEvent.click(screen.getByRole('button', { name: 'Save & close' }));

            await waitForElementToBeRemoved(() => screen.getByRole('document', { label: 'Selected records' }));

            expect(selectRowCheckboxes[0]).not.toBeChecked();
            expect(selectRowCheckboxes[1]).not.toBeChecked();
          });
        });
      });

      describe('selecting more than one row', () => {
        beforeEach(() => {
          userEvent.click(selectRowCheckboxes[1]);
        });

        it('should display selected rows count message (plural form) in the sub header', () => {
          expect(screen.getByText('2 records selected')).toBeInTheDocument();
        });

        it('should not initiate display of error callout and make an API call upon click on export instances (MARC) button', () => {
          userEvent.click(screen.getByRole('button', { name: 'Actions' }));
          userEvent.click(screen.getByRole('button', { name: 'Export instances (MARC)' }));

          expect(quickExportAPICallMock).toBeCalled();
          expect(sendCalloutMock).not.toBeCalled();
        });

        it('should initiate display of error callout and make an API call upon click on export instances (MARC) button with API request set up to fail', async () => {
          quickExportAPICallMock.mockImplementationOnce(Promise.reject.bind(Promise));
          userEvent.click(screen.getByRole('button', { name: 'Actions' }));
          userEvent.click(screen.getByRole('button', { name: 'Export instances (MARC)' }));

          expect(quickExportAPICallMock).toBeCalled();

          await waitFor(() => {
            expect(sendCalloutMock).toBeCalledWith(expect.objectContaining({ type: 'error' }));
            expect(sendCalloutMock.mock.calls[0][0].message.props.id).toBe('ui-inventory.communicationProblem');
          });
        });
      });

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
            expect(selectRowCheckboxes[0]).toBeChecked();
          });

          it('should display selected rows count message in the sub header', () => {
            expect(screen.getByText('1 record selected')).toBeInTheDocument();
          });
        });
      });
    });
  });
});
