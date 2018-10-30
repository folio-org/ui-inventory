import React from 'react';
import PropTypes from 'prop-types';
import { TextField } from '@folio/stripes/components';
import RepeatableField from '../../components/RepeatableField';

const HoldingsStatementForIndexesFields = ({ formatMsg }) => (
  <RepeatableField
    name="holdingsStatementsForIndexes"
    addLabel={formatMsg({ id: 'ui-inventory.addHoldingsStatementForIndexes' })}
    addButtonId="clickable-add-holdingsstatementforindexes"
    template={[
      {
        name: 'statement',
        label: formatMsg({ id: 'ui-inventory.holdingsStatementForIndexes' }),
        component: TextField,
      },
      {
        name: 'note',
        label: formatMsg({ id: 'ui-inventory.holdingsStatementForIndexesNote' }),
        component: TextField,
      },
    ]}
  />
);

HoldingsStatementForIndexesFields.propTypes = { formatMsg: PropTypes.func };
export default HoldingsStatementForIndexesFields;
