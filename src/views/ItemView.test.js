import React, { act } from 'react';
import { Router } from 'react-router-dom';
import { noop } from 'lodash';
import { createMemoryHistory } from 'history';
import {
  waitFor,
  screen,
  fireEvent,
  within,
} from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import { runAxeTest } from '@folio/stripes-testing';

import '../../test/jest/__mock__';

import {
  StripesContext,
  ModuleHierarchyProvider,
  checkIfUserInCentralTenant,
} from '@folio/stripes/core';
import { renderWithIntl, translationsProperties } from '../../test/jest/helpers';

import {
  useHoldingMutation,
  useUpdateOwnership,
  useAuditSettings,
} from '../hooks';
import { UpdateItemOwnershipModal } from '../components';
import ItemView from './ItemView';

jest.mock('@folio/stripes-components', () => ({
  ...jest.requireActual('@folio/stripes-components'),
  useVersionHistory: () => ({ versions: [], isLoadMoreVisible: true }),
}));

jest.mock('../Item/ViewItem/ItemAcquisition', () => ({
  ItemAcquisition: jest.fn(() => 'ItemAcquisition'),
}));

jest.mock('../components', () => ({
  ...jest.requireActual('../components'),
  UpdateItemOwnershipModal: jest.fn(() => <span>UpdateItemOwnershipModal</span>),
}));

jest.mock('../hooks', () => ({
  ...jest.requireActual('../hooks'),
  useHoldingMutation: jest.fn().mockReturnValue({ mutateHolding: jest.fn().mockResolvedValue({}) }),
  useUpdateOwnership: jest.fn().mockReturnValue({ updateOwnership: jest.fn() }),
  useAuditSettings: jest.fn().mockReturnValue({
    settings: [{
      key: 'enabled',
      value: true,
    }],
    isSettingsLoading: false,
  }),
}));

const mockMutate = jest.fn().mockResolvedValue({ json: () => ({ id: 'testId' }) });
const mockUpdateOwnership = jest.fn().mockResolvedValue({});
const mockPush = jest.fn();

const history = createMemoryHistory();
history.push = mockPush;

const spyOncollapseAllSections = jest.spyOn(require('@folio/stripes/components'), 'collapseAllSections');
const spyOnexpandAllSections = jest.spyOn(require('@folio/stripes/components'), 'expandAllSections');

const stripesStub = {
  connect: Component => <Component />,
  hasPerm: () => true,
  hasInterface: () => true,
  logger: { log: noop },
  locale: 'en-US',
  plugins: {},
  okapi: { tenant: 'college' },
  user: {
    user: {
      tenants: [{
        id: 'university',
        name: 'University',
      }],
    },
  },
};

const defaultProps = {
  mutator: {
    markItemAsMissing: {
      POST: jest.fn().mockResolvedValue({}),
    },
    markItemAsWithdrawn: {
      POST: jest.fn().mockResolvedValue({}),
    },
    requestOnItem: {
      replace: jest.fn(),
    },
    requests: {
      PUT: jest.fn(),
    },
  },
  goTo: jest.fn(),
  resources: {
    holdingsRecords: {
      hasLoaded: true,
      records: [
        {
          permanentLocationId: 1,
          temporaryLocationId: 'inactiveLocation',
        }
      ],
    },
    itemsResource: {
      hasLoaded: true,
      records: [
        {
          id: 'item1',
          status: {
            name: 'Available',
          },
          permanentLocation: {
            id: 'inactiveLocation',
            name: 'Location 1',
          },
          temporaryLocation: {
            id: 'inactiveLocation',
            name: 'Location 1',
          },
          effectiveLocation: {
            id: 'inactiveLocation',
            name: 'Location 1',
          },
          isBoundWith: true,
          boundWithTitles: [
            {
              'briefHoldingsRecord' : {
                'id' : '704ea4ec-456c-4740-852b-0814d59f7d21',
                'hrid' : 'BW-1',
              },
              'briefInstance' : {
                'id' : 'cd3288a4-898c-4347-a003-2d810ef70f03',
                'title' : 'Elpannan och dess ekonomiska förutsättningar / av Hakon Wærn',
                'hrid' : 'bwinst0001',
              },
            },
            {
              'briefHoldingsRecord' : {
                'id' : '704ea4ec-456c-4740-852b-0814d59f7d22',
                'hrid' : 'BW-2',
              },
              'briefInstance' : {
                'id' : 'cd3288a4-898c-4347-a003-2d810ef70f04',
                'title' : 'Second Title',
                'hrid' : 'bwinst0002',
              },
            },
          ],
          materialType: { name: 'book' },
          statisticalCodeIds: ['statisticalCodeId'],
          notes: [{ itemNoteTypeId: 'noteTypeId1' }],
          circulationNotes: [{ noteType: 'Check out' }],
        },
      ],
    },
    instanceRecords: {
      hasLoaded: true,
      records: [
        {
          id: 1,
          source: 'FOLIO',
        }
      ],
    },
    requests: {
      records: [{
        id: 'requestId',
        holdShelfExpirationDate: new Date().setDate(new Date().getDate() + 1),
        item: {
          status: 'Awaiting pickup',
        },
      }],
    },
    openLoans: {
      records: [{
        userId: 'userId',
        borrower: {
          barcode: 'testBarcode',
        },
        loanDate: new Date(),
        dueDate: new Date().setDate(new Date().getDate() + 1),
      }],
    },
    loanTypes: {},
    okapi: {},
    location: {},
  },
  isInstanceShared: true,
};

const referenceTables = {
  itemNoteTypes: [{ id: 'noteTypeId1', name: 'Note type name' }],
  locationsById: {
    inactiveLocation: { name: 'Location 1', isActive: false },
  },
  holdingsSourcesByName: {
    FOLIO: {
      id: 'folioId',
    },
  },
};

const ItemViewSetup = props => (
  <Router history={history}>
    <StripesContext.Provider value={stripesStub}>
      <ModuleHierarchyProvider module="@folio/inventory">
        <ItemView
          onCloseViewItem={noop}
          referenceTables={referenceTables}
          stripes={stripesStub}
          {...defaultProps}
          {...props}
        />
      </ModuleHierarchyProvider>
    </StripesContext.Provider>
  </Router>
);

describe('ItemView', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be rendered with no axe errors', async () => {
    const { container } = await act(() => renderWithIntl(<ItemViewSetup />, translationsProperties));

    await runAxeTest({ rootNode: container });
  }, 10000);

  describe('rendering ItemView', () => {
    beforeEach(() => {
      renderWithIntl(<ItemViewSetup />, translationsProperties);
    });

    it('should display item record with material type, status, and bound with in lower case in parentheses', () => {
      expect(screen.getByText('Item record (book, available, bound with)')).toBeInTheDocument();
    });

    it('should display a table of bound-with items', () => {
      expect(document.querySelector('#item-list-bound-with-titles')).toBeInTheDocument();
    });

    it('should list 2 bound-with items in the table', () => {
      expect(document.querySelectorAll('#item-list-bound-with-titles .mclRowContainer > [role=row]').length).toEqual(2);
    });

    it('should link to the instance view from the instance HRID', () => {
      const id = defaultProps.resources.itemsResource.records[0].boundWithTitles[0].briefInstance.id;
      expect(document.querySelector('#item-list-bound-with-titles a.instanceHrid'))
        .toHaveAttribute('href', '/inventory/view/' + id);
    });

    it('should link to the holdings view from the holdings HRID', () => {
      const instanceId = defaultProps.resources.itemsResource.records[0].boundWithTitles[0].briefInstance.id;
      const holdingsRecordId = defaultProps.resources.itemsResource.records[0].boundWithTitles[0].briefHoldingsRecord.id;
      expect(document.querySelector('#item-list-bound-with-titles a.holdingsRecordHrid'))
        .toHaveAttribute('href', '/inventory/view/' + instanceId + '/' + holdingsRecordId);
    });

    it('should display "inactive" by an inactive holding permanent location', async () => {
      await waitFor(() => {
        const location = document.querySelector('*[data-testid=holding-permanent-location]').innerHTML;
        expect(location).toContain('Inactive');
      });
    });

    it('should display "inactive" by an inactive holding temporary location', async () => {
      await waitFor(() => {
        const location = document.querySelector('*[data-testid=holding-temporary-location]').innerHTML;
        expect(location).toContain('Inactive');
      });
    });

    it('should display "inactive" by an inactive item permanent location', async () => {
      await waitFor(() => {
        const location = document.querySelector('*[data-testid=item-permanent-location]').innerHTML;
        expect(location).toContain('Inactive');
      });
    });

    it('should display "inactive" by an inactive item temporary location', async () => {
      await waitFor(() => {
        const location = document.querySelector('*[data-testid=item-temporary-location]').innerHTML;
        expect(location).toContain('Inactive');
      });
    });

    it('should display "inactive" by an inactive item effective location', async () => {
      await waitFor(() => {
        const location = document.querySelector('*[data-testid=item-effective-location]').innerHTML;
        expect(location).toContain('Inactive');
      });
    });

    describe('when close view page', () => {
      it('should call the function to redirect user to instance page', () => {
        checkIfUserInCentralTenant.mockClear().mockReturnValue(false);
        renderWithIntl(<ItemViewSetup />, translationsProperties);

        fireEvent.click(document.querySelector('[aria-label="Close "]'));

        expect(mockPush).toHaveBeenCalled();
      });
    });
  });

  describe('Version history component', () => {
    let versionHistoryButton;

    beforeEach(() => {
      const { container } = renderWithIntl(<ItemViewSetup />, translationsProperties);

      versionHistoryButton = container.querySelector('#version-history-btn');
    });

    it('should render version history button', () => {
      expect(versionHistoryButton).toBeInTheDocument();
    });

    describe('when click the button', () => {
      beforeEach(async () => {
        await userEvent.click(versionHistoryButton);
      });

      it('should hide action menu', () => {
        expect(screen.queryByText('Actions')).not.toBeInTheDocument();
      });

      it('should disable version history button', () => {
        expect(screen.getByRole('button', { name: /version history/i })).toBeDisabled();
      });

      it('should render version history pane', () => {
        expect(screen.getByRole('region', { name: /version history/i })).toBeInTheDocument();
      });
    });

    describe('when click the close button', () => {
      it('should hide the pane', async () => {
        await userEvent.click(versionHistoryButton);

        const versionHistoryPane = await screen.findByRole('region', { name: /version history/i });
        expect(versionHistoryPane).toBeInTheDocument();

        const closeButton = await within(versionHistoryPane).findByRole('button', { name: /close/i });
        await userEvent.click(closeButton);

        expect(screen.queryByRole('region', { name: /version history/i })).not.toBeInTheDocument();
      });
    });
  });

  describe('when version history is disabled', () => {
    it('should not show the version history button', () => {
      useAuditSettings.mockClear().mockReturnValue({
        settings: [{
          key: 'enabled',
          value: false,
        }],
        isSettingsLoading: false,
      });

      renderWithIntl(<ItemViewSetup />, translationsProperties);

      expect(screen.queryByRole('button', { name: /version history/i })).not.toBeInTheDocument();
    });
  });

  describe('action menu', () => {
    it('should be suppressed for consortial central tenant', () => {
      checkIfUserInCentralTenant.mockClear().mockReturnValue(true);
      renderWithIntl(<ItemViewSetup />, translationsProperties);

      expect(screen.queryByRole('button', { name: 'Actions' })).not.toBeInTheDocument();
    });

    describe('"Edit" action item', () => {
      it('should be rendered', () => {
        checkIfUserInCentralTenant.mockClear().mockReturnValue(false);
        renderWithIntl(<ItemViewSetup />, translationsProperties);

        expect(screen.getByRole('button', { name: 'edit' })).toBeInTheDocument();
      });

      describe('when click on "Edit"', () => {
        it('should call the function to redirect user to edit page', () => {
          checkIfUserInCentralTenant.mockClear().mockReturnValue(false);
          renderWithIntl(<ItemViewSetup />, translationsProperties);

          fireEvent.click(screen.getByText('Edit'));

          expect(mockPush).toHaveBeenCalled();
        });
      });
    });

    describe('"Update ownership" action item', () => {
      describe('when confirm the action', () => {
        it('should call the method to update ownership of item', () => {
          useHoldingMutation.mockClear().mockReturnValue({ mutateHolding: mockMutate });
          useUpdateOwnership.mockClear().mockReturnValue({ updateOwnership: mockUpdateOwnership });
          checkIfUserInCentralTenant.mockClear().mockReturnValue(false);

          renderWithIntl(<ItemViewSetup />, translationsProperties);

          const updateOwnershipBtn = screen.getByText('Update ownership');
          fireEvent.click(updateOwnershipBtn);

          act(() => UpdateItemOwnershipModal.mock.calls[0][0].handleSubmit('university', { id: 'locationId' }, 'holdingId'));

          const confirmationModal = screen.getByText('Update ownership of items');
          fireEvent.click(within(confirmationModal).getByText('confirm'));

          expect(mockUpdateOwnership).toHaveBeenCalledWith({
            itemIds: [defaultProps.resources.itemsResource.records[0].id],
            targetTenantId: 'university',
            toHoldingsRecordId: 'holdingId',
          });
        });

        it('should display Linked order lines modal', async () => {
          renderWithIntl(
            <ItemViewSetup
              resources={{
                ...defaultProps.resources,
                itemsResource: {
                  ...defaultProps.resources.itemsResource,
                  records: [{
                    ...defaultProps.resources.itemsResource.records[0],
                    purchaseOrderLineIdentifier: 'POL-1',
                  }]
                },
              }}
            />, translationsProperties
          );

          const updateOwnershipBtn = await screen.findByText('Update ownership');
          fireEvent.click(updateOwnershipBtn);

          const hasLocalPOLMessage = await screen.findByText('Linked order line');
          expect(hasLocalPOLMessage).toBeInTheDocument();

          fireEvent.click(screen.getByRole('button', { name: /continue/i }));
          expect(screen.queryByText('Linked order line')).not.toBeInTheDocument();
        });

        describe('when error was occured due to local-specific reference data', () => {
          it('should show an error message', async () => {
            useHoldingMutation.mockClear().mockReturnValue({ mutateHolding: mockMutate });
            useUpdateOwnership.mockClear().mockReturnValue({
              updateOwnership: jest.fn().mockRejectedValue({
                response: {
                  status: 400,
                }
              })
            });
            checkIfUserInCentralTenant.mockClear().mockReturnValue(false);

            renderWithIntl(<ItemViewSetup />, translationsProperties);

            const updateOwnershipBtn = screen.getByText('Update ownership');
            fireEvent.click(updateOwnershipBtn);

            act(() => UpdateItemOwnershipModal.mock.calls[0][0].handleSubmit('university', { id: 'locationId' }, 'holdingId'));

            const confirmationModal = screen.getByText('Update ownership of items');
            fireEvent.click(within(confirmationModal).getByText('confirm'));

            await waitFor(() => expect(screen.queryByText('Item ownership could not be updated because the record contains local-specific reference data.')).toBeDefined());
          });
        });

        describe('when error was occured', () => {
          it('should show an error message', async () => {
            useHoldingMutation.mockClear().mockReturnValue({ mutateHolding: mockMutate });
            useUpdateOwnership.mockClear().mockReturnValue({
              updateOwnership: jest.fn().mockRejectedValue({
                response: {
                  status: 500,
                },
              })
            });
            checkIfUserInCentralTenant.mockClear().mockReturnValue(false);

            renderWithIntl(<ItemViewSetup />, translationsProperties);

            const updateOwnershipBtn = screen.getByText('Update ownership');
            fireEvent.click(updateOwnershipBtn);

            act(() => UpdateItemOwnershipModal.mock.calls[0][0].handleSubmit('university', { id: 'locationId' }, 'holdingId'));

            const confirmationModal = screen.getByText('Update ownership of items');
            fireEvent.click(within(confirmationModal).getByText('confirm'));

            await waitFor(() => expect(screen.queryByText('Server communication problem. Please try again')).toBeDefined());
          });
        });
      });

      describe('when cancel the action', () => {
        it('should hide confirmation modal', () => {
          checkIfUserInCentralTenant.mockClear().mockReturnValue(false);
          renderWithIntl(<ItemViewSetup />, translationsProperties);

          const updateOwnershipBtn = screen.getByText('Update ownership');
          fireEvent.click(updateOwnershipBtn);

          act(() => UpdateItemOwnershipModal.mock.calls[0][0].handleSubmit('university', { id: 'locationId' }, 'holdingId'));

          const confirmationModal = screen.getByText('Update ownership of items');
          fireEvent.click(within(confirmationModal).getByText('cancel'));

          expect(document.querySelector('#update-ownership-modal')).not.toBeInTheDocument();
        });
      });
    });

    describe('"Duplicate" action item', () => {
      it('should be rendered', () => {
        checkIfUserInCentralTenant.mockClear().mockReturnValue(false);
        renderWithIntl(<ItemViewSetup />, translationsProperties);

        expect(screen.getByText('Duplicate')).toBeInTheDocument();
      });

      describe('when click on "Duplicate"', () => {
        it('should call the function to redirect user to duplicate page', () => {
          checkIfUserInCentralTenant.mockClear().mockReturnValue(false);
          renderWithIntl(<ItemViewSetup />, translationsProperties);

          fireEvent.click(screen.getByText('Duplicate'));

          expect(mockPush).toHaveBeenCalled();
        });
      });
    });

    describe('"Delete" action item', () => {
      it('should be rendered', () => {
        checkIfUserInCentralTenant.mockClear().mockReturnValue(false);
        renderWithIntl(<ItemViewSetup />, translationsProperties);

        expect(screen.getByText('Delete')).toBeInTheDocument();
      });

      describe('when click on "Delete"', () => {
        describe('and status of item is on order', () => {
          it('should render modal that user can\'t delete the item', () => {
            checkIfUserInCentralTenant.mockClear().mockReturnValue(false);
            renderWithIntl(<ItemViewSetup />, translationsProperties);

            fireEvent.click(screen.getByText('Delete'));

            expect(document.querySelector('#cannotDeleteItemModal')).toBeInTheDocument();
          });

          describe('when close the modal', () => {
            it('should be closed', () => {
              checkIfUserInCentralTenant.mockClear().mockReturnValue(false);
              renderWithIntl(<ItemViewSetup />, translationsProperties);

              fireEvent.click(screen.getByText('Delete'));
              fireEvent.click(screen.getByText('Back'));

              expect(document.querySelector('#cannotDeleteItemModal-label')).not.toBeInTheDocument();
            });
          });
        });
      });
    });

    describe('"Mark as missing" action item', () => {
      it('should be rendered', () => {
        checkIfUserInCentralTenant.mockClear().mockReturnValue(false);
        renderWithIntl(<ItemViewSetup />, translationsProperties);

        expect(screen.getByText('Missing')).toBeInTheDocument();
      });

      describe('when click on "Mark as missing"', () => {
        it('should render confirmation modal', () => {
          checkIfUserInCentralTenant.mockClear().mockReturnValue(false);
          renderWithIntl(<ItemViewSetup />, translationsProperties);

          fireEvent.click(screen.getByText('Missing'));

          expect(screen.getByText('Confirm item status: Missing')).toBeInTheDocument();
        });

        describe('when confirm to mark item as missing', () => {
          it('should render confirmation modal', () => {
            checkIfUserInCentralTenant.mockClear().mockReturnValue(false);
            renderWithIntl(<ItemViewSetup />, translationsProperties);

            fireEvent.click(screen.getByText('Missing'));

            const confirmationModal = screen.getByTestId('missing-confirmation-modal');
            fireEvent.click(within(confirmationModal).getByText('Confirm'));

            expect(defaultProps.mutator.markItemAsMissing.POST).toHaveBeenCalled();
          });
        });
      });
    });

    describe('"Mark as withdrawn" action item', () => {
      it('should be rendered', () => {
        checkIfUserInCentralTenant.mockClear().mockReturnValue(false);
        renderWithIntl(<ItemViewSetup />, translationsProperties);

        expect(screen.getByText('Withdrawn')).toBeInTheDocument();
      });

      describe('when click on "Mark as withdrawn"', () => {
        it('should render confirmation modal', () => {
          checkIfUserInCentralTenant.mockClear().mockReturnValue(false);
          renderWithIntl(<ItemViewSetup />, translationsProperties);

          fireEvent.click(screen.getByText('Withdrawn'));

          expect(screen.getByText('Confirm item status: Withdrawn')).toBeInTheDocument();
        });

        describe('when confirm to mark item as withdrawn', () => {
          it('should render confirmation modal', async () => {
            checkIfUserInCentralTenant.mockClear().mockReturnValue(false);
            renderWithIntl(<ItemViewSetup />, translationsProperties);

            fireEvent.click(screen.getByText('Withdrawn'));

            const confirmationModal = screen.getByTestId('withdrawn-confirmation-modal');
            fireEvent.click(within(confirmationModal).getByText('Confirm'));

            expect(defaultProps.mutator.markItemAsWithdrawn.POST).toHaveBeenCalled();
          });
        });
      });
    });
  });

  describe('Tests for shortcut of HasCommand', () => {
    it('onClickEditItem function to be triggered on clicking edit button', () => {
      renderWithIntl(<ItemViewSetup />, translationsProperties);
      fireEvent.click(screen.getByRole('button', { name: 'edit' }));
      expect(mockPush).toHaveBeenCalled();
    });

    it('onCopy function to be triggered on clicking duplicateRecord button', () => {
      renderWithIntl(<ItemViewSetup />, translationsProperties);
      fireEvent.click(screen.getByRole('button', { name: 'duplicateRecord' }));
      expect(mockPush).toHaveBeenCalled();
    });

    it('collapseAllSections triggered on clicking collapseAllSections button', () => {
      renderWithIntl(<ItemViewSetup />, translationsProperties);
      fireEvent.click(screen.getByRole('button', { name: 'collapseAllSections' }));
      expect(spyOncollapseAllSections).toHaveBeenCalled();
    });

    it('expandAllSections triggered on clicking expandAllSections button', () => {
      renderWithIntl(<ItemViewSetup />, translationsProperties);
      fireEvent.click(screen.getByRole('button', { name: 'expandAllSections' }));
      expect(spyOnexpandAllSections).toHaveBeenCalled();
    });

    it('goTo triggered on clicking search button', () => {
      renderWithIntl(<ItemViewSetup />, translationsProperties);
      fireEvent.click(screen.getByRole('button', { name: 'search' }));
      expect(defaultProps.goTo).toHaveBeenCalled();
    });
  });
});
