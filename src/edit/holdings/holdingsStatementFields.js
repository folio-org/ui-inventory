import React from 'react';
import { FormattedMessage } from 'react-intl';

import { TextField } from '@folio/stripes/components';

import RepeatableField from '../../components/RepeatableField';

const HoldingsStatementFields = () => (
  <RepeatableField
    name="holdingsStatements"
    label={<FormattedMessage id="ui-inventory.holdingsStatements" />}
    addLabel={<FormattedMessage id="ui-inventory.addHoldingsStatement" />}
    addButtonId="clickable-add-holdingsstatement"
    template={[
      {
        name: 'statement',
        label: <FormattedMessage id="ui-inventory.holdingsStatement" />,
        component: TextField,
      },
      {
        name: 'note',
        label: <FormattedMessage id="ui-inventory.holdingsStatementPublicNote" />,
        component: TextField,
      },
      {
        name: 'staffNote',
        label: <FormattedMessage id="ui-inventory.holdingsStatementStaffNote" />,
        component: TextField,
      },
    ]}
  />
);

export default HoldingsStatementFields;
