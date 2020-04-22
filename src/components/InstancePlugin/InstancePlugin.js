import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Pluggable } from '@folio/stripes/core';

import css from './InstancePlugin.css';

const InstancePlugin = ({ onSelect }) => (
  <div className={css.marginTop}>
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
  </div>
);

InstancePlugin.propTypes = {
  onSelect: PropTypes.func.isRequired,
};

export default InstancePlugin;
