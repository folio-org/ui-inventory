import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { TextArea } from '@folio/stripes/components';

import RepeatableField from '../../components/RepeatableField';

const HoldingsStatementForSupplementsFields = ({ isMARCRecord }) => (
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
        disabled: isMARCRecord,
      },
      {
        name: 'note',
        label: <FormattedMessage id="ui-inventory.holdingsStatementForSupplementsPublicNote" />,
        component: TextArea,
        rows: 1,
        disabled: isMARCRecord,
      },
      {
        name: 'staffNote',
        label: <FormattedMessage id="ui-inventory.holdingsStatementForSupplementsStaffNote" />,
        component: TextArea,
        rows: 1,
        disabled: isMARCRecord,
      },
    ]}
    canAdd={!isMARCRecord}
  />
);

HoldingsStatementForSupplementsFields.propTypes = {
  isMARCRecord: PropTypes.bool,
};

HoldingsStatementForSupplementsFields.defaultProps = {
  isMARCRecord: false,
};

export default HoldingsStatementForSupplementsFields;
