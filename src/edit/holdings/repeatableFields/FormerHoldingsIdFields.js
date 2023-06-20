import React from 'react';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';
import { FieldArray } from 'react-final-form-arrays';
import { Field } from 'react-final-form';
import PropTypes from 'prop-types';

import {
  Label,
  TextField,
  RepeatableField,
} from '@folio/stripes/components';

const FormerHoldingsIdFields = ({
  canAdd,
  canEdit,
  canDelete,
}) => {
  const { formatMessage } = useIntl();

  const formerHoldingsIdLabel = formatMessage({ id: 'ui-inventory.formerHoldingsId' });

  const legend = (
    <Label tagName="legend">
      {formerHoldingsIdLabel}
    </Label>
  );

  const renderField = field => (
    <Field
      ariaLabel={formerHoldingsIdLabel}
      name={field}
      component={TextField}
      disabled={!canEdit}
    />
  );

  return (
    <FieldArray
      name="formerIds"
      component={RepeatableField}
      addLabel={<FormattedMessage id="ui-inventory.addFormerHoldingsId" />}
      onAdd={fields => fields.push('')}
      headLabels={legend}
      renderField={renderField}
      canAdd={canAdd}
      canRemove={canDelete}
    />
  );
};

FormerHoldingsIdFields.propTypes = {
  canAdd: PropTypes.bool,
  canEdit: PropTypes.bool,
  canDelete: PropTypes.bool,
};

FormerHoldingsIdFields.defaultProps = {
  canAdd: true,
  canEdit: true,
  canDelete: true,
};

export default FormerHoldingsIdFields;
