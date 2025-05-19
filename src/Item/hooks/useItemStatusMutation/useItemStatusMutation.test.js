import { renderHook, act } from '@folio/jest-config-stripes/testing-library/react';

import useItemStatusMutation from './useItemStatusMutation';

import useCirculationItemRequestsQuery from '../../../hooks/useCirculationItemRequestsQuery';
import useItemRequestsMutation from '../useItemRequestsMutation';
import useMarkItem from '../useMarkItem';

import { REQUEST_OPEN_STATUSES } from '../../../constants';

jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  useOkapiKy: jest.fn(),
}));

jest.mock('../../../hooks/useCirculationItemRequestsQuery', () => jest.fn());
jest.mock('../useItemRequestsMutation', () => jest.fn());
jest.mock('../useMarkItem', () => jest.fn());

const aYearFromNow = new Date();
aYearFromNow.setFullYear(aYearFromNow.getFullYear() + 1);

const mockItemId = 'item-123';
const mockRefetchItem = jest.fn();
const mockMutateRequests = jest.fn();
const mockMarkItemAs = jest.fn();
const mockRequest = {
  item: {
    id: 'request-123',
    status: 'Awaiting pickup',
  },
  holdShelfExpirationDate: aYearFromNow,
};

describe('useItemStatusMutation', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    useCirculationItemRequestsQuery.mockReturnValue({
      requests: [mockRequest],
    });

    useItemRequestsMutation.mockReturnValue({
      mutateRequests: mockMutateRequests,
    });

    useMarkItem.mockReturnValue({
      markItemAs: mockMarkItemAs,
    });
  });

  it('should mark item as missing', async () => {
    const { result } = renderHook(() => useItemStatusMutation(mockItemId, mockRefetchItem));

    await act(async () => {
      await result.current.markItemAsMissing();
    });

    expect(mockMutateRequests).toHaveBeenCalledWith({
      ...mockRequest,
      status: REQUEST_OPEN_STATUSES.OPEN_NOT_YET_FILLED,
    });
    expect(mockMarkItemAs).toHaveBeenCalledWith({
      itemId: mockItemId,
      markAs: 'mark-missing',
    });
    expect(mockRefetchItem).toHaveBeenCalled();
  });

  it('should mark item as withdrawn', async () => {
    const { result } = renderHook(() => useItemStatusMutation(mockItemId, mockRefetchItem));

    await act(async () => {
      await result.current.markItemAsWithdrawn();
    });

    expect(mockMarkItemAs).toHaveBeenCalledWith({
      itemId: mockItemId,
      markAs: 'mark-withdrawn',
    });
    expect(mockRefetchItem).toHaveBeenCalled();
  });

  it('should mark item with specific status', async () => {
    const { result } = renderHook(() => useItemStatusMutation(mockItemId, mockRefetchItem));
    const status = 'LONG_MISSING';

    await act(async () => {
      await result.current.markItemWithStatus(status);
    });

    expect(mockMarkItemAs).toHaveBeenCalledWith({
      itemId: mockItemId,
      markAs: 'mark-long-missing',
    });
    expect(mockRefetchItem).toHaveBeenCalled();
  });

  it('should not mark request as open if request cannot be marked as open', async () => {
    useCirculationItemRequestsQuery.mockReturnValue({
      requests: [{
        item: {
          ...mockRequest,
          status: 'Closed - Cancelled',
        },
      }],
    });

    const { result } = renderHook(() => useItemStatusMutation(mockItemId, mockRefetchItem));

    await act(async () => {
      await result.current.markItemAsMissing();
    });

    expect(mockMutateRequests).not.toHaveBeenCalled();
    expect(mockMarkItemAs).toHaveBeenCalledWith({
      itemId: mockItemId,
      markAs: 'mark-missing',
    });
    expect(mockRefetchItem).toHaveBeenCalled();
  });

  it('should handle case when there are no requests', async () => {
    useCirculationItemRequestsQuery.mockReturnValue({
      requests: [],
    });

    const { result } = renderHook(() => useItemStatusMutation(mockItemId, mockRefetchItem));

    await act(async () => {
      await result.current.markItemAsMissing();
    });

    expect(mockMutateRequests).not.toHaveBeenCalled();
    expect(mockMarkItemAs).toHaveBeenCalledWith({
      itemId: mockItemId,
      markAs: 'mark-missing',
    });
    expect(mockRefetchItem).toHaveBeenCalled();
  });
});
