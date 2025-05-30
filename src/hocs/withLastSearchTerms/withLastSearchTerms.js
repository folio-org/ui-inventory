import React from 'react';

import { useLastSearchTerms } from '../../hooks';

const withLastSearchTerms = (WrappedComponent) => {
  const LastSearchTerms = (props) => {
    const lastSearchTerms = useLastSearchTerms();

    return <WrappedComponent {...lastSearchTerms} {...props} />;
  };

  LastSearchTerms.manifest = WrappedComponent.manifest;

  return LastSearchTerms;
};

export default withLastSearchTerms;
