import { renderHook, act } from '@folio/jest-config-stripes/testing-library/react';

import { useStripes } from '@folio/stripes/core';

import useInstanceDetailsShortcuts from './useInstanceDetailsShortcuts';
import useInstanceActions from '../useInstanceActions';

jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  useStripes: jest.fn(),
}));
jest.mock('../useInstanceActions', () => jest.fn());

const mockHandleCreate = jest.fn();
const mockHandleEdit = jest.fn();
const mockHandleEditInstanceMarc = jest.fn();
const mockHandleCopy = jest.fn();

const instance = { id: 'inst1', title: 'Test Instance', source: 'MARC', identifiers: [] };
const marcRecord = { id: 'marc1' };
const callout = { sendCallout: jest.fn() };

const getStripes = (perms = {}) => ({
  hasPerm: jest.fn((perm) => perms[perm] ?? false),
});

describe('useInstanceDetailsShortcuts', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useInstanceActions.mockReturnValue({
      handleCreate: mockHandleCreate,
      handleEdit: mockHandleEdit,
      handleEditInstanceMarc: mockHandleEditInstanceMarc,
      handleCopy: mockHandleCopy,
    });
  });

  it('should call handleCreate when new shortcut is triggered and permission is granted', () => {
    useStripes.mockReturnValue(getStripes({ 'ui-inventory.instance.create': true }));

    const { result } = renderHook(() => useInstanceDetailsShortcuts({ instance, marcRecord, callout }));
    act(() => {
      result.current.find(action => action.name === 'new').handler({ preventDefault: jest.fn() });
    });

    expect(mockHandleCreate).toHaveBeenCalled();
  });

  it('should not call handleCreate when new shortcut is triggered and permission is denied', () => {
    useStripes.mockReturnValue(getStripes({ 'ui-inventory.instance.create': false }));

    const { result } = renderHook(() => useInstanceDetailsShortcuts({ instance, marcRecord, callout }));
    act(() => {
      result.current.find(action => action.name === 'new').handler({ preventDefault: jest.fn() });
    });

    expect(mockHandleCreate).not.toHaveBeenCalled();
  });

  it('should call handleEdit when edit shortcut is triggered and permission is granted', () => {
    useStripes.mockReturnValue(getStripes({ 'ui-inventory.instance.edit': true }));

    const { result } = renderHook(() => useInstanceDetailsShortcuts({ instance, marcRecord, callout }));
    act(() => {
      result.current.find(action => action.name === 'edit').handler({ preventDefault: jest.fn() });
    });

    expect(mockHandleEdit).toHaveBeenCalled();
  });

  it('should not call handleEdit when edit shortcut is triggered and permission is denied', () => {
    useStripes.mockReturnValue(getStripes({ 'ui-inventory.instance.edit': false }));

    const { result } = renderHook(() => useInstanceDetailsShortcuts({ instance, marcRecord, callout }));
    act(() => {
      result.current.find(action => action.name === 'edit').handler({ preventDefault: jest.fn() });
    });

    expect(mockHandleEdit).not.toHaveBeenCalled();
  });

  it('should call handleEditInstanceMarc when editMARC shortcut is triggered, source is MARC, and permission is granted', () => {
    useStripes.mockReturnValue(getStripes({ 'ui-quick-marc.quick-marc-editor.all': true }));

    const { result } = renderHook(() => useInstanceDetailsShortcuts({ instance, marcRecord, callout }));
    act(() => {
      result.current.find(action => action.name === 'editMARC').handler({ preventDefault: jest.fn() });
    });

    expect(mockHandleEditInstanceMarc).toHaveBeenCalled();
  });

  it('should not call handleEditInstanceMarc when editMARC shortcut is triggered and source is not MARC', () => {
    useStripes.mockReturnValue(getStripes({ 'ui-quick-marc.quick-marc-editor.all': true }));

    const nonMarcInstance = { ...instance, source: 'FOLIO' };
    const { result } = renderHook(() => useInstanceDetailsShortcuts({ instance: nonMarcInstance, marcRecord, callout }));
    act(() => {
      result.current.find(action => action.name === 'editMARC').handler({ preventDefault: jest.fn() });
    });

    expect(mockHandleEditInstanceMarc).not.toHaveBeenCalled();
  });

  it('should not call handleEditInstanceMarc and should not call callout when editMARC shortcut is triggered, source is MARC, but permission is denied', () => {
    useStripes.mockReturnValue(getStripes({ 'ui-quick-marc.quick-marc-editor.all': false }));

    const { result } = renderHook(() => useInstanceDetailsShortcuts({ instance, marcRecord, callout }));
    act(() => {
      result.current.find(action => action.name === 'editMARC').handler({ preventDefault: jest.fn() });
    });

    expect(mockHandleEditInstanceMarc).not.toHaveBeenCalled();
  });

  it('should call handleCopy when duplicateRecord shortcut is triggered and permission is granted', () => {
    useStripes.mockReturnValue(getStripes({ 'ui-inventory.instance.create': true }));

    const { result } = renderHook(() => useInstanceDetailsShortcuts({ instance, marcRecord, callout }));
    act(() => {
      result.current.find(action => action.name === 'duplicateRecord').handler({ preventDefault: jest.fn() });
    });

    expect(mockHandleCopy).toHaveBeenCalled();
  });

  it('should not call handleCopy when duplicateRecord shortcut is triggered and permission is denied', () => {
    useStripes.mockReturnValue(getStripes({ 'ui-inventory.instance.create': false }));

    const { result } = renderHook(() => useInstanceDetailsShortcuts({ instance, marcRecord, callout }));
    act(() => {
      result.current.find(action => action.name === 'duplicateRecord').handler({ preventDefault: jest.fn() });
    });

    expect(mockHandleCopy).not.toHaveBeenCalled();
  });
});
