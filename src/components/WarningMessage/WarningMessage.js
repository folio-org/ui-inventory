import React from 'react';
import PropTypes from 'prop-types';
import {
  Icon,
} from '@folio/stripes/components';
import {
  FormattedMessage,
} from 'react-intl';

import css from './WarningMessage.css';

const renderIcon = (icon, iconClassName) => (
  <Icon
    status="warn"
    iconClassName={iconClassName}
    icon={icon}
    iconSize="medium"
  />
);

const WarningMessage = ({ id, icon, fill, iconPosition }) => (
  <div className={fill ? css.fill : ''}>
    {iconPosition === 'start' && renderIcon(icon, css.iconStart)}
    <FormattedMessage id={id} />
    {iconPosition === 'end' && renderIcon(icon, css.iconEnd)}
  </div>
);

WarningMessage.propTypes = {
  id: PropTypes.string.isRequired,
  icon: PropTypes.string,
  iconPosition: PropTypes.oneOf(['start', 'end']),
  fill: PropTypes.bool,
};

WarningMessage.defaultProps = {
  icon: 'exclamation-circle',
  iconPosition: 'start',
  fill: false,
};

export default WarningMessage;
