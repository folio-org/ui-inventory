import { useCallback } from 'react';
import {
  useQuery,
  useMutation,
} from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

export const useAuditSettings = ({ tenantId, group, enabled = true } = {}) => {
  const ky = useOkapiKy({ tenant: tenantId });
  const [namespace] = useNamespace({ key: 'audit-settings' });

  const path = `audit/config/groups/${group}/settings`;

  const { data, isLoading, isError, refetch } = useQuery(
    [namespace, group, tenantId],
    () => ky.get(path).json(),
    {
      enabled,
    },
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
