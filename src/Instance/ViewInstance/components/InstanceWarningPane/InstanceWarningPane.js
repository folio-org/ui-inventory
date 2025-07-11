import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import { AppIcon } from '@folio/stripes/core';
import {
  Pane,
  MessageBanner,
} from '@folio/stripes/components';

const InstanceWarningPane = ({
  onClose,
  messageBannerText,
}) => {
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
      <MessageBanner type="warning">
        {messageBannerText}
      </MessageBanner>
    </Pane>
  );
};

InstanceWarningPane.propTypes = {
  onClose: PropTypes.func.isRequired,
  messageBannerText: PropTypes.oneOfType([PropTypes.element, PropTypes.string]).isRequired,
};

export default InstanceWarningPane;
