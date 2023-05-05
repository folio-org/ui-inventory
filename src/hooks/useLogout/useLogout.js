import { useEffect } from 'react';
import { useNamespace } from '@folio/stripes/core';
import { useHistory } from 'react-router-dom';
import { getItem, setItem } from '../../storage';

// In this useEffect we are waiting for the user's logout to do something afterwards.
const useLogout = (cb, persistKey) => {
  const history = useHistory();
  const [namespace] = useNamespace();

  useEffect(() => {
    const logoutListenerKey = `${namespace}.${persistKey || 'logout-listener-registered'}`;
    const isListenerListening = getItem(logoutListenerKey);

    const resetListenerRegister = () => {
      setItem(logoutListenerKey, null);
    };

    if (!isListenerListening) {
      // The history.listen resets itself after a page refresh, so we need to fire it again by resetting the flag.
      window.addEventListener('beforeunload', resetListenerRegister);

      const unlisten = history.listen(location => {
        const isLogout = location.pathname === '/';

        if (isLogout) {
          cb();
          resetListenerRegister();
          window.removeEventListener('beforeunload', resetListenerRegister);
          unlisten();
        }
      });

      setItem(logoutListenerKey, true);
    }
  }, []);
};

export default useLogout;
