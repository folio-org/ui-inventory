import React, { useMemo } from 'react';
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
  const consortiumId = stripes.user.user?.consortium?.id;
  const {
    instance,
    isLoading,
    refetch,
    isError,
    error,
  } = useInstance(id);

  const isShared = Boolean(instance?.shared);
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

  const flattenCentralTenantPermissions = useMemo(() => {
    // Set is used to collect unique permission names because subPermissions can duplicate
    return new Set(centralTenantPermissions?.reduce((acc, currentPermission) => {
      return [
        ...acc,
        currentPermission.permissionName,
        ...currentPermission.subPermissions,
      ];
    }, []));
  }, [centralTenantPermissions]);

  return (
    <ViewInstance
      {...props}
      isShared={isShared}
      tenantId={tenantId}
      centralTenantId={centralTenantId}
      consortiumId={consortiumId}
      refetchInstance={refetch}
      selectedInstance={instance}
      isLoading={isLoading}
      isError={isError}
      error={error}
      centralTenantPermissions={flattenCentralTenantPermissions}
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
