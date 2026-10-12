import { useOkapiKy } from '@folio/stripes/core';

// get job status polling interval, make it 5s by default
const GET_JOB_STATUS_POLLING_INTERVAL = 5000;
const JOB_IN_PROGRESS_STATUS = 'IN_PROGRESS';

const useResourcesIds = () => {
  const ky = useOkapiKy();

  const createJob = (query, entityType) => {
    return ky.post(
      'search/resources/jobs',
      {
        json: {
          query,
          entityType,
        },
      },
    ).json();
  };

  const waitForJobCompleted = async (jobId, pollingInterval) => {
    let job = null;
    do {
      job = await ky.get(`search/resources/jobs/${jobId}`).json();

      if (job?.status !== JOB_IN_PROGRESS_STATUS) {
        return job;
      }

      await new Promise(resolve => setTimeout(resolve, pollingInterval));
    } while (job?.status === JOB_IN_PROGRESS_STATUS);

    return job;
  };

  const getIds = (jobId) => {
    return ky.get(`search/resources/jobs/${jobId}/ids`).json();
  };

  const getResourcesIds = async (query, entityType, pollingInterval = GET_JOB_STATUS_POLLING_INTERVAL) => {
    const job = await createJob(query, entityType);

    await waitForJobCompleted(job.id, pollingInterval);

    const data = await getIds(job.id);

    return data.ids;
  };

  return {
    getResourcesIds,
  };
};

export { useResourcesIds };
