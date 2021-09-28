import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { TextArea } from '@folio/stripes/components';

import RepeatableField from '../../components/RepeatableField';

const HoldingsStatementForIndexesFields = ({ isMARCRecord }) => (
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
        disabled: isMARCRecord,
      },
      {
        name: 'note',
        label: <FormattedMessage id="ui-inventory.holdingsStatementForIndexesPublicNote" />,
        component: TextArea,
        rows: 1,
        disabled: isMARCRecord,
      },
      {
        name: 'staffNote',
        label: <FormattedMessage id="ui-inventory.holdingsStatementForIndexesStaffNote" />,
        component: TextArea,
        rows: 1,
        disabled: isMARCRecord,
      },
    ]}
    canAdd={!isMARCRecord}
  />
);

HoldingsStatementForIndexesFields.propTypes = {
  isMARCRecord: PropTypes.bool,
};

HoldingsStatementForIndexesFields.defaultProps = {
  isMARCRecord: false,
};

export default HoldingsStatementForIndexesFields;
