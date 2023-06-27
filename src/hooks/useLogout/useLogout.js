import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import { useNamespace } from '@folio/stripes/core';

import registerLogoutListener from './utils';

// In this useEffect we are waiting for the user's logout to do something afterwards.
const useLogout = (cb, persistKey) => {
  const history = useHistory();
  const [namespace] = useNamespace();

  useEffect(() => {
    registerLogoutListener(cb, namespace, persistKey, history);
  }, []);
};

export default useLogout;
