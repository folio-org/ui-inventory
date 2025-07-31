import React, { act } from 'react';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';
import { MemoryRouter } from 'react-router-dom';
import { createMemoryHistory } from 'history';

import {
  screen,
  fireEvent,
  waitFor,
  within,
} from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';

import { checkIfUserInMemberTenant } from '@folio/stripes/core';
import { FindLocation } from '@folio/stripes-acq-components';

import '../test/jest/__mock__';
import buildStripes from '../test/jest/__mock__/stripesCore.mock';
import {
  renderWithIntl,
  translationsProperties,
} from '../test/jest/helpers';

import ViewHoldingsRecord from './ViewHoldingsRecord';

jest.mock('./Holding/ViewHolding/HoldingReceivingHistory/useReceivingHistory', () => jest.fn(() => ({
  isFetching: false,
  receivingHistory: [],
})));

const mockPush = jest.fn();

const history = createMemoryHistory();
history.push = mockPush;

jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  FindLocation: jest.fn(() => <span>FindLocation</span>),
}));

jest.mock('@folio/stripes-components', () => ({
  ...jest.requireActual('@folio/stripes-components'),
  useVersionHistory: () => ({ versions: [], isLoadMoreVisible: true }),
}));

jest.mock('./hocs', () => ({
  ...jest.requireActual('./hocs'),
  withLocation: jest.fn(c => c),
}));

jest.mock('./common', () => ({
  ...jest.requireActual('./common'),
  useTenantKy: jest.fn(),
}));

jest.mock('./utils', () => ({
  ...jest.requireActual('./utils'),
  switchAffiliation: jest.fn(() => mockPush()),
  updateOwnership: jest.fn(),
}));

const spyOncollapseAllSections = jest.spyOn(require('@folio/stripes/components'), 'collapseAllSections');
const spyOnexpandAllSections = jest.spyOn(require('@folio/stripes/components'), 'expandAllSections');

const mockData = jest.fn().mockResolvedValue({ id: 'testId' });
const mockGoTo = jest.fn();
const mockOnUpdateOwnership = jest.fn().mockResolvedValue({});

const permissions = {
  FOLIO_CREATE: 'ui-inventory.holdings.create',
  FOLIO_EDIT: 'ui-inventory.holdings.edit',
  FOLIO_DELETE: 'ui-inventory.holdings.delete',
  MARC_VIEW: 'ui-quick-marc.quick-marc-holdings-editor.view',
  MARC_ALL: 'ui-quick-marc.quick-marc-holdings-editor.all',
};

const defaultProps = {
  id: 'id',
  goTo: mockGoTo,
  onUpdateOwnership: mockOnUpdateOwnership,
  holdingsrecordid: 'holdingId',
  referenceTables: {
    holdingsSources: [{ id: 'MARC', name: 'MARC' }, { id: 'FOLIO', name: 'FOLIO' }],
    locationsById: {
      inactiveLocation: { name: 'Location 1', isActive: false },
    },
  },
  resources: {
    holdingsRecords: {
      records: [
        {
          sourceId: 'MARC',
          temporaryLocationId: 'inactiveLocation',
          id: 'holdingId',
          instanceId: 'instanceId',
          _version: 1,
        }
      ],
    },
    instances1: { records: [{ id: 'instanceId' }], hasLoaded: true },
    permanentLocation: { hasLoaded: true },
    temporaryLocation: { hasLoaded: true },
    boundWithParts: { records: [{ itemId: '9e8dc8ce-68f3-4e75-8479-d548ce521157' }], hasLoaded: true },
  },
  mutator: {
    instances1: {
      GET: jest.fn(() => Promise.resolve({ id: 'instanceId', source: 'testSource' })),
      reset: jest.fn(() => Promise.resolve()),
    },
    holdingsRecords: {
      GET: jest.fn(() => Promise.resolve({ hrid: 'hrid' })),
      POST: jest.fn(() => Promise.resolve()),
      PUT: jest.fn(() => Promise.resolve()),
      DELETE: jest.fn(() => Promise.resolve()),
      reset: jest.fn(() => Promise.resolve()),
    },
    marcRecord: {
      GET: mockData,
      DELETE: jest.fn(() => Promise.resolve()),
    },
    marcRecordId: {
      replace: jest.fn(),
    },
    orderLine: {
      GET: jest.fn(() => Promise.resolve({ id: 'orderLineId' })),
    },
    permanentLocationQuery: {},
    temporaryLocationQuery: {},
    query: {},
  },
  stripes: buildStripes(),
  history,
  location: {
    search: '/',
    pathname: 'pathname',
    state: {
      tenantTo: 'testTenantToId',
      tenantFrom: 'testTenantFromId',
    }
  },
  initialTenantId: 'initialTenantId',
  isVersionHistoryEnabled: true,
};

const resourcesFolioProp = {
  ...defaultProps.resources,
  holdingsRecords: {
    records: [
      {
        sourceId: 'FOLIO',
        temporaryLocationId: 'inactiveLocation',
        id: 'holdingId',
        _version: 1,
      }
    ],
  },
};

const queryClient = new QueryClient();

const renderViewHoldingsRecord = (props = {}) => renderWithIntl(
  <QueryClientProvider client={queryClient}>
    <MemoryRouter>
      <ViewHoldingsRecord
        {...defaultProps}
        {...props}
      />,
    </MemoryRouter>
  </QueryClientProvider>,
  translationsProperties
);

describe('ViewHoldingsRecord actions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render Loading when awaiting resource', () => {
    const { getByText } = renderViewHoldingsRecord({ referenceTables: {} });

    expect(getByText('LoadingView')).toBeDefined();
  });

  it('should close view holding page', async () => {
    renderViewHoldingsRecord();

    const confirmButtons = await screen.findAllByRole('button', { name: 'confirm' });
    fireEvent.click(confirmButtons[0]);

    expect(mockPush).toHaveBeenCalled();
  });

  it('should translate to edit holding form page', async () => {
    renderViewHoldingsRecord();

    const editHoldingBtn = await screen.findByRole('button', { name: 'edit' });
    fireEvent.click(editHoldingBtn);

    expect(mockPush).toHaveBeenCalled();
  });

  it('should translate to duplicate holding form page', async () => {
    renderViewHoldingsRecord();

    const duplicatHoldingBtn = await screen.findByRole('button', { name: 'duplicateRecord' });
    fireEvent.click(duplicatHoldingBtn);

    expect(mockPush).toHaveBeenCalled();
  });

  it('should display "inactive" by an inactive temporary location', async () => {
    await act(async () => { renderViewHoldingsRecord(); });

    const tempLocation = document.querySelector('*[data-test-id=temporary-location]').innerHTML;

    expect(tempLocation).toContain('Inactive');
  });

  describe('Action menu', () => {
    describe('when user is in central tenant', () => {
      it('should suppress action menu', async () => {
        const { queryByText } = renderViewHoldingsRecord({
          stripes: {
            ...buildStripes({ okapi: { tenant: 'consortia' } }),
          },
        });

        await waitFor(() => expect(queryByText('Actions')).not.toBeInTheDocument());
      });
    });

    describe('when user is in member tenant', () => {
      it('should show action menu', async () => {
        const { getByText } = renderViewHoldingsRecord({
          stripes: {
            ...buildStripes({ okapi: { tenant: 'member' } }),
          },
        });

        await waitFor(() => expect(getByText('Actions')).toBeInTheDocument());
      });
    });

    describe('when source is MARC', () => {
      it('should enable View Source and Edit in quickMARC buttons', async () => {
        const {
          getByText,
          getByRole,
        } = renderViewHoldingsRecord({
          stripes: {
            ...buildStripes({ okapi: { tenant: 'member' } }),
          },
        });

        await waitFor(() => getByText('Actions'));
        fireEvent.click(getByText('Actions'));

        await waitFor(() => expect(getByRole('button', { name: 'View source' })).toBeEnabled());
        await waitFor(() => expect(getByRole('button', { name: 'Edit in quickMARC' })).toBeEnabled());
      });
    });
  });

  describe('when clicking Edit button', () => {
    it('should trigger "onEditHolding" function', async () => {
      const data = {
        pathname: `/inventory/edit/${defaultProps.id}/${defaultProps.holdingsrecordid}`,
        search: defaultProps.location.search,
        state: {
          backPathname: defaultProps.location.pathname,
          initialTenantId: 'initialTenantId',
        },
      };
      renderViewHoldingsRecord();

      fireEvent.click(await screen.findByRole('button', { name: 'edit' }));

      expect(mockPush).toHaveBeenCalledWith(data);
    });
  });

  describe('when clicking Search button', () => {
    it('should trigger "goTo" function', async () => {
      renderViewHoldingsRecord();

      fireEvent.click(await screen.findByRole('button', { name: 'search' }));

      expect(defaultProps.goTo).toHaveBeenCalledWith('/inventory');
    });
  });

  describe('when clicking Duplicate record button', () => {
    it('should call "onCopyHolding" function', async () => {
      const data = {
        pathname: `/inventory/copy/${defaultProps.id}/${defaultProps.holdingsrecordid}`,
        search: defaultProps.location.search,
        state: {
          backPathname: defaultProps.location.pathname,
          tenantFrom: 'diku',
          initialTenantId: 'initialTenantId',
        },
      };

      renderViewHoldingsRecord();

      fireEvent.click(await screen.findByRole('button', { name: 'duplicateRecord' }));

      expect(mockPush).toHaveBeenCalledWith(data);
    });
  });

  describe('when clicking Collapse all sections button', () => {
    it('should call collapseAllSections', async () => {
      renderViewHoldingsRecord();

      fireEvent.click(await screen.findByRole('button', { name: 'collapseAllSections' }));

      expect(spyOncollapseAllSections).toHaveBeenCalled();
    });
  });

  describe('when clicking Expand all sections button', () => {
    it('expandAllSections triggered on clicking expandAllSections button', async () => {
      await act(async () => { renderViewHoldingsRecord(); });

      fireEvent.click(await screen.findByRole('button', { name: 'expandAllSections' }));

      expect(spyOnexpandAllSections).toHaveBeenCalled();
    });
  });

  describe('when using an editMARC shortcut', () => {
    it('should redirect to marc edit page', async () => {
      await act(async () => { renderViewHoldingsRecord(); });

      fireEvent.click(screen.getByRole('button', { name: 'editMARC' }));

      expect(mockGoTo).toHaveBeenLastCalledWith(`/inventory/quick-marc/edit-holdings/instanceId/${defaultProps.holdingsrecordid}?%2F=&relatedRecordVersion=1`);
    });
  });

  describe('when source is MARC', () => {
    describe('and user has FOLIO record permissions', () => {
      const assignedPerms = [permissions.FOLIO_CREATE];

      it('should render the action menu', () => {
        const { queryByText } = renderViewHoldingsRecord({
          stripes: {
            ...buildStripes({
              hasPerm: (perm) => assignedPerms.includes(perm),
            }),
          },
        });

        waitFor(() => expect(queryByText('Actions')).toBeInTheDocument());
      });
    });

    describe('and user has MARC record permissions', () => {
      const assignedPerms = [permissions.MARC_ALL];

      it('should render the action menu', () => {
        const { queryByText } = renderViewHoldingsRecord({
          stripes: {
            ...buildStripes({
              hasPerm: (perm) => assignedPerms.includes(perm),
            }),
          },
        });

        waitFor(() => expect(queryByText('Actions')).toBeInTheDocument());
      });
    });

    describe('and user does not have any record permissions', () => {
      it('should not render the action menu', () => {
        const { queryByText } = renderViewHoldingsRecord({
          stripes: {
            ...buildStripes({
              hasPerm: () => false,
            }),
          },
        });

        waitFor(() => expect(queryByText('Actions')).not.toBeInTheDocument());
      });
    });
  });

  describe('when source is FOLIO', () => {
    describe('and user has FOLIO record permissions', () => {
      const assignedPerms = [permissions.FOLIO_CREATE];

      it('should render the action menu', () => {
        const { queryByText } = renderViewHoldingsRecord({
          resources: resourcesFolioProp,
          stripes: {
            ...buildStripes({
              hasPerm: (perm) => assignedPerms.includes(perm),
            }),
          },
        });

        waitFor(() => expect(queryByText('Actions')).toBeInTheDocument());
      });
    });

    describe('and user does not have FOLIO record permissions', () => {
      it('should not render the action menu', () => {
        const { queryByText } = renderViewHoldingsRecord({
          resources: resourcesFolioProp,
          stripes: {
            ...buildStripes({
              hasPerm: () => false,
            }),
          },
        });

        waitFor(() => expect(queryByText('Actions')).toBeInTheDocument());
      });
    });
  });

  describe('Update ownership action item', () => {
    beforeEach(() => {
      checkIfUserInMemberTenant.mockClear().mockReturnValue(true);
    });

    const targetTenantId = 'university';
    const targetLocationId = 'targetLocationId';
    const stripes = {
      ...buildStripes({
        okapi: { tenant: 'college' },
        user: {
          user: {
            tenants: [{
              id: 'college',
              name: 'College',
            }, {
              id: 'university',
              name: 'University',
            }, {
              id: 'consortium',
              name: 'Consortium',
            }],
          },
        },
      }),
    };

    describe('when instance is shared', () => {
      it('should be rendered', async () => {
        renderViewHoldingsRecord({ stripes, isInstanceShared: true });

        const updateOwnershipBtn = await screen.findByText('Update ownership');
        expect(updateOwnershipBtn).toBeInTheDocument();
      });
    });

    describe('when instance is local', () => {
      it('should be hidden', () => {
        renderViewHoldingsRecord({ stripes, isInstanceShared: false });

        const updateOwnershipBtn = screen.queryByText('Update ownership');
        expect(updateOwnershipBtn).not.toBeInTheDocument();
      });
    });

    describe('when click on the button', () => {
      it('should render location lookup', async () => {
        renderViewHoldingsRecord({ stripes, isInstanceShared: true });

        const updateOwnershipBtn = await screen.findByText('Update ownership');
        fireEvent.click(updateOwnershipBtn);

        const locationLookup = await screen.findByText('FindLocation');

        expect(locationLookup).toBeInTheDocument();
      });

      it('should render Linked order line message and close the modal on click continue button', async () => {
        renderViewHoldingsRecord({
          stripes,
          isInstanceShared: true,
          mutator: {
            ...defaultProps.mutator,
            orderLine: {
              ...defaultProps.mutator.orderLine,
              GET: jest.fn(() => Promise.resolve()),
            },
          },
          resources: {
            ...defaultProps.resources,
            items: { records: [{ id: 'itemId', purchaseOrderLineIdentifier: 'POL-1' }] }
          },
        });

        const updateOwnershipBtn = await screen.findByText('Update ownership');
        fireEvent.click(updateOwnershipBtn);

        const hasLocalPOLMessage = await screen.findByText('Linked order line');
        expect(hasLocalPOLMessage).toBeInTheDocument();

        fireEvent.click(screen.getByRole('button', { name: /continue/i }));
        expect(screen.queryByText('Linked order line')).not.toBeInTheDocument();
      });
    });

    describe('when choose the location', () => {
      it('should render confirmation modal', async () => {
        renderViewHoldingsRecord({ stripes, isInstanceShared: true });

        const updateOwnershipBtn = await screen.findByText('Update ownership');
        fireEvent.click(updateOwnershipBtn);

        await waitFor(() => FindLocation.mock.calls[0][0].onRecordsSelect([{ tenantId: 'university' }]));

        const confirmationModal = await screen.findByText('Update ownership of holdings');
        expect(confirmationModal).toBeInTheDocument();
      });
    });

    describe('when confirm updating ownership', () => {
      it('should call the function to update ownership', async () => {
        renderViewHoldingsRecord({ stripes, isInstanceShared: true });

        const updateOwnershipBtn = await screen.findByText('Update ownership');
        fireEvent.click(updateOwnershipBtn);

        await waitFor(() => FindLocation.mock.calls[0][0].onRecordsSelect([{ tenantId: targetTenantId, id: targetLocationId }]));

        const confirmationModal = await screen.findByText('Update ownership of holdings');
        const confirmButton = within(confirmationModal).getByRole('button', { name: /confirm/i });
        fireEvent.click(confirmButton);

        expect(mockOnUpdateOwnership).toHaveBeenCalledWith(
          {
            holdingsRecordIds: [defaultProps.holdingsrecordid],
            targetTenantId,
            toInstanceId: defaultProps.resources.holdingsRecords.records[0].instanceId,
            targetLocationId,
          },
          { tenant: stripes.okapi.tenant }
        );
      });
    });

    describe('when an error was occured during updating ownership', () => {
      it('should show an error message', async () => {
        renderViewHoldingsRecord({ stripes, isInstanceShared: true });

        const updateOwnershipBtn = await screen.findByText('Update ownership');
        fireEvent.click(updateOwnershipBtn);

        await waitFor(() => FindLocation.mock.calls[0][0].onRecordsSelect([{ tenantId: targetTenantId }]));

        const confirmationModal = await screen.findByText('Update ownership of holdings');
        const confirmButton = within(confirmationModal).getByRole('button', { name: /confirm/i });
        fireEvent.click(confirmButton);

        await waitFor(() => expect(screen.queryByText('Server communication problem. Please try again')).toBeDefined());
      });
    });

    describe('when cancel updating ownership', () => {
      it('should hide the confirmation modal', async () => {
        const { container } = renderViewHoldingsRecord({ stripes, isInstanceShared: true });

        const updateOwnershipBtn = await screen.findByText('Update ownership');
        fireEvent.click(updateOwnershipBtn);

        FindLocation.mock.calls[0][0].onRecordsSelect([{ tenantId: targetTenantId }]);

        const confirmationModal = await screen.findByText('Update ownership of holdings');
        const cancelButton = within(confirmationModal).getByRole('button', { name: /cancel/i });
        fireEvent.click(cancelButton);

        expect(container.querySelector('#update-ownership-modal')).not.toBeInTheDocument();
      });
    });
  });

  describe('Version history component', () => {
    let versionHistoryButton;

    beforeEach(async () => {
      await act(async () => { renderViewHoldingsRecord({ resources: resourcesFolioProp }); });

      versionHistoryButton = screen.getByRole('button', { name: /version history/i });
    });

    it('should render version history button', async () => {
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
      renderViewHoldingsRecord({
        isVersionHistoryEnabled: false,
        resources: resourcesFolioProp,
      });

      expect(screen.queryByRole('button', { name: /version history/i })).not.toBeInTheDocument();
    });
  });

  describe('Additional Call Numbers', () => {
    it('should display additional call numbers when present in resources', async () => {
      const resourcesWithAdditionalCallNumbers = {
        ...defaultProps.resources,
        holdingsRecords: {
          records: [{
            ...defaultProps.resources.holdingsRecords.records[0],
            additionalCallNumbers:
          [{ callNumber: 'CN1' }]
          }]
        }
      };

      renderViewHoldingsRecord({
        resources: resourcesWithAdditionalCallNumbers
      });

      await waitFor(() => {
        expect(screen.getByText('Additional call numbers')).toBeInTheDocument();
        expect(screen.getByText('CN1')).toBeInTheDocument();
      });
    });

    it('should display "additionalCallNumbers" header when empty', async () => {
      const resourcesWithNoAdditionalCallNumbers = {
        ...defaultProps.resources,
        holdingsRecords: {
          records: [{
            ...defaultProps.resources.holdingsRecords.records[0],
            additionalCallNumbers: []
          }]
        }
      };

      renderViewHoldingsRecord({
        resources: resourcesWithNoAdditionalCallNumbers,
      });
      await waitFor(() => {
        const headerElement = screen.getByText('Additional call numbers');

        expect(headerElement).toBeInTheDocument();
      });
    });

    it('should display multiple additional call numbers when present', async () => {
      const resourcesWithMultipleCallNumbers = {
        ...defaultProps.resources,
        referenceTables: {
          ...defaultProps.referenceTables,
          callNumberTypes: [
            { id: '1', name: 'Type 1' },
            { id: '2', name: 'Type 2' }
          ],
        },
        holdingsRecords: {
          records: [{
            ...defaultProps.resources.holdingsRecords.records[0],
            additionalCallNumbers: [
              { callNumber: 'CN1',
                prefix: 'prefix1',
                suffix: 'suffix1',
                typeId: '1' },
              { callNumber: 'CN2' },
              { callNumber: 'CN3' }
            ]
          }]
        }
      };

      renderViewHoldingsRecord({
        resources: resourcesWithMultipleCallNumbers,
        referenceTables: {
          ...defaultProps.referenceTables,
          callNumberTypes: [
            { id: '1', name: 'Type 1' },
            { id: '2', name: 'Type 2' }
          ]
        }
      });

      await waitFor(() => {
        expect(screen.getByText('CN1')).toBeInTheDocument();
        expect(screen.getByText('prefix1')).toBeInTheDocument();
        expect(screen.getByText('suffix1')).toBeInTheDocument();
        expect(screen.getByText('Type 1')).toBeInTheDocument();
        expect(screen.getByText('CN2')).toBeInTheDocument();
        expect(screen.getByText('CN3')).toBeInTheDocument();
      });
    });
  });
});


