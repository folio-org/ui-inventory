import React from 'react';
import { Router } from 'react-router-dom';
import { noop } from 'lodash';
import { createMemoryHistory } from 'history';
import {
  waitFor,
  screen,
  fireEvent,
  within,
} from '@folio/jest-config-stripes/testing-library/react';

import '../../test/jest/__mock__';

import {
  StripesContext,
  ModuleHierarchyProvider,
  checkIfUserInCentralTenant,
} from '@folio/stripes/core';
import { renderWithIntl, translationsProperties } from '../../test/jest/helpers';

import { UpdateItemOwnershipModal } from '../components';
import ItemView from './ItemView';

jest.mock('../Item/ViewItem/ItemAcquisition', () => ({
  ItemAcquisition: jest.fn(() => 'ItemAcquisition'),
}));

jest.mock('../components', () => ({
  ...jest.requireActual('../components'),
  UpdateItemOwnershipModal: jest.fn(() => <span>UpdateItemOwnershipModal</span>),
}));

const mockPush = jest.fn();

const history = createMemoryHistory();
history.push = mockPush;

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
    requestOnItem: {
      replace: jest.fn(),
    },
    requests: {
      PUT: jest.fn(),
    },
  },
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
        },
      ],
    },
    instanceRecords: {
      hasLoaded: true,
      records: [
        {
          id: 1,
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
    loanTypes: {},
    okapi: {},
    location: {},
  },
  isInstanceShared: true,
};

const referenceTables = {
  itemNoteTypes: [],
  locationsById: {
    inactiveLocation: { name: 'Location 1', isActive: false },
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
  describe('rendering ItemView', () => {
    beforeEach(() => {
      console.error = jest.fn();
      renderWithIntl(<ItemViewSetup />, translationsProperties);
    });

    afterEach(() => {
      jest.clearAllMocks();
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

    it('should display the information icons', () => {
      expect(screen.getAllByTestId('info-icon-effective-call-number')[0]).toBeDefined();
      expect(screen.getAllByTestId('info-icon-shelving-order')[0]).toBeDefined();
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

    describe('Update ownership action item', () => {
      it('should be rendered', async () => {
        checkIfUserInCentralTenant.mockClear().mockReturnValue(false);
        renderWithIntl(<ItemViewSetup />, translationsProperties);

        const updateOwnershipBtn = await screen.findByText('Update ownership');
        expect(updateOwnershipBtn).toBeInTheDocument();
      });

      describe('when click on "Update onership"', () => {
        it('should render modal window', async () => {
          checkIfUserInCentralTenant.mockClear().mockReturnValue(false);
          renderWithIntl(<ItemViewSetup />, translationsProperties);

          const updateOwnershipBtn = await screen.findByText('Update ownership');
          fireEvent.click(updateOwnershipBtn);

          expect(screen.getByText('UpdateItemOwnershipModal')).toBeInTheDocument();
        });
      });

      describe('when submit updating ownership', () => {
        it('should render confirmation modal', async () => {
          checkIfUserInCentralTenant.mockClear().mockReturnValue(false);
          renderWithIntl(<ItemViewSetup />, translationsProperties);

          const updateOwnershipBtn = await screen.findByText('Update ownership');
          fireEvent.click(updateOwnershipBtn);

          UpdateItemOwnershipModal.mock.calls[0][0].handleSubmit('university', { id: 'locationId' }, 'holdingId');

          expect(screen.getByText('Update ownership of items')).toBeInTheDocument();
        });
      });

      describe('when confirm the action', () => {
        it('should render confirmation modal', async () => {
          checkIfUserInCentralTenant.mockClear().mockReturnValue(false);
          renderWithIntl(<ItemViewSetup />, translationsProperties);

          const updateOwnershipBtn = await screen.findByText('Update ownership');
          fireEvent.click(updateOwnershipBtn);

          UpdateItemOwnershipModal.mock.calls[0][0].handleSubmit({ id: 'university' }, { id: 'locationId' }, 'holdingId');

          const confirmationModal = screen.getByText('Update ownership of items');
          fireEvent.click(within(confirmationModal).getByText('confirm'));

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
          screen.debug();

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

            expect(document.querySelector('#cannotDeleteItemModal-label')).toBeInTheDocument();
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
          screen.debug();

          expect(screen.getByText('Confirm item status: Missing')).toBeInTheDocument();
        });

        describe('when confirm to mark item as missing', () => {
          it('should render confirmation modal', () => {
            checkIfUserInCentralTenant.mockClear().mockReturnValue(false);
            renderWithIntl(<ItemViewSetup />, translationsProperties);

            fireEvent.click(screen.getByText('Missing'));
            screen.debug();

            const confirmationModal = screen.getByRole('dialog');
            fireEvent.click(within(confirmationModal).getByText('Confirm'));

            expect(defaultProps.mutator.markItemAsMissing.POST).toHaveBeenCalled();
          });
        });
      });
    });
  });
});
