import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';


export const Heading = () => <FormattedMessage id="ui-inventory.remote.confirmation.heading" />;


export const Message = ({ count = 1 }) => (
  <FormattedMessage
    id="ui-inventory.remote.confirmation.message"
    values={{ something: <FormattedMessage id="ui-inventory.remote.items" values={{ count }} /> }}
  />
);

Message.propTypes = {
  count: PropTypes.number,
};
