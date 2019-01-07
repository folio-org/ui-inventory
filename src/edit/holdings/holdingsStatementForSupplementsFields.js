import React from 'react';
import { FormattedMessage } from 'react-intl';

import {
  Icon,
  TextField,
} from '@folio/stripes/components';

import RepeatableField from '../../components/RepeatableField';

const HoldingsStatementForSupplementsFields = () => (
  <RepeatableField
    name="holdingsStatementsForSupplements"
    addLabel={
      <Icon icon="plus-sign">
        <FormattedMessage id="ui-inventory.addHoldingsStatementForSupplements" />
      </Icon>
    }
    addButtonId="clickable-add-holdingsstatementforsupplements"
    template={[
      {
        name: 'statement',
        label: <FormattedMessage id="ui-inventory.holdingsStatementForSupplements" />,
        component: TextField,
      },
      {
        name: 'note',
        label: <FormattedMessage id="ui-inventory.holdingsStatementForSupplementsNote" />,
        component: TextField,
      },
    ]}
  />
);

export default HoldingsStatementForSupplementsFields;
