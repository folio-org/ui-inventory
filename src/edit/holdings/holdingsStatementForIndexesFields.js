import React from 'react';
import { FormattedMessage } from 'react-intl';

import {
  Icon,
  TextField,
} from '@folio/stripes/components';

import RepeatableField from '../../components/RepeatableField';

const HoldingsStatementForIndexesFields = () => (
  <RepeatableField
    name="holdingsStatementsForIndexes"
    addLabel={
      <Icon icon="plus-sign">
        <FormattedMessage id="ui-inventory.addHoldingsStatementForIndexes" />
      </Icon>
    }
    addButtonId="clickable-add-holdingsstatementforindexes"
    template={[
      {
        name: 'statement',
        label: <FormattedMessage id="ui-inventory.holdingsStatementForIndexes" />,
        component: TextField,
      },
      {
        name: 'note',
        label: <FormattedMessage id="ui-inventory.holdingsStatementForIndexesNote" />,
        component: TextField,
      },
    ]}
  />
);

export default HoldingsStatementForIndexesFields;
