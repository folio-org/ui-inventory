import { MemoryRouter } from 'react-router-dom';

import {
  act,
  screen,
  fireEvent,
} from '@folio/jest-config-stripes/testing-library/react';

import { runAxeTest } from '@folio/stripes-testing';
import { useStripes } from '@folio/stripes/core';

import '../../../../../test/jest/__mock__';
import {
  renderWithIntl,
  translationsProperties,
} from '../../../../../test/jest/helpers';

import ItemModals from './ItemModals';
import { useItemModalsContext } from '../../../hooks';

jest.unmock('@folio/stripes/components');

jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  useStripes: jest.fn(),
}));

jest.mock('../../../hooks', () => ({
  useItemModalsContext: jest.fn(),
}));

jest.mock('../UpdateItemOwnershipModal', () => {
  return {
    __esModule: true,
    default: ({ handleSubmit, isOpen }) => (
      isOpen ? (
        <div role="dialog">
          <h1>Update ownership</h1>
          <button
            type="button"
            onClick={() => handleSubmit('tenant2', 'location1', 'holding1')}
          >
            Update
          </button>
        </div>
      ) : null
    ),
  };
});

const mockItem = {
  id: 'itemId',
  hrid: 'testHrid',
  barcode: 'testBarcode',
  status: { name: 'Available' },
};

const mockStripes = {
  okapi: { tenant: 'diku' },
  user: {
    user: {
      tenants: [{ id: 'diku', name: 'Tenant 1' }],
    },
  },
};

const mockTargetTenant = {
  id: 'tenant2',
  name: 'Tenant 2',
};

const defaultProps = {
  onSelectNewItemOwnership: jest.fn(),
  onConfirmHandleUpdateOwnership: jest.fn(),
  onCancelUpdateOwnership: jest.fn(),
  onChangeAffiliation: jest.fn(),
  onMarkItemAsMissing: jest.fn(),
  onMarkItemAsWithdrawn: jest.fn(),
  onMarkItemWithStatus: jest.fn(),
  onDeleteItem: jest.fn(),
  item: mockItem,
  instanceId: 'instanceId',
  targetTenant: mockTargetTenant,
  tenants: [{ id: 'diku' }, { id: 'tenant2' }],
  requestCount: 0,
  requestsUrl: 'requests/url',
};

const mockModalContext = {
  isUpdateOwnershipModalOpen: false,
  isConfirmUpdateOwnershipModalOpen: false,
  isLinkedLocalOrderLineModalOpen: false,
  isItemMissingModalOpen: false,
  isItemWithdrawnModalOpen: false,
  isSelectedItemStatusModalOpen: false,
  isConfirmDeleteItemModalOpen: false,
  isCannotDeleteItemModalOpen: false,
  selectedItemStatus: '',
  cannotDeleteItemModalMessageId: '',
  setIsConfirmUpdateOwnershipModalOpen: jest.fn(),
  setIsUpdateOwnershipModalOpen: jest.fn(),
  setIsLinkedLocalOrderLineModalOpen: jest.fn(),
  setIsItemMissingModalOpen: jest.fn(),
  setIsItemWithdrawnModalOpen: jest.fn(),
  setIsConfirmDeleteItemModalOpen: jest.fn(),
  setIsCannotDeleteItemModalOpen: jest.fn(),
  setIsSelectedItemStatusModalOpen: jest.fn(),
  setSelectedItemStatus: jest.fn(),
};

const renderItemModals = (props = {}) => {
  const component = (
    <MemoryRouter>
      <ItemModals
        {...defaultProps}
        {...props}
      />
    </MemoryRouter>
  );

  return renderWithIntl(component, translationsProperties);
};

describe('ItemModals', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useStripes.mockReturnValue(mockStripes);
    useItemModalsContext.mockReturnValue(mockModalContext);
  });

  it('should render with no axe errors', async () => {
    const { container } = await act(async () => renderItemModals());
    await runAxeTest({ rootNode: container });
  });

  describe('Update Ownership Modal', () => {
    beforeEach(() => {
      useItemModalsContext.mockReturnValue({
        ...mockModalContext,
        isUpdateOwnershipModalOpen: true,
      });
    });

    it('should render update ownership modal when open', () => {
      renderItemModals();
      expect(screen.getByRole('heading', { name: 'Update ownership' })).toBeInTheDocument();
    });

    it('should handle submit update ownership', async () => {
      renderItemModals();

      const modal = screen.getByRole('dialog');
      expect(modal).toBeInTheDocument();

      // Simulate clicking update button which triggers handleSubmit with mocked values
      const updateButton = screen.getByRole('button', { name: /update/i });
      await act(async () => {
        fireEvent.click(updateButton);
      });

      expect(defaultProps.onSelectNewItemOwnership).toHaveBeenCalledWith({ tenantId: 'tenant2', targetLocation: 'location1', holdingId: 'holding1' });
      expect(mockModalContext.setIsUpdateOwnershipModalOpen).toHaveBeenCalledWith(false);
      expect(mockModalContext.setIsConfirmUpdateOwnershipModalOpen).toHaveBeenCalledWith(true);
    });
  });

  describe('Confirm Delete Modal', () => {
    beforeEach(() => {
      useItemModalsContext.mockReturnValue({
        ...mockModalContext,
        isConfirmDeleteItemModalOpen: true,
      });
    });

    it('should render confirm delete modal when open', () => {
      renderItemModals();
      expect(screen.getByRole('heading', { name: 'Confirm deletion of item' })).toBeInTheDocument();
    });

    it('should handle delete confirmation', async () => {
      renderItemModals();
      const confirmButton = screen.getByRole('button', { name: /delete/i });
      await act(async () => {
        fireEvent.click(confirmButton);
      });
      expect(defaultProps.onDeleteItem).toHaveBeenCalledWith(mockItem.id);
    });
  });

  describe('Missing Item Modal', () => {
    beforeEach(() => {
      useItemModalsContext.mockReturnValue({
        ...mockModalContext,
        isItemMissingModalOpen: true,
      });
    });

    it('should render missing item modal when open', () => {
      renderItemModals();
      expect(screen.getByRole('heading', { name: 'Confirm item status: Missing' })).toBeInTheDocument();
    });

    it('should handle marking item as missing', async () => {
      renderItemModals();
      const confirmButton = screen.getByRole('button', { name: /confirm/i });
      await act(async () => {
        fireEvent.click(confirmButton);
      });
      expect(defaultProps.onMarkItemAsMissing).toHaveBeenCalled();
      expect(mockModalContext.setIsItemMissingModalOpen).toHaveBeenCalledWith(false);
    });
  });

  describe('Withdrawn Item Modal', () => {
    beforeEach(() => {
      useItemModalsContext.mockReturnValue({
        ...mockModalContext,
        isItemWithdrawnModalOpen: true,
      });
    });

    it('should render withdrawn item modal when open', () => {
      renderItemModals();
      expect(screen.getByRole('heading', { name: 'Confirm item status: Withdrawn' })).toBeInTheDocument();
    });

    it('should handle marking item as withdrawn', async () => {
      renderItemModals();
      const confirmButton = screen.getByRole('button', { name: /confirm/i });
      await act(async () => {
        fireEvent.click(confirmButton);
      });
      expect(defaultProps.onMarkItemAsWithdrawn).toHaveBeenCalled();
      expect(mockModalContext.setIsItemWithdrawnModalOpen).toHaveBeenCalledWith(false);
    });
  });

  describe('Selected Item Status Modal', () => {
    beforeEach(() => {
      useItemModalsContext.mockReturnValue({
        ...mockModalContext,
        isSelectedItemStatusModalOpen: true,
        selectedItemStatus: 'AVAILABLE',
      });
    });

    it('should render selected item status modal when open', () => {
      renderItemModals();
      expect(screen.getByRole('heading', { name: 'Confirm item status: Available' })).toBeInTheDocument();
    });

    it('should handle marking item with status', async () => {
      renderItemModals();
      const confirmButton = screen.getByRole('button', { name: /confirm/i });
      await act(async () => {
        fireEvent.click(confirmButton);
      });
      expect(defaultProps.onMarkItemWithStatus).toHaveBeenCalledWith('AVAILABLE');
      expect(mockModalContext.setSelectedItemStatus).toHaveBeenCalledWith('');
      expect(mockModalContext.setIsSelectedItemStatusModalOpen).toHaveBeenCalledWith(false);
    });
  });
});
