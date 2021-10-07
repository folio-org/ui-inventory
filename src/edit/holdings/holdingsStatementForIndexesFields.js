import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { TextArea } from '@folio/stripes/components';

import RepeatableField from '../../components/RepeatableField';

const HoldingsStatementForIndexesFields = ({ canAdd, canEdit }) => (
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
    canAdd={canAdd}
    canEdit={canEdit}
  />
);

HoldingsStatementForIndexesFields.propTypes = {
  canAdd: PropTypes.bool,
  canEdit: PropTypes.bool,
};

HoldingsStatementForIndexesFields.defaultProps = {
  canAdd: true,
  canEdit: true,
};

export default HoldingsStatementForIndexesFields;
