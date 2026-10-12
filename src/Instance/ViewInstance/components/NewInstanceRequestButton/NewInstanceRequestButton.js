import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import { IfPermission } from '@folio/stripes/core';
import {
  Button,
  Icon,
} from '@folio/stripes/components';

import { layers } from '../../../../constants';

export const getInstanceRequestLink = (instanceId) => `/requests?instanceId=${instanceId}&layer=${layers.CREATE}`;

const NewInstanceRequestButton = ({
  isTlrEnabled,
  instanceId,
}) => {
  const { formatMessage } = useIntl();

  if (!isTlrEnabled) {
    return null;
  }

  return (
    <IfPermission perm="ui-requests.create">
      <Button
        to={getInstanceRequestLink(instanceId)}
        buttonStyle="dropdownItem"
      >
        <Icon icon="plus-sign">
          {formatMessage({ id: 'ui-inventory.newRequest' })}
        </Icon>
      </Button>
    </IfPermission>
  );
};

NewInstanceRequestButton.propTypes = {
  isTlrEnabled: PropTypes.bool.isRequired,
  instanceId: PropTypes.string.isRequired,
};

export default NewInstanceRequestButton;
