import { useHistory } from 'react-router-dom';

import { renderHook } from '@folio/jest-config-stripes/testing-library/react';
import { useStripes } from '@folio/stripes/core';
import {
  collapseAllSections,
  expandAllSections,
} from '@folio/stripes/components';

import useItemDetailsShortcuts from './useItemDetailsShortcuts';
import useItemActions from '../useItemActions';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: jest.fn(),
}));

jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  useStripes: jest.fn(),
}));

jest.mock('../useItemActions', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('@folio/stripes/components', () => ({
  ...jest.requireActual('@folio/stripes/components'),
  collapseAllSections: jest.fn(),
  expandAllSections: jest.fn(),
}));

const mockHistory = {
  push: jest.fn(),
};
const mockStripes = {
  hasPerm: jest.fn(),
};
const mockHandleEdit = jest.fn();
const mockHandleCopy = jest.fn();
const mockAccordionStatusRef = { current: {} };
const initialTenantId = 'test-tenant';

describe('useItemDetailsShortcuts', () => {
  beforeEach(() => {
    useHistory.mockReturnValue(mockHistory);
    useStripes.mockReturnValue(mockStripes);
    useItemActions.mockReturnValue({
      handleEdit: mockHandleEdit,
      handleCopy: mockHandleCopy,
    });
  });

  it('should return an array of shortcut configurations', () => {
    const { result } = renderHook(() => useItemDetailsShortcuts({
      initialTenantId,
      accordionStatusRef: mockAccordionStatusRef,
    }));

    expect(result.current).toHaveLength(5);
    expect(result.current[0].name).toBe('edit');
    expect(result.current[1].name).toBe('expandAllSections');
    expect(result.current[2].name).toBe('collapseAllSections');
    expect(result.current[3].name).toBe('search');
    expect(result.current[4].name).toBe('duplicateRecord');
  });

  it('should handle edit shortcut with proper permissions', () => {
    mockStripes.hasPerm.mockReturnValue(true);
    mockHandleEdit.mockClear();
    const { result } = renderHook(() => useItemDetailsShortcuts({
      initialTenantId,
      accordionStatusRef: mockAccordionStatusRef,
    }));

    result.current[0].handler();
    expect(mockStripes.hasPerm).toHaveBeenCalledWith('ui-inventory.item.edit');
    expect(mockHandleEdit).toHaveBeenCalled();
  });

  it('should not handle edit shortcut without proper permissions', () => {
    mockStripes.hasPerm.mockReturnValue(false);
    mockHandleEdit.mockClear();
    const { result } = renderHook(() => useItemDetailsShortcuts({
      initialTenantId,
      accordionStatusRef: mockAccordionStatusRef,
    }));

    result.current[0].handler();
    expect(mockStripes.hasPerm).toHaveBeenCalledWith('ui-inventory.item.edit');
    expect(mockHandleEdit).not.toHaveBeenCalled();
  });

  it('should handle expand all sections shortcut', () => {
    const mockEvent = { preventDefault: jest.fn() };
    const { result } = renderHook(() => useItemDetailsShortcuts({
      initialTenantId,
      accordionStatusRef: mockAccordionStatusRef,
    }));

    result.current[1].handler(mockEvent);
    expect(expandAllSections).toHaveBeenCalledWith(mockEvent, mockAccordionStatusRef);
  });

  it('should handle collapse all sections shortcut', () => {
    const mockEvent = { preventDefault: jest.fn() };
    const { result } = renderHook(() => useItemDetailsShortcuts({
      initialTenantId,
      accordionStatusRef: mockAccordionStatusRef,
    }));

    result.current[2].handler(mockEvent);
    expect(collapseAllSections).toHaveBeenCalledWith(mockEvent, mockAccordionStatusRef);
  });

  it('should handle search shortcut', () => {
    const { result } = renderHook(() => useItemDetailsShortcuts({
      initialTenantId,
      accordionStatusRef: mockAccordionStatusRef,
    }));

    result.current[3].handler();
    expect(mockHistory.push).toHaveBeenCalledWith('/inventory');
  });

  it('should not handle duplicate record shortcut without proper permissions', () => {
    mockStripes.hasPerm.mockReturnValue(false);
    mockHandleCopy.mockClear();

    const { result } = renderHook(() => useItemDetailsShortcuts({
      initialTenantId,
      accordionStatusRef: mockAccordionStatusRef,
    }));

    result.current[4].handler();
    expect(mockStripes.hasPerm).toHaveBeenCalledWith('ui-inventory.item.create');
    expect(mockHandleCopy).not.toHaveBeenCalled();
  });

  it('should handle duplicate record shortcut with proper permissions', () => {
    mockStripes.hasPerm.mockReturnValue(true);
    mockHandleCopy.mockClear();

    const { result } = renderHook(() => useItemDetailsShortcuts({
      initialTenantId,
      accordionStatusRef: mockAccordionStatusRef,
    }));

    result.current[4].handler();
    expect(mockStripes.hasPerm).toHaveBeenCalledWith('ui-inventory.item.create');
    expect(mockHandleCopy).toHaveBeenCalled();
  });
});
