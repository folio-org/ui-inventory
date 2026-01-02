import { useCallback } from 'react';
import {
  useRouteMatch,
  useHistory,
  useLocation,
} from 'react-router';
import { FormattedMessage } from 'react-intl';

import { Pluggable } from '@folio/stripes/core';

import { useHoldingQuery } from '../../common';

export const EditMarcHoldingsRoute = () => {
  const history = useHistory();
  const match = useRouteMatch();
  const location = useLocation();

  const {
    externalId,
    instanceId,
  } = match.params;
  const searchParams = new URLSearchParams(location.search);
  const isShared = searchParams.get('shared') === 'true';

  const { refetch } = useHoldingQuery(externalId);

  const fetchHolding = async () => {
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
        isShared={isShared}
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
