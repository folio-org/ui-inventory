import React from 'react';
import { FormattedMessage } from 'react-intl';

import { TextArea } from '@folio/stripes/components';

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
        component: TextArea,
        rows: 1,
      },
      {
        name: 'note',
        label: <FormattedMessage id="ui-inventory.holdingsStatementForSupplementsPublicNote" />,
        component: TextArea,
        rows: 1,
      },
      {
        name: 'staffNote',
        label: <FormattedMessage id="ui-inventory.holdingsStatementForSupplementsStaffNote" />,
        component: TextArea,
        rows: 1,
      },
    ]}
  />
);

export default HoldingsStatementForSupplementsFields;
