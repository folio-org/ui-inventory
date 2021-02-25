import React from 'react';
import PropTypes from 'prop-types';

import { Translate } from '../common';


export const Heading = () => <Translate id="Removing from remote storage" />;


export const Message = ({ count = 1 }) => (
  <Translate
    id="Are you sure you want to remove {something} from remote storage?"
    something={<Translate id="{count} items" count={count} />}
  />
);

Message.propTypes = {
  count: PropTypes.number,
};
