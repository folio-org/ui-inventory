import React from 'react';
import PropTypes from 'prop-types';
import {
  Icon,
} from '@folio/stripes/components';
import {
  FormattedMessage,
} from 'react-intl';

import css from './WarningMessage.css';

const WarningMessage = ({ id }) => (
  <>
    <Icon status="warn" iconClassName={css.icon} icon="exclamation-circle" iconSize="medium" />
    <FormattedMessage id={id} />
  </>
);

WarningMessage.propTypes = {
  id: PropTypes.string.isRequired,
};

export default WarningMessage;

