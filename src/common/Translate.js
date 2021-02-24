import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

export const Translate = ({ id, ...rest }) => <FormattedMessage id={`ui-inventory.${id}`} values={rest} />;

Translate.propTypes = {
  id: PropTypes.string.isRequired,
};

export default Translate;
