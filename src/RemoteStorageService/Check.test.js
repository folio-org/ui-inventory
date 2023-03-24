import { renderHook } from '@testing-library/react-hooks';
import { useRemoteStorageMappings } from '@folio/stripes/smart-components';
import { useHoldings } from '../providers';
import { useByLocation, useByHoldings } from './Check';

jest.mock('@folio/stripes/smart-components', () => ({
  useRemoteStorageMappings: jest.fn(),
}));

jest.mock('../providers', () => ({
  useHoldings: jest.fn(),
}));

describe('useByLocation', () => {
  it('return true if fromLocationId is in remoteMap and toLocationId is not', () => {
    const remoteMap = { 'fromLocationId': 'remoteStorageId' };
    useRemoteStorageMappings.mockReturnValueOnce(remoteMap);
    const { result } = renderHook(() => useByLocation());
    expect(result.current({ fromLocationId: 'fromLocationId', toLocationId: 'toLocationId' })).toBe(true);
  });
  it('return false if fromLocationId is not in remoteMap', () => {
    const remoteMap = { 'otherLocationId': 'remoteStorageId' };
    useRemoteStorageMappings.mockReturnValueOnce(remoteMap);
    const { result } = renderHook(() => useByLocation());
    expect(result.current({ fromLocationId: 'fromLocationId', toLocationId: 'toLocationId' })).toBe(false);
  });
  it('return false if toLocationId is in remoteMap', () => {
    const remoteMap = { 'toLocationId': 'remoteStorageId' };
    useRemoteStorageMappings.mockReturnValueOnce(remoteMap);
    const { result } = renderHook(() => useByLocation());
    expect(result.current({ fromLocationId: 'fromLocationId', toLocationId: 'toLocationId' })).toBe(false);
  });
});

describe('useByHoldings', () => {
  beforeEach(() => {
    useHoldings.mockReturnValue({ holdingsById: {
      1: { permanentLocationId: 'location1' },
      2: { permanentLocationId: 'location2' },
    } });
    useRemoteStorageMappings.mockReturnValue({ location1: true });
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('return true if from location is in remote storage and to location is not', () => {
    const { result } = renderHook(() => useByHoldings());
    expect(result.current({ fromHoldingsId: 1, toHoldingsId: 2 })).toBe(true);
  });
  it('return false if holdingsById is undefined', () => {
    useHoldings.mockReturnValueOnce({ holdingsById: undefined });
    const { result } = renderHook(() => useByHoldings());
    expect(result.current({ fromHoldingsId: 1, toHoldingsId: 2 })).toBe(false);
  });
  it('return false if from location is not in remote storage', () => {
    useRemoteStorageMappings.mockReturnValueOnce({});
    const { result } = renderHook(() => useByHoldings());
    expect(result.current({ fromHoldingsId: 1, toHoldingsId: 2 })).toBe(false);
  });
  it('return false if to location is in remote storage', () => {
    useHoldings.mockReturnValueOnce({ holdingsById: {
      1: { permanentLocationId: 'location1' },
      2: { permanentLocationId: 'location1' },
    } });
    const { result } = renderHook(() => useByHoldings());
    expect(result.current({ fromHoldingsId: 1, toHoldingsId: 2 })).toBe(false);
  });
});
