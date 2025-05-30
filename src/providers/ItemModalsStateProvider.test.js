import { render, act } from '@folio/jest-config-stripes/testing-library/react';

import ItemModalsStateProvider from './ItemModalsStateProvider';

import { ItemModalsContext } from '../contexts';

const TestComponent = () => (
  <ItemModalsContext.Consumer>
    {({
      isItemMissingModalOpen,
      isItemWithdrawnModalOpen,
      isConfirmDeleteItemModalOpen,
      isCannotDeleteItemModalOpen,
      isUpdateOwnershipModalOpen,
      isConfirmUpdateOwnershipModalOpen,
      cannotDeleteItemModalMessageId,
      isLinkedLocalOrderLineModalOpen,
      isSelectedItemStatusModalOpen,
      selectedItemStatus,
      setIsItemMissingModalOpen,
      setIsItemWithdrawnModalOpen,
      setIsConfirmDeleteItemModalOpen,
      setIsCannotDeleteItemModalOpen,
      setIsUpdateOwnershipModalOpen,
      setIsConfirmUpdateOwnershipModalOpen,
      setCannotDeleteItemModalMessageId,
      setIsLinkedLocalOrderLineModalOpen,
      setIsSelectedItemStatusModalOpen,
      setSelectedItemStatus,
    }) => (
      <div>
        <div data-testid="item-missing-modal">{isItemMissingModalOpen.toString()}</div>
        <div data-testid="item-withdrawn-modal">{isItemWithdrawnModalOpen.toString()}</div>
        <div data-testid="confirm-delete-modal">{isConfirmDeleteItemModalOpen.toString()}</div>
        <div data-testid="cannot-delete-modal">{isCannotDeleteItemModalOpen.toString()}</div>
        <div data-testid="update-ownership-modal">{isUpdateOwnershipModalOpen.toString()}</div>
        <div data-testid="confirm-update-ownership-modal">{isConfirmUpdateOwnershipModalOpen.toString()}</div>
        <div data-testid="cannot-delete-message">{cannotDeleteItemModalMessageId}</div>
        <div data-testid="linked-order-line-modal">{isLinkedLocalOrderLineModalOpen.toString()}</div>
        <div data-testid="selected-item-status-modal">{isSelectedItemStatusModalOpen.toString()}</div>
        <div data-testid="selected-item-status">{selectedItemStatus}</div>
        <button type="button" onClick={() => setIsItemMissingModalOpen(true)}>Open Missing Modal</button>
        <button type="button" onClick={() => setIsItemWithdrawnModalOpen(true)}>Open Withdrawn Modal</button>
        <button type="button" onClick={() => setIsConfirmDeleteItemModalOpen(true)}>Open Confirm Delete Modal</button>
        <button type="button" onClick={() => setIsCannotDeleteItemModalOpen(true)}>Open Cannot Delete Modal</button>
        <button type="button" onClick={() => setIsUpdateOwnershipModalOpen(true)}>Open Update Ownership Modal</button>
        <button type="button" onClick={() => setIsConfirmUpdateOwnershipModalOpen(true)}>Open Confirm Update Ownership Modal</button>
        <button type="button" onClick={() => setCannotDeleteItemModalMessageId('test-message')}>Set Cannot Delete Message</button>
        <button type="button" onClick={() => setIsLinkedLocalOrderLineModalOpen(true)}>Open Linked Order Line Modal</button>
        <button type="button" onClick={() => setIsSelectedItemStatusModalOpen(true)}>Open Selected Item Status Modal</button>
        <button type="button" onClick={() => setSelectedItemStatus('test-status')}>Set Selected Item Status</button>
      </div>
    )}
  </ItemModalsContext.Consumer>
);

const renderItemModalsStateProvider = () => {
  return render(
    <ItemModalsStateProvider>
      <TestComponent />
    </ItemModalsStateProvider>
  );
};

describe('ItemModalsStateProvider', () => {
  it('should initialize all modal states as false', () => {
    const { getByTestId } = renderItemModalsStateProvider();

    expect(getByTestId('item-missing-modal')).toHaveTextContent('false');
    expect(getByTestId('item-withdrawn-modal')).toHaveTextContent('false');
    expect(getByTestId('confirm-delete-modal')).toHaveTextContent('false');
    expect(getByTestId('cannot-delete-modal')).toHaveTextContent('false');
    expect(getByTestId('update-ownership-modal')).toHaveTextContent('false');
    expect(getByTestId('confirm-update-ownership-modal')).toHaveTextContent('false');
    expect(getByTestId('linked-order-line-modal')).toHaveTextContent('false');
    expect(getByTestId('selected-item-status-modal')).toHaveTextContent('false');
  });

  it('should initialize cannotDeleteItemModalMessageId as empty string', () => {
    const { getByTestId } = renderItemModalsStateProvider();
    expect(getByTestId('cannot-delete-message')).toHaveTextContent('');
  });

  it('should initialize selectedItemStatus as empty string', () => {
    const { getByTestId } = renderItemModalsStateProvider();
    expect(getByTestId('selected-item-status')).toHaveTextContent('');
  });

  it('should update item missing modal state', () => {
    const { getByTestId, getByText } = renderItemModalsStateProvider();

    act(() => {
      getByText('Open Missing Modal').click();
    });

    expect(getByTestId('item-missing-modal')).toHaveTextContent('true');
  });

  it('should update item withdrawn modal state', () => {
    const { getByTestId, getByText } = renderItemModalsStateProvider();

    act(() => {
      getByText('Open Withdrawn Modal').click();
    });

    expect(getByTestId('item-withdrawn-modal')).toHaveTextContent('true');
  });

  it('should update confirm delete item modal state', () => {
    const { getByTestId, getByText } = renderItemModalsStateProvider();

    act(() => {
      getByText('Open Confirm Delete Modal').click();
    });

    expect(getByTestId('confirm-delete-modal')).toHaveTextContent('true');
  });

  it('should update cannot delete item modal state', () => {
    const { getByTestId, getByText } = renderItemModalsStateProvider();

    act(() => {
      getByText('Open Cannot Delete Modal').click();
    });

    expect(getByTestId('cannot-delete-modal')).toHaveTextContent('true');
  });

  it('should update update ownership modal state', () => {
    const { getByTestId, getByText } = renderItemModalsStateProvider();

    act(() => {
      getByText('Open Update Ownership Modal').click();
    });

    expect(getByTestId('update-ownership-modal')).toHaveTextContent('true');
  });

  it('should update confirm update ownership modal state', () => {
    const { getByTestId, getByText } = renderItemModalsStateProvider();

    act(() => {
      getByText('Open Confirm Update Ownership Modal').click();
    });

    expect(getByTestId('confirm-update-ownership-modal')).toHaveTextContent('true');
  });

  it('should update cannot delete item modal message', () => {
    const { getByTestId, getByText } = renderItemModalsStateProvider();

    act(() => {
      getByText('Set Cannot Delete Message').click();
    });

    expect(getByTestId('cannot-delete-message')).toHaveTextContent('test-message');
  });

  it('should update linked local order line modal state', () => {
    const { getByTestId, getByText } = renderItemModalsStateProvider();

    act(() => {
      getByText('Open Linked Order Line Modal').click();
    });

    expect(getByTestId('linked-order-line-modal')).toHaveTextContent('true');
  });

  it('should update selected item status modal state', () => {
    const { getByTestId, getByText } = renderItemModalsStateProvider();

    act(() => {
      getByText('Open Selected Item Status Modal').click();
    });

    expect(getByTestId('selected-item-status-modal')).toHaveTextContent('true');
  });

  it('should update selected item status', () => {
    const { getByTestId, getByText } = renderItemModalsStateProvider();

    act(() => {
      getByText('Set Selected Item Status').click();
    });

    expect(getByTestId('selected-item-status')).toHaveTextContent('test-status');
  });
});
