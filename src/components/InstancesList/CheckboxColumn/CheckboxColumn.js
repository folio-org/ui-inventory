import React from 'react';
import PropTypes from 'prop-types';

const CheckboxColumn = ({ children }) => (
  <div // eslint-disable-line jsx-a11y/click-events-have-key-events
    tabIndex="0"
    role="button"
    onClick={e => e.stopPropagation()}
  >
    {children}
  </div>
);

CheckboxColumn.propTypes = { children: PropTypes.node.isRequired };

export default CheckboxColumn;
