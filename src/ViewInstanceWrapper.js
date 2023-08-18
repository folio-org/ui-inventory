import React from 'react';
import PropTypes from 'prop-types';

import { checkIfUserInMemberTenant } from '@folio/stripes/core';
import { withTags } from '@folio/stripes/smart-components';

import ViewInstance from './ViewInstance';
import { useUserTenantPermissions } from './hooks';
import { checkIfSharedInstance } from './utils';
import {
  useSearchInstanceByIdQuery,
  useInstanceQuery,
} from './common';

const ViewInstanceWrapper = (props) => {
  const {
    match: { params: { id } },
    stripes,
  } = props;

  const userId = stripes?.user?.user?.id;
  const centralTenantId = stripes.user.user?.consortium?.centralTenantId;

  const { instance: selectedInstance } = useSearchInstanceByIdQuery(id);
  const { instance } = useInstanceQuery(
    id,
    { tenantId: selectedInstance?.tenantId },
    { enabled: Boolean(id && selectedInstance?.tenantId) }
  );

  const {
    userPermissions: centralTenantPermissions,
    isFetching: isCentralTenantPermissionsLoading,
  } = useUserTenantPermissions({
    userId,
    tenantId: centralTenantId,
  }, {
    enabled: userId && centralTenantId && checkIfUserInMemberTenant(stripes) && checkIfSharedInstance(stripes, instance),
  });

  return (
    <ViewInstance
      {...props}
      selectedInstance={instance}
      centralTenantPermissions={centralTenantPermissions}
      isCentralTenantPermissionsLoading={isCentralTenantPermissionsLoading}
    />
  );
};

ViewInstanceWrapper.propTypes = {
  stripes: PropTypes.object.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  }),
};

export default withTags(ViewInstanceWrapper);
