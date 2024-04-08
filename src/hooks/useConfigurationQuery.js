import { useQuery } from 'react-query';
import { useOkapiKy, useNamespace } from '@folio/stripes/core';

const useConfigurationQuery = (configName) => {
  const ky = useOkapiKy().extend({ timeout: false });
  const [namespace] = useNamespace();
  const query = `query=(module=INVENTORY and configName=${configName})`;

  const queryKey = [namespace, query, 'useConfigurationQuery'];


  const queryFn = () => ky.get(`configurations/entries?${query}`).json();
  const { data: { configs: { 0: settings = {} } = [], totalRecords } = {}, isLoading, isFetching } = useQuery({ queryKey, queryFn });

  let parsedSettings = {};
  if (settings.value) {
    try {
      parsedSettings = JSON.parse(settings.value);
    } catch (error) {
      // Error parsing settings JSON
      console.error(error); // eslint-disable-line no-console
    }
  }

  return {
    isFetching,
    isLoading,
    configs: parsedSettings,
    totalRecords,
  };
};

export default useConfigurationQuery;
