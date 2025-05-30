import {
  renderHook,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import { useResourcesIds } from './useResourcesIds';

describe('useResourcesIds', () => {
  const mockPost = jest.fn().mockImplementation(() => ({
    json: () => Promise.resolve({
      id: 'job-id',
      status: 'IN_PROGRESS',
    }),
  }));

  describe('when job is is complete', () => {
    const mockGet = jest.fn().mockImplementation(() => ({
      json: () => Promise.resolve({
        id: 'job-id',
        status: 'IN_PROGRESS',
      }),
    }));

    beforeEach(() => {
      useOkapiKy.mockReturnValue({
        post: mockPost,
        get: mockGet,
      });
    });

    it('should create a job and get it`s status', async () => {
      const { result } = renderHook(() => useResourcesIds());

      const query = 'keyword all *';
      const entityType = 'INSTANCE';

      result.current.getResourcesIds(query, entityType);

      waitFor(() => {
        expect(mockPost).toHaveBeenCalledWith('search/resources/jobs', {
          json: { query, entityType },
        });
        expect(mockGet).toHaveBeenCalledWith('search/resources/jobs/job-id');
        expect(mockGet).not.toHaveBeenCalledWith('search/resources/jobs/job-id/ids');
      });
    });
  });

  describe('when job status is not IN_PROGRESS', () => {
    const mockGet = jest.fn().mockImplementation(() => ({
      json: () => Promise.resolve({
        id: 'job-id',
        status: 'COMPLETED',
      }),
    }));

    beforeEach(() => {
      useOkapiKy.mockReturnValue({
        post: mockPost,
        get: mockGet,
      });
    });

    it('should fetch resources ids', async () => {
      const { result } = renderHook(() => useResourcesIds());

      const query = 'keyword all *';
      const entityType = 'INSTANCE';

      result.current.getResourcesIds(query, entityType);

      await waitFor(() => {
        expect(mockPost).toHaveBeenCalledWith('search/resources/jobs', {
          json: { query, entityType },
        });
        expect(mockGet).toHaveBeenCalledWith('search/resources/jobs/job-id/ids');
      });
    });
  });

  describe('when job takes a long time to complete', () => {
    const mockJson = jest.fn().mockResolvedValue({
      id: 'job-id',
      status: 'IN_PROGRESS',
    });
    const mockGet = jest.fn().mockImplementation(() => ({
      json: mockJson,
    }));

    beforeEach(() => {
      jest.useFakeTimers();
      jest.spyOn(global, 'setTimeout');

      useOkapiKy.mockReturnValue({
        post: mockPost,
        get: mockGet,
      });
    });

    it('should keep checking job status', async () => {
      const { result } = renderHook(() => useResourcesIds());

      const query = 'keyword all *';
      const entityType = 'INSTANCE';

      result.current.getResourcesIds(query, entityType);

      expect(mockPost).toHaveBeenCalledWith('search/resources/jobs', {
        json: { query, entityType },
      });

      await waitFor(() => {
        expect(mockGet).toHaveBeenCalledTimes(1);
        expect(mockGet).not.toHaveBeenCalledWith('search/resources/jobs/job-id/ids');
      });

      jest.runAllTimers();

      await waitFor(() => {
        expect(mockGet).toHaveBeenCalledTimes(2);
        expect(mockGet).not.toHaveBeenCalledWith('search/resources/jobs/job-id/ids');
      });

      mockJson.mockResolvedValue({
        id: 'job-id',
        status: 'COMPLETED',
      });
      jest.runAllTimers();

      await waitFor(() => {
        // 4 because 3 get calls for job status and 1 call for ids
        expect(mockGet).toHaveBeenCalledTimes(4);
        expect(mockGet).toHaveBeenCalledWith('search/resources/jobs/job-id/ids');
      });
    });
  });
});
