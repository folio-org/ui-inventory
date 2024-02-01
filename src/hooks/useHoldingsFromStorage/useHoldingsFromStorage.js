import useSessionStorageState from 'use-session-storage-state';

import { useNamespace } from '@folio/stripes/core';

const useHoldingsFromStorage = ({ defaultValue = {} }) => {
  const [namespace] = useNamespace();
  const key = `${namespace}.instanceHoldingsAccordionsState`;

  return useSessionStorageState(key, { defaultValue });
};

export default useHoldingsFromStorage;
