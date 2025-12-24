import React, { useCallback } from 'react';
import ReactRouterPropTypes from 'react-router-prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Pluggable,
  useStripes,
} from '@folio/stripes/core';

import { useInstanceQuery } from '../../common';

export const CreateMarcHoldingsRoute = ({ match, history, location }) => {
  const stripes = useStripes();

  const {
    externalId,
    instanceId,
  } = match.params;
  const searchParams = new URLSearchParams(location.search);
  const isShared = searchParams.get('shared') === 'true';
  const centralTenantId = stripes.user.user?.consortium?.centralTenantId;

  const { refetch } = useInstanceQuery(instanceId, { tenantId: isShared ? centralTenantId : '' });

  const fetchInstance = async () => {
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

  const onCreateAndKeepEditing = useCallback((id) => {
    history.push(`edit-holdings/${id}`);
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
        action="create"
        marcType="holdings"
        instanceId={instanceId}
        externalId={externalId}
        isShared={searchParams.get('shared')}
        useRoutes={false}
        fetchExternalRecord={fetchInstance}
      >
        <span data-test-inventory-quick-marc-no-plugin>
          <FormattedMessage id="ui-inventory.quickMarcNotAvailable" />
        </span>
      </Pluggable>
    </div>
  );
};

CreateMarcHoldingsRoute.propTypes = {
  match: ReactRouterPropTypes.match.isRequired,
  history: ReactRouterPropTypes.match.isRequired,
  location: ReactRouterPropTypes.match.isRequired,
};
