import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

import {
  MOD_SETTINGS_API,
  NUMBER_GENERATOR_SETTINGS_KEY,
  NUMBER_GENERATOR_SETTINGS_SCOPE,
} from '../../../settings/NumberGeneratorSettings/constants';

export const useNumberGeneratorOptions = () => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace('number-generator-options');

  const searchParams = {
    limit: 1,
    query: `scope==${NUMBER_GENERATOR_SETTINGS_SCOPE} and key==${NUMBER_GENERATOR_SETTINGS_KEY}`,
  };

  const {
    data,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [namespace],
    queryFn: async () => {
      const response = await ky.get(MOD_SETTINGS_API, { searchParams }).json();
      const settingValue = response?.items?.[0]?.value;

      return {
        accessionNumber: settingValue.accessionNumber || '',
        barcode: settingValue.barcode || '',
        callNumber: settingValue.callNumber || '',
        callNumberHoldings: settingValue.callNumberHoldings || '',
        useSharedNumber: settingValue.useSharedNumber ?? false,
      };
    },
  });

  return ({
    data,
    isLoading,
    refetch,
  });
};
