import React from 'react';
import { FormattedMessage } from 'react-intl';

import { TextField } from '@folio/stripes/components';

import RepeatableField from '../../components/RepeatableField';

const HoldingsStatementForIndexesFields = () => (
  <RepeatableField
    name="holdingsStatementsForIndexes"
    addLabel={<FormattedMessage id="ui-inventory.addHoldingsStatementForIndexes" />}
    addButtonId="clickable-add-holdingsstatementforindexes"
    template={[
      {
        name: 'statement',
        label: <FormattedMessage id="ui-inventory.holdingsStatementForIndexes" />,
        component: TextField,
      },
      {
        name: 'note',
        label: <FormattedMessage id="ui-inventory.holdingsStatementForIndexesPublicNote" />,
        component: TextField,
      },
      {
        name: 'staffNote',
        label: <FormattedMessage id="ui-inventory.holdingsStatementForIndexesStaffNote" />,
        component: TextField,
      },
    ]}
  />
);

export default HoldingsStatementForIndexesFields;
