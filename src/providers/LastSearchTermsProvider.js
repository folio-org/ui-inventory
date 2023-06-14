import { useMemo } from 'react';
import PropTypes from 'prop-types';

import { useNamespace } from '@folio/stripes/core';

import { LastSearchTermsContext } from '../contexts';
import { getItem, setItem } from '../storage';
import { INIT_PAGE_CONFIG } from '../hooks/useInventoryBrowse';
import { useLogout } from '../hooks';
import { segments } from '../constants';

const LastSearchTermsProvider = ({ children }) => {
  const [namespace] = useNamespace();

  const resetStorageAfterLogout = () => {
    setItem(`${namespace}/search.lastSearch`, null);
    setItem(`${namespace}/browse.lastSearch`, null);
    setItem(`${namespace}/search.lastOffset`, null);
    setItem(`${namespace}/browse.lastOffset`, null);
    setItem(`${namespace}/search.segment`, null);
  };

  useLogout(resetStorageAfterLogout);

  const getLastSegment = () => getItem(`${namespace}.search.lastSegment`) || segments.instances;
  const getLastSearch = (segment = getLastSegment()) => getItem(`${namespace}/search.${segment}.lastSearch`) || '';
  const getLastBrowse = () => getItem(`${namespace}/browse.lastSearch`) || '';
  const getLastSearchOffset = (segment) => getItem(`${namespace}/search.${segment}.lastOffset`) || 0;
  const getLastBrowseOffset = () => getItem(`${namespace}/browse.lastOffset`) || INIT_PAGE_CONFIG;
  const storeLastSearch = (search, segment) => setItem(`${namespace}/search.${segment}.lastSearch`, search);
  const storeLastBrowse = (search) => setItem(`${namespace}/browse.lastSearch`, search);
  const storeLastSearchOffset = (resultOffset, segment) => setItem(`${namespace}/search.${segment}.lastOffset`, resultOffset);
  const storeLastBrowseOffset = (pageConfig) => setItem(`${namespace}/browse.lastOffset`, pageConfig);
  const storeLastSegment = (segment) => setItem(`${namespace}.search.lastSegment`, segment);

  const lastSearchTerms = useMemo(() => ({
    getLastSearch,
    getLastBrowse,
    getLastSearchOffset,
    getLastBrowseOffset,
    getLastSegment,
    storeLastSearch,
    storeLastBrowse,
    storeLastSearchOffset,
    storeLastBrowseOffset,
    storeLastSegment,
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
