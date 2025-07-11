import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import { AppIcon } from '@folio/stripes/core';
import {
  Pane,
  Icon,
} from '@folio/stripes/components';

const InstanceLoadingPane = ({ onClose }) => {
  const intl = useIntl();

  return (
    <Pane
      data-test-instance-details
      appIcon={<AppIcon app="inventory" iconKey="instance" />}
      paneTitle={intl.formatMessage({ id: 'ui-inventory.edit' })}
      dismissible
      onClose={onClose}
      defaultWidth="fill"
    >
      <Icon
        icon="spinner-ellipsis"
        width="100px"
      />
    </Pane>
  );
};

InstanceLoadingPane.propTypes = { onClose: PropTypes.func.isRequired };

export default InstanceLoadingPane;
