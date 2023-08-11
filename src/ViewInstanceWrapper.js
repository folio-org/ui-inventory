import React from 'react';
import PropTypes from 'prop-types';
import { omit } from 'lodash';

import { checkIfUserInMemberTenant } from '@folio/stripes/core';
import { withTags } from '@folio/stripes/smart-components';

import ViewInstance from './ViewInstance';
import { useUserTenantPermissions } from './tmp/hooks';
import { checkIfSharedInstance } from './utils';

const ViewInstanceWrapper = (props) => {
  const {
    match: { params: { id } },
    resources,
    stripes,
  } = props;

  const instance = resources.instance?.records?.[0];
  const selectedInstance = instance?.id === id ? instance : null;
  const userId = stripes?.user?.user?.id;
  const centralTenantId = stripes.user.user?.consortium?.centralTenantId;

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
      {...omit(props, ['resources', 'mutator'])}
      selectedInstance={selectedInstance}
      centralTenantPermissions={centralTenantPermissions}
      isCentralTenantPermissionsLoading={isCentralTenantPermissionsLoading}
    />
  );
};

ViewInstanceWrapper.manifest = Object.freeze({
  instance: {
    type: 'okapi',
    path: 'inventory/instances/:{id}',
    resourceShouldRefresh: true,
    throwErrors: false,
  },
});

ViewInstanceWrapper.propTypes = {
  resources: PropTypes.shape({
    instance: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object),
    }),
  }).isRequired,
  stripes: PropTypes.object.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  }),
};

export default withTags(ViewInstanceWrapper);
