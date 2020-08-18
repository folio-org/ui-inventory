import React from 'react';
import { FormattedMessage } from 'react-intl';

import { TextField } from '@folio/stripes/components';

import RepeatableField from '../../components/RepeatableField';

const HoldingsStatementForSupplementsFields = () => (
  <RepeatableField
    name="holdingsStatementsForSupplements"
    addLabel={<FormattedMessage id="ui-inventory.addHoldingsStatementForSupplements" />}
    addButtonId="clickable-add-holdingsstatementforsupplements"
    template={[
      {
        name: 'statement',
        label: <FormattedMessage id="ui-inventory.holdingsStatementForSupplements" />,
        component: TextField,
      },
      {
        name: 'note',
        label: <FormattedMessage id="ui-inventory.holdingsStatementForSupplementsPublicNote" />,
        component: TextField,
      },
      {
        name: 'staffNote',
        label: <FormattedMessage id="ui-inventory.holdingsStatementForSupplementsStaffNote" />,
        component: TextField,
      },
    ]}
  />
);

export default HoldingsStatementForSupplementsFields;
