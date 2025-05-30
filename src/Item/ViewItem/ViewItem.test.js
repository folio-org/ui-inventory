import { act } from 'react';
import { Router, useParams } from 'react-router-dom';
import { createMemoryHistory } from 'history';

import { runAxeTest } from '@folio/stripes-testing';
import { screen } from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import { checkIfUserInCentralTenant } from '@folio/stripes/core';

import '../../../test/jest/__mock__';

import {
  renderWithIntl,
  translationsProperties,
} from '../../../test/jest/helpers';

import ViewItem from './ViewItem';

import { useItemQuery } from '../hooks';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn().mockReturnValue({}),
}));

jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  checkIfUserInCentralTenant: jest.fn().mockReturnValue(false),
}));

jest.mock('@folio/stripes/components', () => ({
  ...jest.requireActual('@folio/stripes/components'),
  HasCommand: ({ children }) => <div>{children}</div>,
}));

jest.mock('./components', () => ({
  ...jest.requireActual('./components'),
  ItemModals: () => <div>ItemModals</div>,
  ItemActionMenu: () => <div>ItemActionMenu</div>,
  ItemDetailsContent: () => <div>ItemDetailsContent</div>,
  ItemVersionHistory: () => <div>ItemVersionHistory</div>,
}));

jest.mock('../../components', () => ({
  ...jest.requireActual('../../components'),
  PaneLoading: () => <div>PaneLoading</div>,
}));

const mockStripes = {
  okapi: { tenant: 'diku' },
  hasInterface: jest.fn().mockReturnValue(true),
};

const mockItem = {
  id: 'test-item-id',
  barcode: '123456',
  status: { name: 'Available' },
  hrid: 'test-hrid',
  metadata: {
    updatedDate: '2023-01-01T00:00:00.000Z',
  },
};

const mockInstance = {
  id: 'test-instance-id',
  source: 'FOLIO',
};

const mockHolding = {
  id: 'test-holding-id',
};

const mockReferenceTables = {
  holdingsSourcesByName: {},
};

const defaultProps = {
  referenceTables: mockReferenceTables,
  isInstanceShared: false,
  initialTenantId: 'diku',
};

jest.mock('../hooks', () => ({
  ...jest.requireActual('../hooks'),
  useItemQuery: jest.fn().mockReturnValue(() => ({
    isLoading: false,
    item: mockItem,
    refetch: jest.fn(),
  })),
  useItemDetailsShortcuts: () => [],
  useItemUpdateOwnership: () => ({
    handleUpdateOwnership: jest.fn(),
    onConfirmHandleUpdateOwnership: jest.fn(),
    onCancelUpdateOwnership: jest.fn(),
  }),
  useItemStatusMutation: () => ({
    markItemAsMissing: jest.fn(),
    markItemAsWithdrawn: jest.fn(),
    markItemWithStatus: jest.fn(),
  }),
  useItemMutation: () => ({
    deleteItem: jest.fn(),
  }),
}));

jest.mock('../../common', () => ({
  ...jest.requireActual('../../common'),
  useInstance: () => ({
    isLoading: false,
    instance: mockInstance,
  }),
  useHoldingQuery: () => ({
    isLoading: false,
    holding: mockHolding,
  }),
}));

jest.mock('../../hooks', () => ({
  ...jest.requireActual('../../hooks'),
  useAuditSettings: () => ({ settings: [{ key: 'enabled', value: true }] }),
  useCirculationItemRequestsQuery: () => ({ requests: [] }),
  useTagSettingsQuery: () => ({ tagSettings: {} }),
}));

const history = createMemoryHistory();

const renderViewItem = (props = {}) => {
  return renderWithIntl(
    <Router history={history}>
      <ViewItem
        {...defaultProps}
        {...props}
      />
    </Router>,
    translationsProperties,
  );
};

describe('ViewItem', () => {
  beforeEach(() => {
    useItemQuery.mockClear().mockReturnValue({ isLoading: false, item: mockItem });
  });

  it('should be rendered with no axe errors', async () => {
    const { container } = renderViewItem();

    await runAxeTest({ rootNode: container });
  });

  it('should render loading state when data is loading', () => {
    useItemQuery.mockReturnValue({ isLoading: true, item: null });

    renderViewItem();

    expect(screen.getByText('PaneLoading')).toBeInTheDocument();
  });

  it('should render item details when data is loaded', () => {
    renderViewItem();

    expect(screen.getByText('ItemDetailsContent')).toBeInTheDocument();
    expect(screen.getByText('ItemModals')).toBeInTheDocument();
  });

  it('should render version history pane when version history button is clicked', async () => {
    renderViewItem();

    const versionHistoryButton = screen.getByRole('button', { name: /version history/i });
    await act(() => userEvent.click(versionHistoryButton));

    expect(screen.getByText('ItemVersionHistory')).toBeInTheDocument();
  });

  it('should display correct item status in pane title', () => {
    renderViewItem();

    const expectedTitle = `Item • ${mockItem.barcode} • ${mockItem.status.name}`;
    expect(screen.getByText(expectedTitle)).toBeInTheDocument();
  });

  it('should display correct item subtitle with item HRID and update date', () => {
    renderViewItem();

    const expectedSubtitle = `${mockItem.hrid} • Last updated: 1/1/2023`;
    expect(screen.getByText(expectedSubtitle)).toBeInTheDocument();
  });

  describe('navigation', () => {
    it('should navigate back to instance view when closed', async () => {
      useParams.mockReturnValue({ id: mockInstance.id });

      renderViewItem();

      const closeButton = screen.getByRole('button', { name: /close/i });
      await act(() => userEvent.click(closeButton));

      expect(history.location.pathname).toBe(`/inventory/view/${mockInstance.id}`);
    });
  });

  describe('permissions and actions', () => {
    it('should not show action menu for central tenant users', () => {
      checkIfUserInCentralTenant.mockReturnValue(true);

      renderViewItem();

      expect(screen.queryByRole('button', { name: /actions/i })).not.toBeInTheDocument();
    });

    it('should show action menu for member tenant users', () => {
      checkIfUserInCentralTenant.mockReturnValue(false);

      renderViewItem({ stripes: mockStripes });

      expect(screen.getByRole('button', { name: /actions/i })).toBeInTheDocument();
    });
  });
});
