import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';

import { useNamespace } from '@folio/stripes/core';

import { LastSearchTermsContext } from '../contexts';
import { getItem, setItem } from '../storage';
import { INIT_PAGE_CONFIG } from '../hooks/useInventoryBrowse';

const LastSearchTermsProvider = ({ children }) => {
  const [namespace] = useNamespace();
  const history = useHistory();

  const getLastSearch = () => getItem(`${namespace}/search.lastSearch`) || '';
  const getLastBrowse = () => getItem(`${namespace}/browse.lastSearch`) || '';
  const getLastSearchOffset = () => getItem(`${namespace}/search.lastOffset`) || 0;
  const getLastBrowseOffset = () => getItem(`${namespace}/browse.lastOffset`) || INIT_PAGE_CONFIG;
  const storeLastSearch = (search) => setItem(`${namespace}/search.lastSearch`, search);
  const storeLastBrowse = (search) => setItem(`${namespace}/browse.lastSearch`, search);
  const storeLastSearchOffset = (resultOffset) => setItem(`${namespace}/search.lastOffset`, resultOffset);
  const storeLastBrowseOffset = (pageConfig) => setItem(`${namespace}/browse.lastOffset`, pageConfig);

  // In this useEffect we wait for the user's logout to reset the last search terms in the session storage.
  useEffect(() => {
    const listenerRegisteredKey = `${namespace}.logout-listener-registered`;
    const isListenerRegistered = getItem(listenerRegisteredKey);

    const resetListenerRegister = () => {
      setItem(listenerRegisteredKey, null);
    };

    window.addEventListener('beforeunload', () => {
      // The listener resets itself after a page refresh, so we need to fire it again.
      resetListenerRegister();
    });

    if (!isListenerRegistered) {
      const resetListener = history.listen(location => {
        const isLogout = location.pathname === '/';

        if (isLogout) {
          setItem(`${namespace}/search.lastSearch`, null);
          setItem(`${namespace}/browse.lastBrowse`, null);
          setItem(`${namespace}/search.lastOffset`, null);
          setItem(`${namespace}/browse.lastOffset`, null);
          resetListenerRegister();
          resetListener();
        }
      });

      setItem(listenerRegisteredKey, true);
    }
  }, []);

  const lastSearchTerms = {
    getLastSearch,
    getLastBrowse,
    getLastSearchOffset,
    getLastBrowseOffset,
    storeLastSearch,
    storeLastBrowse,
    storeLastSearchOffset,
    storeLastBrowseOffset,
  };

  return (
    <LastSearchTermsContext.Provider value={lastSearchTerms}>
      {children}
    </LastSearchTermsContext.Provider>
  );
};

LastSearchTermsProvider.propTypes = {
  children: PropTypes.object,
};

export default LastSearchTermsProvider;


