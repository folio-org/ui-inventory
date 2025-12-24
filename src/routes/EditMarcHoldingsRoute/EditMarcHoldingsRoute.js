import React, { useCallback } from 'react';
import ReactRouterPropTypes from 'react-router-prop-types';
import { FormattedMessage } from 'react-intl';

import { Pluggable } from '@folio/stripes/core';
import { useHoldingQuery } from '../../common';

export const EditMarcHoldingsRoute = ({ match, history, location }) => {
  const {
    externalId,
    instanceId,
  } = match.params;
  const searchParams = new URLSearchParams(location.search);

  const { refetch } = useHoldingQuery(externalId);

  const fetchHolding = async () => {
    const { data } = await refetch();

    return data;
  };

  const onClose = useCallback((recordRoute) => {
    const newSearchParams = new URLSearchParams(location.search);
    newSearchParams.delete('relatedRecordVersion');
    newSearchParams.delete('shared');

    history.push({
      pathname: `/inventory/view/${recordRoute ?? ''}`,
      search: newSearchParams.toString(),
      state: {
        isClosingFocused: true,
      },
    });
  }, [location.search]);

  return (
    <div data-test-inventory-quick-marc>
      <Pluggable
        type="quick-marc"
        basePath={match.path}
        onClose={onClose}
        onSave={onClose}
        externalRecordPath="/inventory/view"
        action="edit"
        marcType="holdings"
        instanceId={instanceId}
        externalId={externalId}
        isShared={searchParams.get('shared')}
        useRoutes={false}
        fetchExternalRecord={fetchHolding}
      >
        <span data-test-inventory-quick-marc-no-plugin>
          <FormattedMessage id="ui-inventory.quickMarcNotAvailable" />
        </span>
      </Pluggable>
    </div>
  );
};

EditMarcHoldingsRoute.propTypes = {
  match: ReactRouterPropTypes.match.isRequired,
  history: ReactRouterPropTypes.match.isRequired,
  location: ReactRouterPropTypes.match.isRequired,
};
