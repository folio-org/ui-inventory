import React from 'react';
import PropTypes from 'prop-types';

import { Translate } from '../common';


export const ForItems = ({ count = 1 }) => (
  <Translate
    id="remote.warning.common"
    something={<Translate id="remote.items" count={count} />}
  />
);

ForItems.propTypes = {
  count: PropTypes.number,
};


export const ForHoldings = ({ itemCount = 0 }) => (
  <>
    <Translate
      id="remote.warning.common"
      something={<Translate id="remote.holdings" />}
    />
    {' '}
    <Translate id="remote.warning.titles" count={itemCount} />
  </>
);

ForHoldings.propTypes = {
  itemCount: PropTypes.number,
};
