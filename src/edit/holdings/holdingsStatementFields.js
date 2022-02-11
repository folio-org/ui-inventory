import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { TextArea } from '@folio/stripes/components';

import RepeatableField from '../../components/RepeatableField';

const HoldingsStatementFields = ({ canAdd, canEdit, canDelete }) => (
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
    canAdd={canAdd}
    canEdit={canEdit}
    canDelete={canDelete}
  />
);

HoldingsStatementFields.propTypes = {
  canAdd: PropTypes.bool,
  canEdit: PropTypes.bool,
  canDelete: PropTypes.bool,
};

HoldingsStatementFields.defaultProps = {
  canAdd: true,
  canEdit: true,
  canDelete: true,
};

export default HoldingsStatementFields;
