import React from 'react';
import PropTypes from 'prop-types';

import { IfPermission } from '@folio/stripes/core';

import { CreateRequestButton } from '../../../components';
import { layers } from '../../../constants';

export const getInstanceRequestLink = (instanceId) => `/requests?instanceId=${instanceId}&layer=${layers.CREATE}`;

const NewInstanceRequestButton = ({
  isTlrEnabled,
  instanceId,
}) => {
  if (!isTlrEnabled) {
    return null;
  }

  return (
    <IfPermission perm="ui-requests.create">
      <CreateRequestButton newRequestLink={getInstanceRequestLink(instanceId)} />
    </IfPermission>
  );
};

NewInstanceRequestButton.propTypes = {
  isTlrEnabled: PropTypes.bool.isRequired,
  instanceId: PropTypes.string.isRequired,
};

export default NewInstanceRequestButton;
