import React from 'react';
import PropTypes from 'prop-types';

import { Translate } from '../common';


export const ForItems = ({ count = 1 }) => (
  <Translate
    id="To remove {something} from remote storage..."
    something={<Translate id="{count} items" count={count} />}
  />
);

ForItems.propTypes = {
  count: PropTypes.number,
};


export const ForHoldings = ({ itemCount = 0 }) => (
  <>
    <Translate
      id="To remove {something} from remote storage..."
      something={<Translate id="the holdings" />}
    />
    {' '}
    <Translate id="This includes {count} titles" count={itemCount} />
  </>
);

ForHoldings.propTypes = {
  itemCount: PropTypes.number,
};
