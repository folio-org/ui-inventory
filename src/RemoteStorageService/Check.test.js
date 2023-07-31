import { renderHook } from '@folio/jest-config-stripes/testing-library/react';
import '../../test/jest/__mock__';
import { useHoldings } from '../providers';
import { useByLocation, useByHoldings } from './Check';

jest.mock('../providers', () => ({
  useHoldings: jest.fn(),
}));

describe('useByLocation', () => {
  it('return true if fromLocationId is in remoteMap and toLocationId is not', () => {
    const { result } = renderHook(() => useByLocation());
    expect(result.current({ fromLocationId: 'holdings-id-1', toLocationId: 'holdings-id-3' })).toBe(true);
  });
  it('return false if fromLocationId is not in remoteMap', () => {
    const { result } = renderHook(() => useByLocation());
    expect(result.current({ fromLocationId: 'holdings-id-4', toLocationId: 'holdings-id-2' })).toBe(false);
  });
  it('return false if toLocationId is in remoteMap', () => {
    const { result } = renderHook(() => useByLocation());
    expect(result.current({ fromLocationId: 'holdings-id-1', toLocationId: 'holdings-id-2' })).toBe(false);
  });
});

describe('useByHoldings', () => {
  beforeEach(() => {
    useHoldings.mockReturnValue({ holdingsById: {
      'holdings-id-1': { permanentLocationId: 'holdings-id-1' },
      'holdings-id-2': { permanentLocationId: 'holdings-id-2' },
    } });
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('return true if from location is in remote storage and to location is not', () => {
    const { result } = renderHook(() => useByHoldings());
    expect(result.current({ fromHoldingsId: 'holdings-id-1', toHoldingsId: 'holdings-id-3' })).toBe(true);
  });
  it('return false if holdingsById is undefined', () => {
    useHoldings.mockReturnValueOnce({ holdingsById: undefined });
    const { result } = renderHook(() => useByHoldings());
    expect(result.current({ fromHoldingsId: 'holdings-id-1', toHoldingsId: 'holdings-id-2' })).toBe(false);
  });
  it('return false if from location is not in remote storage', () => {
    const { result } = renderHook(() => useByHoldings());
    expect(result.current({ fromHoldingsId: 'holdings-id-3', toHoldingsId: 'holdings-id-2' })).toBe(false);
  });
  it('return false if to location is in remote storage', () => {
    useHoldings.mockReturnValueOnce({ holdingsById: {
      'holdings-id-1': { permanentLocationId: 'holdings-id-1' },
      'holdings-id-2': { permanentLocationId: 'holdings-id-2' },
    } });
    const { result } = renderHook(() => useByHoldings());
    expect(result.current({ fromHoldingsId: 'holdings-id-1', toHoldingsId: 'holdings-id-2' })).toBe(false);
  });
});

