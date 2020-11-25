import React from 'react';
import { FormattedMessage } from 'react-intl';

import { TextArea } from '@folio/stripes/components';

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
        component: TextArea,
        rows: 1,
      },
      {
        name: 'note',
        label: <FormattedMessage id="ui-inventory.holdingsStatementPublicNote" />,
        component: TextArea,
        rows: 1,
      },
      {
        name: 'staffNote',
        label: <FormattedMessage id="ui-inventory.holdingsStatementStaffNote" />,
        component: TextArea,
        rows: 1,
      },
    ]}
  />
);

export default HoldingsStatementFields;
