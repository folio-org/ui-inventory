import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import { IfPermission } from '@folio/stripes/core';
import {
  Button,
  Icon,
} from '@folio/stripes/components';

export const getInstanceQueueReorderLink = (requestId, instanceId) => `/requests/view/${requestId}/${instanceId}/reorder`;

const RequestsReorderButton = ({
  hasReorderPermissions,
  requestId,
  instanceId,
  numberOfRequests,
}) => {
  const { formatMessage } = useIntl();

  if (!hasReorderPermissions || !numberOfRequests) {
    return null;
  }

  return (
    <IfPermission perm="ui-requests.reorderQueue.execute">
      <Button
        to={getInstanceQueueReorderLink(requestId, instanceId)}
        buttonStyle="dropdownItem"
      >
        <Icon icon="eye-open">
          {formatMessage({
            id: 'ui-inventory.viewAndReorderRequestsQueue',
          },
          {
            number: numberOfRequests,
          })}
        </Icon>
      </Button>
    </IfPermission>
  );
};

RequestsReorderButton.propTypes = {
  hasReorderPermissions: PropTypes.bool.isRequired,
  requestId: PropTypes.string,
  instanceId: PropTypes.string.isRequired,
  numberOfRequests: PropTypes.number,
};

export default RequestsReorderButton;
