import React from 'react';
import { FormattedMessage } from 'react-intl';

import {
  Icon,
  TextField,
} from '@folio/stripes/components';

import RepeatableField from '../../components/RepeatableField';

const HoldingsStatementFields = () => (
  <RepeatableField
    name="holdingsStatements"
    label={<FormattedMessage id="ui-inventory.holdingsStatements" />}
    addLabel={
      <Icon icon="plus-sign">
        <FormattedMessage id="ui-inventory.addHoldingsStatement" />
      </Icon>
    }
    addButtonId="clickable-add-holdingsstatement"
    template={[
      {
        name: 'statement',
        label: <FormattedMessage id="ui-inventory.holdingsStatement" />,
        component: TextField,
      },
      {
        name: 'note',
        label: <FormattedMessage id="ui-inventory.holdingsStatementNote" />,
        component: TextField,
      },
    ]}
  />
);

export default HoldingsStatementFields;
