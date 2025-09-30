import React, { useCallback } from 'react';
import ReactRouterPropTypes from 'react-router-prop-types';
import { FormattedMessage } from 'react-intl';

import { Pluggable } from '@folio/stripes/core';

export const DeriveMarcBibRoute = ({ match, history, location }) => {
  const { externalId } = match.params;

  const searchParams = new URLSearchParams(location.search);

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

  const onCreateAndKeepEditing = useCallback((id) => {
    history.push(`/inventory/quick-marc/edit-bibliographic/${id}`);
  }, []);

  return (
    <div data-test-inventory-quick-marc>
      <Pluggable
        type="quick-marc"
        basePath={match.path}
        onClose={onClose}
        onSave={onClose}
        onCreateAndKeepEditing={onCreateAndKeepEditing}
        externalRecordPath="/inventory/view"
        action="derive"
        marcType="bibliographic"
        externalId={externalId}
        isShared={searchParams.get('shared')}
        useRoutes={false}
      >
        <span data-test-inventory-quick-marc-no-plugin>
          <FormattedMessage id="ui-inventory.quickMarcNotAvailable" />
        </span>
      </Pluggable>
    </div>
  );
};

DeriveMarcBibRoute.propTypes = {
  match: ReactRouterPropTypes.match.isRequired,
  history: ReactRouterPropTypes.match.isRequired,
  location: ReactRouterPropTypes.match.isRequired,
};
