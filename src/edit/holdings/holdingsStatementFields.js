import React from 'react';
import PropTypes from 'prop-types';
import { TextField } from '@folio/stripes/components';
import RepeatableField from '../../components/RepeatableField';

const HoldingsStatementFields = ({ formatMsg }) => (
  <RepeatableField
    name="holdingsStatements"
    label={formatMsg({ id: 'ui-inventory.holdingsStatements' })}
    addLabel={formatMsg({ id: 'ui-inventory.addHoldingsStatement' })}
    addButtonId="clickable-add-holdingsstatement"
    template={[{
      label: formatMsg({ id: 'ui-inventory.holdingsStatement' }),
      component: TextField,
    }]}
  />
);

HoldingsStatementFields.propTypes = { formatMsg: PropTypes.func };
export default HoldingsStatementFields;
