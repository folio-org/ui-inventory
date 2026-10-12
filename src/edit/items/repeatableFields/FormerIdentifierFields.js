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

const FormerIdentifierFields = ({
  canAdd = true,
  canEdit = true,
  canDelete = true,
}) => {
  const { formatMessage } = useIntl();

  const formerIdLabel = formatMessage({ id: 'ui-inventory.formerId' });

  const legend = (
    <Label tagName="legend">
      {formerIdLabel}
    </Label>
  );

  const renderField = field => (
    <Field
      ariaLabel={formerIdLabel}
      name={field}
      component={TextField}
      disabled={!canEdit}
    />
  );

  return (
    <FieldArray
      name="formerIds"
      component={RepeatableField}
      addLabel={<FormattedMessage id="ui-inventory.addFormerId" />}
      onAdd={fields => fields.push('')}
      headLabels={legend}
      renderField={renderField}
      canAdd={canAdd}
      canRemove={canDelete}
    />
  );
};

FormerIdentifierFields.propTypes = {
  canAdd: PropTypes.bool,
  canEdit: PropTypes.bool,
  canDelete: PropTypes.bool,
};

export default FormerIdentifierFields;
