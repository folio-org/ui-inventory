import { useMemo } from 'react';
import PropTypes from 'prop-types';

import { useNamespace } from '@folio/stripes/core';

import { LastSearchTermsContext } from '../contexts';
import { getItem, setItem } from '../storage';
import { INIT_PAGE_CONFIG } from '../hooks/useInventoryBrowse';
import { useLogout } from '../hooks';

const LastSearchTermsProvider = ({ children }) => {
  const [namespace] = useNamespace();

  const resetStorageAfterLogout = () => {
    setItem(`${namespace}/search.lastSearch`, null);
    setItem(`${namespace}/browse.lastSearch`, null);
    setItem(`${namespace}/search.lastOffset`, null);
    setItem(`${namespace}/browse.lastOffset`, null);
  };

  useLogout(resetStorageAfterLogout);

  const getLastSearch = () => getItem(`${namespace}/search.lastSearch`) || '';
  const getLastBrowse = () => getItem(`${namespace}/browse.lastSearch`) || '';
  const getLastSearchOffset = () => getItem(`${namespace}/search.lastOffset`) || 0;
  const getLastBrowseOffset = () => getItem(`${namespace}/browse.lastOffset`) || INIT_PAGE_CONFIG;
  const storeLastSearch = (search) => setItem(`${namespace}/search.lastSearch`, search);
  const storeLastBrowse = (search) => setItem(`${namespace}/browse.lastSearch`, search);
  const storeLastSearchOffset = (resultOffset) => setItem(`${namespace}/search.lastOffset`, resultOffset);
  const storeLastBrowseOffset = (pageConfig) => setItem(`${namespace}/browse.lastOffset`, pageConfig);

  const lastSearchTerms = useMemo(() => ({
    getLastSearch,
    getLastBrowse,
    getLastSearchOffset,
    getLastBrowseOffset,
    storeLastSearch,
    storeLastBrowse,
    storeLastSearchOffset,
    storeLastBrowseOffset,
  }), []);

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
