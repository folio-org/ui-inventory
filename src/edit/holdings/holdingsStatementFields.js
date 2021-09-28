import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { TextArea } from '@folio/stripes/components';

import RepeatableField from '../../components/RepeatableField';

const HoldingsStatementFields = ({ isMARCRecord }) => (
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
        disabled: isMARCRecord,
      },
      {
        name: 'note',
        label: <FormattedMessage id="ui-inventory.holdingsStatementPublicNote" />,
        component: TextArea,
        rows: 1,
        disabled: isMARCRecord,
      },
      {
        name: 'staffNote',
        label: <FormattedMessage id="ui-inventory.holdingsStatementStaffNote" />,
        component: TextArea,
        rows: 1,
        disabled: isMARCRecord,
      },
    ]}
    canAdd={!isMARCRecord}
  />
);

HoldingsStatementFields.propTypes = {
  isMARCRecord: PropTypes.bool,
};

HoldingsStatementFields.defaultProps = {
  isMARCRecord: false,
};

export default HoldingsStatementFields;
