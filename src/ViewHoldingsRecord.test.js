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

import { checkIfUserInMemberTenant } from '@folio/stripes/core';
import { FindLocation } from '@folio/stripes-acq-components';

import '../test/jest/__mock__';
import buildStripes from '../test/jest/__mock__/stripesCore.mock';
import {
  renderWithIntl,
  translationsProperties,
} from '../test/jest/helpers';

import * as utils from './utils';

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

jest.mock('./withLocation', () => jest.fn(c => c));

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

const spyOnUpdateOwnership = jest.spyOn(utils, 'updateOwnership');

const mockData = jest.fn().mockResolvedValue({ id: 'testId' });
const mockGoTo = jest.fn();

const defaultProps = {
  id: 'id',
  goTo: mockGoTo,
  holdingsrecordid: 'holdingId',
  referenceTables: {
    holdingsSources: [{ id: 'sourceId', name: 'MARC' }],
    locationsById: {
      inactiveLocation: { name: 'Location 1', isActive: false },
    },
  },
  resources: {
    holdingsRecords: {
      records: [
        {
          sourceId: 'sourceId',
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

    const editHoldingBtn = await screen.findByTestId('edit-holding-btn');
    fireEvent.click(editHoldingBtn);

    expect(mockPush).toHaveBeenCalled();
  });

  it('should translate to duplicate holding form page', async () => {
    renderViewHoldingsRecord();

    const duplicatHoldingBtn = await screen.findByTestId('duplicate-holding-btn');
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
          tenantFrom: 'testTenantFromId',
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
          tenantFrom: 'testTenantFromId',
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

  describe('Update ownership action item', () => {
    beforeEach(() => {
      checkIfUserInMemberTenant.mockClear().mockReturnValue(true);
    });

    const targetTenantId = 'university';
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

        const updateOwnershipBtn = await screen.findByTestId('update-ownership-btn');
        expect(updateOwnershipBtn).toBeInTheDocument();
      });
    });

    describe('when instance is local', () => {
      it('should be rendered', () => {
        renderViewHoldingsRecord({ stripes, isInstanceShared: false });

        const updateOwnershipBtn = screen.queryByTestId('update-ownership-btn');
        expect(updateOwnershipBtn).not.toBeInTheDocument();
      });
    });

    describe('when click on the button', () => {
      it('should render location lookup', async () => {
        renderViewHoldingsRecord({ stripes, isInstanceShared: true });

        const updateOwnershipBtn = await screen.findByTestId('update-ownership-btn');
        fireEvent.click(updateOwnershipBtn);

        const locationLookup = await screen.findByText('FindLocation');

        expect(locationLookup).toBeInTheDocument();
      });
    });

    describe('when choose the location', () => {
      it('should render confirmation modal', async () => {
        renderViewHoldingsRecord({ stripes, isInstanceShared: true });

        const updateOwnershipBtn = await screen.findByTestId('update-ownership-btn');
        fireEvent.click(updateOwnershipBtn);

        FindLocation.mock.calls[0][0].onRecordsSelect([{ tenantId: 'university' }]);

        const confirmationModal = await screen.findByText('Update ownership of holdings');
        expect(confirmationModal).toBeInTheDocument();
      });
    });

    describe('when confirm updating ownership', () => {
      it('should call the function to update ownership', async () => {
        renderViewHoldingsRecord({ stripes, isInstanceShared: true });

        const updateOwnershipBtn = await screen.findByTestId('update-ownership-btn');
        fireEvent.click(updateOwnershipBtn);

        FindLocation.mock.calls[0][0].onRecordsSelect([{ tenantId: targetTenantId }]);

        const confirmationModal = await screen.findByText('Update ownership of holdings');
        const confirmButton = within(confirmationModal).getByRole('button', { name: /confirm/i });
        fireEvent.click(confirmButton);

        expect(spyOnUpdateOwnership).toHaveBeenCalledWith(
          {
            holdingsRecordIds: [defaultProps.holdingsrecordid],
            targetTenantId,
            toInstanceId: defaultProps.resources.holdingsRecords.records[0].instanceId,
          },
          { tenant: stripes.okapi.tenant }
        );
      });
    });

    describe('when cancel updating ownership', () => {
      it('should hide the confirmation modal', async () => {
        const { container } = renderViewHoldingsRecord({ stripes, isInstanceShared: true });

        const updateOwnershipBtn = await screen.findByTestId('update-ownership-btn');
        fireEvent.click(updateOwnershipBtn);

        FindLocation.mock.calls[0][0].onRecordsSelect([{ tenantId: targetTenantId }]);

        const confirmationModal = await screen.findByText('Update ownership of holdings');
        const cancelButton = within(confirmationModal).getByRole('button', { name: /cancel/i });
        fireEvent.click(cancelButton);

        expect(container.querySelector('#update-ownership-modal')).not.toBeInTheDocument();
      });
    });
  });
});
