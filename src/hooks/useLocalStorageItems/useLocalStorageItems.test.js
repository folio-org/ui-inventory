import { act } from 'react';
import { renderHook } from '@folio/jest-config-stripes/testing-library/react';

import useLocalStorageItems from './useLocalStorageItems';

const holdingId = 'holding1';

describe('useLocalStorageItems hook', () => {
  beforeEach(() => {
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      return JSON.stringify({ 'holding1': ['item1'] });
    });

    jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should retrieve existing item from localStorage', () => {
    const { result } = renderHook(() => useLocalStorageItems(holdingId));

    const item = result.current.getItem('item1');
    expect(item).toBe('item1');
  });

  it('should return undefined for a non-existent item', () => {
    const { result } = renderHook(() => useLocalStorageItems(holdingId));

    const item = result.current.getItem('item2');
    expect(item).toBeUndefined();
  });

  it('should add a new item and update localStorage', () => {
    const { result } = renderHook(() => useLocalStorageItems(holdingId));

    act(() => {
      result.current.addItem('item2');
    });

    expect(localStorage.setItem).toHaveBeenCalledWith(
      '@folio/inventory/items',
      JSON.stringify({ 'holding1': ['item1', 'item2'] })
    );

    const newItem = result.current.getItem('item2');
    expect(newItem).toBe('item2');
  });

  it('should not add duplicate items', () => {
    const { result } = renderHook(() => useLocalStorageItems(holdingId));

    act(() => {
      result.current.addItem('item1');
    });

    expect(localStorage.setItem).not.toHaveBeenCalledWith(
      '@folio/inventory/items',
      JSON.stringify({ 'holding1': ['item1'] })
    );
  });
});
