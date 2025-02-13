import { useCallback } from 'react';
import {
  useQuery,
  useMutation,
} from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

export const useAuditSettings = ({ group } = {}) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'audit-settings' });

  const path = `audit/config/groups/${group}/settings`;

  const { data, isLoading, isError, refetch } = useQuery(
    [namespace, group],
    () => ky.get(path).json(),
  );

  const { mutateAsync } = useMutation({
    mutationFn: ({ body, settingKey }) => {
      return ky.put(`${path}/${settingKey}`, { json: body });
    },
  });

  const updateSetting = useCallback(async ({ body, settingKey }) => {
    const updateResult = await mutateAsync({ body, settingKey });
    await refetch();
    return updateResult;
  }, [mutateAsync, refetch]);

  return {
    settings: data?.settings,
    updateSetting,
    isSettingsLoading: isLoading,
    isError,
  };
};
