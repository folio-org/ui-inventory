import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Pluggable } from '@folio/stripes/core';

const InstancePlugin = ({ onSelect }) => (
  <Pluggable
    aria-haspopup="true"
    dataKey="instances"
    searchButtonStyle="default"
    searchLabel="+"
    selectInstance={onSelect}
    type="find-instance"
  >
    <span><FormattedMessage id="ui-inventory.findInstancePluginNotFound" /></span>
  </Pluggable>
);

InstancePlugin.propTypes = {
  onSelect: PropTypes.func.isRequired,
};

export default InstancePlugin;
