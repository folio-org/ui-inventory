import React, { useCallback } from 'react';
import ReactRouterPropTypes from 'react-router-prop-types';
import { FormattedMessage } from 'react-intl';

import { Pluggable } from '@folio/stripes/core';

export const CreateMarcBibRoute = ({ match, history, location }) => {
  const { path } = match;

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
    history.push(`edit-bibliographic/${id}`);
  }, []);

  return (
    <div data-test-inventory-quick-marc>
      <Pluggable
        type="quick-marc"
        onClose={onClose}
        onSave={onClose}
        externalRecordPath="/inventory/view"
        action="create"
        marcType="bibliographic"
        isShared={searchParams.get('shared')}
        useRoutes={false}
        onCreateAndKeepEditing={onCreateAndKeepEditing}
      >
        <span data-test-inventory-quick-marc-no-plugin>
          <FormattedMessage id="ui-inventory.quickMarcNotAvailable" />
        </span>
      </Pluggable>
    </div>
  );
};

CreateMarcBibRoute.propTypes = {
  match: ReactRouterPropTypes.match.isRequired,
  history: ReactRouterPropTypes.match.isRequired,
  location: ReactRouterPropTypes.match.isRequired,
};
