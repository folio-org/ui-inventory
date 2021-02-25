import React from 'react';
import PropTypes from 'prop-types';

import { Translate } from '../common';


export const Heading = () => <Translate id="remote.confirmation.heading" />;


export const Message = ({ count = 1 }) => (
  <Translate
    id="remote.confirmation.message"
    something={<Translate id="remote.items" count={count} />}
  />
);

Message.propTypes = {
  count: PropTypes.number,
};
