import React from 'react';
import PropTypes from 'prop-types';
import { TextField } from '@folio/stripes/components';
import RepeatableField from '../../components/RepeatableField';

const HoldingsStatementForSupplementsFields = ({ formatMsg }) => (
  <RepeatableField
    name="holdingsStatementsForSupplements"
    addLabel="+Add"
    addButtonId="clickable-add-holdingsstatementforsupplements"
    template={[
      {
        name: 'statement',
        label: formatMsg({ id: 'ui-inventory.holdingsStatementForSupplements' }),
        component: TextField,
      },
      {
        name: 'note',
        label: formatMsg({ id: 'ui-inventory.holdingsStatementForSupplementsNote' }),
        component: TextField,
      },
    ]}
  />
);

HoldingsStatementForSupplementsFields.propTypes = { formatMsg: PropTypes.func };
export default HoldingsStatementForSupplementsFields;
