import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import {
  checkIfUserInMemberTenant,
  useUserTenantPermissions,
} from '@folio/stripes/core';
import { withTags } from '@folio/stripes/smart-components';

import ViewInstance from './ViewInstance';
import {
  useInstanceMutation,
} from './hooks';
import { useInstance } from './common';
import { flattenCentralTenantPermissions } from './utils';

const ViewInstanceWrapper = (props) => {
  const {
    match: { params: { id } },
    stripes,
  } = props;

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

  const { mutateInstance: mutateEntity } = useInstanceMutation({ tenantId });
  const {
    userPermissions: centralTenantPermissions,
    isFetching: isCentralTenantPermissionsLoading,
  } = useUserTenantPermissions({
    tenantId: centralTenantId,
  }, {
    enabled: Boolean(isShared && checkIfUserInMemberTenant(stripes)),
  });

  const mutateInstance = (entity, { onError }) => {
    mutateEntity(entity, { onSuccess: refetch, onError });
  };

  const flattenedPermissions = useMemo(() => flattenCentralTenantPermissions(centralTenantPermissions), [centralTenantPermissions]);

  return (
    <ViewInstance
      {...props}
      isShared={isShared}
      tenantId={stripes.okapi.tenant}
      centralTenantId={centralTenantId}
      consortiumId={consortiumId}
      refetchInstance={refetch}
      mutateInstance={mutateInstance}
      selectedInstance={instance}
      isLoading={isLoading}
      isError={isError}
      error={error}
      centralTenantPermissions={flattenedPermissions}
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
