import { renderHook, act } from '@folio/jest-config-stripes/testing-library/react';

import { useHistory, useLocation, useParams } from 'react-router-dom';

import useInstanceActions from './useInstanceActions';
import useInstanceModalsContext from '../useInstanceModalsContext';
import { useQuickExport } from '../../../hooks';
import { IdReportGenerator } from '../../../reports';
import { redirectToMarcEditPage } from '../../../utils';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: jest.fn(),
  useLocation: jest.fn(),
  useParams: jest.fn(),
}));
jest.mock('../../../hooks', () => ({
  ...jest.requireActual('../../../hooks'),
  useQuickExport: jest.fn(),
}));
jest.mock('../useInstanceModalsContext', () => jest.fn());
jest.mock('../../../utils', () => ({
  ...jest.requireActual('../../../utils'),
  redirectToMarcEditPage: jest.fn(),
}));

const mockPush = jest.fn();
const mockSetIsItemsMovement = jest.fn();
const mockSetIsFindInstancePluginOpen = jest.fn();
const mockSetIsImportRecordModalOpen = jest.fn();
const mockSetIsShareLocalInstanceModalOpen = jest.fn();
const mockSetIsSetForDeletionModalOpen = jest.fn();
const mockSetIsNewOrderModalOpen = jest.fn();

const instance = { id: 'inst1', title: 'Test Instance', identifiers: [] };
const marcRecord = { id: 'marc1' };
const callout = { sendCallout: jest.fn() };
const onCopy = jest.fn();

describe('useInstanceActions', () => {
  beforeEach(() => {
    useHistory.mockReturnValue({ push: mockPush, location: { pathname: '/inventory/view/inst1', search: '' } });
    useLocation.mockReturnValue({ pathname: '/inventory/view/inst1', search: '' });
    useParams.mockReturnValue({ id: 'inst1' });
    useQuickExport.mockClear().mockReturnValue({ exportRecords: jest.fn() });
    useInstanceModalsContext.mockReturnValue({
      setIsItemsMovement: mockSetIsItemsMovement,
      setIsFindInstancePluginOpen: mockSetIsFindInstancePluginOpen,
      setIsImportRecordModalOpen: mockSetIsImportRecordModalOpen,
      setIsShareLocalInstanceModalOpen: mockSetIsShareLocalInstanceModalOpen,
      setIsSetForDeletionModalOpen: mockSetIsSetForDeletionModalOpen,
      setIsNewOrderModalOpen: mockSetIsNewOrderModalOpen,
    });
  });

  it('handleCreate pushes correct route', () => {
    const { result } = renderHook(() => useInstanceActions({ marcRecord, callout, instance, onCopy }));
    act(() => {
      result.current.handleCreate();
    });
    expect(mockPush).toHaveBeenCalledWith({ pathname: '/inventory/view/inst1', search: '&layer=create' });
  });

  it('handleEdit pushes edit route', () => {
    const { result } = renderHook(() => useInstanceActions({ marcRecord, callout, instance, onCopy }));
    act(() => {
      result.current.handleEdit();
    });
    expect(mockPush).toHaveBeenCalledWith({ pathname: '/inventory/instance/edit/inst1', search: '' });
  });

  it('handleCopy calls onCopy with instance', () => {
    const { result } = renderHook(() => useInstanceActions({ marcRecord, callout, instance, onCopy }));
    act(() => {
      result.current.handleCopy();
    });
    expect(onCopy).toHaveBeenCalledWith(instance);
  });

  it('handleViewSource with marcRecord pushes viewsource route', () => {
    const { result } = renderHook(() => useInstanceActions({ marcRecord, callout, instance, onCopy }));
    act(() => {
      result.current.handleViewSource();
    });
    expect(mockPush).toHaveBeenCalledWith({ pathname: '/inventory/viewsource/inst1', search: '' });
  });

  it('handleViewSource without marcRecord sends error callout', () => {
    const { result } = renderHook(() => useInstanceActions({ marcRecord: null, callout, instance, onCopy }));
    act(() => {
      result.current.handleViewSource();
    });
    expect(callout.sendCallout).toHaveBeenCalledWith(expect.objectContaining({ type: 'error' }));
  });

  it('handleItemsMovement toggles items movement', () => {
    const { result } = renderHook(() => useInstanceActions({ marcRecord, callout, instance, onCopy }));
    act(() => {
      result.current.handleItemsMovement();
    });
    expect(mockSetIsItemsMovement).toHaveBeenCalledWith(expect.any(Function));
  });

  it('handleMoveItemsToAnotherInstance opens find instance plugin', () => {
    const { result } = renderHook(() => useInstanceActions({ marcRecord, callout, instance, onCopy }));
    act(() => {
      result.current.handleMoveItemsToAnotherInstance();
    });
    expect(mockSetIsFindInstancePluginOpen).toHaveBeenCalledWith(true);
  });

  it('handleOverlaySourceBib opens import record modal', () => {
    const { result } = renderHook(() => useInstanceActions({ marcRecord, callout, instance, onCopy }));
    act(() => {
      result.current.handleOverlaySourceBib();
    });
    expect(mockSetIsImportRecordModalOpen).toHaveBeenCalledWith(true);
  });

  it('handleShareLocalInstance opens share local instance modal', () => {
    const { result } = renderHook(() => useInstanceActions({ marcRecord, callout, instance, onCopy }));
    act(() => {
      result.current.handleShareLocalInstance();
    });
    expect(mockSetIsShareLocalInstanceModalOpen).toHaveBeenCalledWith(true);
  });

  it('handleSetRecordForDeletion opens set for deletion modal', () => {
    const { result } = renderHook(() => useInstanceActions({ marcRecord, callout, instance, onCopy }));
    act(() => {
      result.current.handleSetRecordForDeletion();
    });
    expect(mockSetIsSetForDeletionModalOpen).toHaveBeenCalledWith(true);
  });

  it('handleCreateNewOrder opens new order modal', () => {
    const { result } = renderHook(() => useInstanceActions({ marcRecord, callout, instance, onCopy }));
    act(() => {
      result.current.handleCreateNewOrder();
    });
    expect(mockSetIsNewOrderModalOpen).toHaveBeenCalledWith(true);
  });

  it('handleViewRequests pushes view-requests route', () => {
    const { result } = renderHook(() => useInstanceActions({ marcRecord, callout, instance, onCopy }));
    act(() => {
      result.current.handleViewRequests();
    });
    expect(mockPush).toHaveBeenCalledWith({ pathname: '/inventory/view-requests/inst1', search: '' });
  });

  it('handleEditInstanceMarc calls redirectToMarcEditPage with edit page', () => {
    const { result } = renderHook(() => useInstanceActions({ marcRecord, callout, instance, onCopy }));
    act(() => {
      result.current.handleEditInstanceMarc();
    });
    expect(redirectToMarcEditPage).toHaveBeenCalledWith(
      '/inventory/quick-marc/edit-bibliographic/inst1',
      instance,
      expect.any(Object),
      expect.any(Object)
    );
  });

  it('handleDuplicateInstanceMarc calls redirectToMarcEditPage with duplicate page', () => {
    const { result } = renderHook(() => useInstanceActions({ marcRecord, callout, instance, onCopy }));
    act(() => {
      result.current.handleDuplicateInstanceMarc();
    });
    expect(redirectToMarcEditPage).toHaveBeenCalledWith(
      '/inventory/quick-marc/derive-bibliographic/inst1',
      instance,
      expect.any(Object),
      expect.any(Object)
    );
  });

  it('handleCreateHoldingsMarc calls redirectToMarcEditPage with create holdings page', () => {
    const { result } = renderHook(() => useInstanceActions({ marcRecord, callout, instance, onCopy }));
    act(() => {
      result.current.handleCreateHoldingsMarc();
    });
    expect(redirectToMarcEditPage).toHaveBeenCalledWith(
      '/inventory/quick-marc/create-holdings/inst1',
      instance,
      expect.any(Object),
      expect.any(Object)
    );
  });

  it('handleEditInLinkedDataEditor pushes correct route when identifier is present', () => {
    const linkedInstance = {
      ...instance,
      identifiers: [{ value: 'LD_PREFIX-123' }],
    };
    const { result } = renderHook(() => useInstanceActions({ marcRecord, callout, instance: linkedInstance, onCopy }));
    act(() => {
      result.current.handleEditInLinkedDataEditor();
    });
    expect(mockPush).toHaveBeenCalledWith(
      expect.objectContaining({ pathname: expect.stringContaining('/edit') })
    );
  });

  it('handleEditInLinkedDataEditor pushes preview route when no identifier but canBeOpenedInLinkedData', () => {
    const { result } = renderHook(() => useInstanceActions({ marcRecord, callout, instance, onCopy, canBeOpenedInLinkedData: true }));
    act(() => {
      result.current.handleEditInLinkedDataEditor();
    });
    expect(mockPush).toHaveBeenCalledWith(
      expect.objectContaining({ pathname: expect.stringContaining('/preview') })
    );
  });

  it('handleEditInLinkedDataEditor does nothing if no identifier and cannot be opened in linked data', () => {
    mockPush.mockClear();
    const { result } = renderHook(() => useInstanceActions({ marcRecord, callout, instance, onCopy, canBeOpenedInLinkedData: false }));
    act(() => {
      result.current.handleEditInLinkedDataEditor();
    });
    expect(mockPush).not.toHaveBeenCalled();
  });

  describe('handleQuickExport', () => {
    it('calls exportRecords', async () => {
      const exportRecords = jest.fn().mockResolvedValue();

      useQuickExport.mockReturnValue({ exportRecords });

      const { result } = renderHook(() => useInstanceActions({ marcRecord, callout, instance, onCopy }));

      result.current.handleQuickExport();

      expect(exportRecords).toHaveBeenCalledWith({ uuids: ['inst1'], recordType: expect.any(String) });
    });
  });
});
