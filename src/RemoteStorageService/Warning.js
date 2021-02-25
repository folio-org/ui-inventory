import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';


export const ForItems = ({ count = 1 }) => (
  <FormattedMessage
    id="ui-inventory.remote.warning.common"
    values={{ something: <FormattedMessage id="ui-inventory.remote.items" values={{ count }} /> }}
  />
);

ForItems.propTypes = {
  count: PropTypes.number,
};


export const ForHoldings = ({ itemCount = 0 }) => (
  <>
    <FormattedMessage
      id="ui-inventory.remote.warning.common"
      values={{ something: <FormattedMessage id="ui-inventory.remote.holdings" /> }}
    />
    {' '}
    <FormattedMessage id="ui-inventory.remote.warning.titles" values={{ count: itemCount }} />
  </>
);

ForHoldings.propTypes = {
  itemCount: PropTypes.number,
};
