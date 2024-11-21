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

const DescriptionFields = ({
  canAdd = true,
  canEdit = true,
  canDelete = true,
}) => {
  const { formatMessage } = useIntl();

  const physicalDescriptionLabel = formatMessage({ id: 'ui-inventory.physicalDescription' });

  const legend = (
    <Label tagName="legend">
      {physicalDescriptionLabel}
    </Label>
  );

  const renderField = field => (
    <Field
      ariaLabel={physicalDescriptionLabel}
      name={field}
      component={TextField}
      disabled={!canEdit}
    />
  );

  return (
    <FieldArray
      name="physicalDescriptions"
      component={RepeatableField}
      legend={<FormattedMessage id="ui-inventory.physicalDescriptions" />}
      addLabel={<FormattedMessage id="ui-inventory.addDescription" />}
      onAdd={fields => fields.push('')}
      headLabels={legend}
      renderField={renderField}
      canAdd={canAdd}
      canRemove={canDelete}
    />
  );
};

DescriptionFields.propTypes = {
  canAdd: PropTypes.bool,
  canEdit: PropTypes.bool,
  canDelete: PropTypes.bool,
};

export default DescriptionFields;
