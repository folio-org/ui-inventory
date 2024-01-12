import React from 'react';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';
import { MemoryRouter } from 'react-router-dom';
import { createMemoryHistory } from 'history';

import {
  screen,
  act,
  fireEvent,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';

import '../test/jest/__mock__';
import buildStripes from '../test/jest/__mock__/stripesCore.mock';
import {
  renderWithIntl,
  translationsProperties,
} from '../test/jest/helpers';

import ViewHoldingsRecord from './ViewHoldingsRecord';

const mockPush = jest.fn();

const history = createMemoryHistory();
history.push = mockPush;

jest.mock('./withLocation', () => jest.fn(c => c));

jest.mock('./common', () => ({
  ...jest.requireActual('./common'),
  useTenantKy: jest.fn(),
}));

jest.mock('./utils', () => ({
  ...jest.requireActual('./utils'),
  switchAffiliation: jest.fn(() => mockPush()),
}));

const spyOncollapseAllSections = jest.spyOn(require('@folio/stripes/components'), 'collapseAllSections');
const spyOnexpandAllSections = jest.spyOn(require('@folio/stripes/components'), 'expandAllSections');

const mockData = jest.fn().mockResolvedValue({ id: 'testId' });

const defaultProps = {
  id: 'id',
  goTo: jest.fn(),
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
        { sourceId: 'sourceId', temporaryLocationId: 'inactiveLocation' }
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

    fireEvent.click(await screen.findByRole('button', { name: 'confirm' }));

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
        const { getByText } = renderViewHoldingsRecord({
          stripes: {
            ...buildStripes({ okapi: { tenant: 'member' } }),
          },
        });

        await waitFor(() => getByText('Actions'));

        expect(getByText('View source')).toBeInTheDocument();
        expect(getByText('Edit in quickMARC')).toBeInTheDocument();
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
});
