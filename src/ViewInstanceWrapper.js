import React from 'react';
import PropTypes from 'prop-types';

import { checkIfUserInMemberTenant } from '@folio/stripes/core';
import { withTags } from '@folio/stripes/smart-components';

import ViewInstance from './ViewInstance';
import { useUserTenantPermissions } from './hooks';
import { useInstance } from './common';

const ViewInstanceWrapper = (props) => {
  const {
    match: { params: { id } },
    stripes,
  } = props;

  const userId = stripes?.user?.user?.id;
  const centralTenantId = stripes.user.user?.consortium?.centralTenantId;
  const { instance } = useInstance(id);

  const isShared = instance?.shared;
  const tenantId = instance?.tenantId ?? stripes.okapi.tenant;

  const {
    userPermissions: centralTenantPermissions,
    isFetching: isCentralTenantPermissionsLoading,
  } = useUserTenantPermissions({
    userId,
    tenantId: centralTenantId,
  }, {
    enabled: Boolean(isShared && checkIfUserInMemberTenant(stripes)),
  });

  return (
    <ViewInstance
      {...props}
      isShared={isShared}
      tenantId={tenantId}
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
