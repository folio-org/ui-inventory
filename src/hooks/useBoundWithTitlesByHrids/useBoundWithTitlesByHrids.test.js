import React from 'react';
import { renderHook } from '@testing-library/react-hooks';

import '../../../test/jest/__mock__';

import useBoundWithTitlesByHrids from './useBoundWithTitlesByHrids';

jest.mock('../useHoldingsQueryByHrids', () => {
  const mockHoldingsRecords = {
    isLoading: false,
    holdingsRecords: [{
      instanceId: 'instanceId',
      hrid: 'holdingHrid',
      id: 'holdingId',
    }],
  };

  return () => mockHoldingsRecords;
});
jest.mock('../useInstancesQuery', () => {
  const mockInstances = {
    isSuccess: true,
    data: { instances: [
      {
        id: 'instanceId',
        hrid: 'instanceHrid',
        title: 'instanceTitle',
      },
    ] },
  };

  return () => mockInstances;
});

describe('useBoundWithTitlesByHrids', () => {
  it('should return boundWithTitles data', async () => {
    const { result, waitFor } = renderHook(() => useBoundWithTitlesByHrids(['holdingHrid']));

    await waitFor(() => !result.current.isLoading);

    const expectedResult = [{
      briefHoldingsRecord: {
        hrid: 'holdingHrid',
        id: 'holdingId',
      },
      briefInstance: {
        id: 'instanceId',
        hrid: 'instanceHrid',
        title: 'instanceTitle',
      },
    }];

    expect(result.current.boundWithTitles).toEqual(expectedResult);
  });
});

