import React from 'react';
import { FormattedMessage } from 'react-intl';

import { TextArea } from '@folio/stripes/components';

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
        component: TextArea,
        rows: 1,
      },
      {
        name: 'note',
        label: <FormattedMessage id="ui-inventory.holdingsStatementForIndexesPublicNote" />,
        component: TextArea,
        rows: 1,
      },
      {
        name: 'staffNote',
        label: <FormattedMessage id="ui-inventory.holdingsStatementForIndexesStaffNote" />,
        component: TextArea,
        rows: 1,
      },
    ]}
  />
);

export default HoldingsStatementForIndexesFields;
