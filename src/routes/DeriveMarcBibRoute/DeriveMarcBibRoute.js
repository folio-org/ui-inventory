import { useCallback } from 'react';
import {
  useRouteMatch,
  useHistory,
  useLocation,
} from 'react-router';
import { FormattedMessage } from 'react-intl';

import {
  Pluggable,
  useStripes,
} from '@folio/stripes/core';

import { useInstanceQuery } from '../../common';

export const DeriveMarcBibRoute = () => {
  const stripes = useStripes();
  const history = useHistory();
  const match = useRouteMatch();
  const location = useLocation();

  const { externalId } = match.params;
  const searchParams = new URLSearchParams(location.search);
  const isShared = searchParams.get('shared') === 'true';
  const centralTenantId = stripes.user.user?.consortium?.centralTenantId;

  const { refetch } = useInstanceQuery(externalId, { tenantId: isShared ? centralTenantId : '' });

  const fetchInstance = async () => {
    const { data } = await refetch();

    return data;
  };

  const onClose = useCallback((recordRoute) => {
    const newSearchParams = new URLSearchParams(location.search);
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
        fetchExternalRecord={fetchInstance}
      >
        <span data-test-inventory-quick-marc-no-plugin>
          <FormattedMessage id="ui-inventory.quickMarcNotAvailable" />
        </span>
      </Pluggable>
    </div>
  );
};
