import React, { useCallback } from 'react';
import ReactRouterPropTypes from 'react-router-prop-types';
import { FormattedMessage } from 'react-intl';

import { Pluggable } from '@folio/stripes/core';

const QuickMarcRoute = ({ match, history, location }) => {
  const onClose = useCallback((instanceId) => {
    history.push({
      pathname: `/inventory/view/${instanceId}`,
      search: location.search,
    });
  }, [location.search]);

  return (
    <div data-test-inventory-quick-marc>
      <Pluggable
        type="quick-marc"
        basePath={match.path}
        onClose={onClose}
      >
        <span data-test-inventory-quick-marc-no-plugin>
          <FormattedMessage id="ui-inventory.quickMarcNotAvailable" />
        </span>
      </Pluggable>
    </div>
  );
};

QuickMarcRoute.propTypes = {
  match: ReactRouterPropTypes.match.isRequired,
  history: ReactRouterPropTypes.match.isRequired,
  location: ReactRouterPropTypes.match.isRequired,
};

export default QuickMarcRoute;
