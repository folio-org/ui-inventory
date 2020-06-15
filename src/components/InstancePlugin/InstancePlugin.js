import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Pluggable } from '@folio/stripes/core';

const InstancePlugin = ({ onSelect, ...props }) => (
  <>
    <Pluggable
      {...props}
      aria-haspopup="true"
      dataKey="instances"
      selectInstance={onSelect}
      type="find-instance"
    >
      <span><FormattedMessage id="ui-inventory.findInstancePluginNotFound" /></span>
    </Pluggable>
  </>
);

InstancePlugin.propTypes = {
  onSelect: PropTypes.func.isRequired,
};

export default InstancePlugin;
