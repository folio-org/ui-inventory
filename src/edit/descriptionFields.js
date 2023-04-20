import React from 'react';
import { FormattedMessage } from 'react-intl';
import { FieldArray } from 'react-final-form-arrays';
import { Field } from 'react-final-form';
import PropTypes from 'prop-types';

import {
  Label,
  TextField,
  RepeatableField,
} from '@folio/stripes/components';

const DescriptionFields = props => {
  const {
    canAdd,
    canEdit,
    canDelete,
  } = props;

  const legend = (
    <Label tagName="legend">
      <FormattedMessage id="ui-inventory.physicalDescription" />
    </Label>
  );

  const renderField = field => (
    <FormattedMessage id="ui-inventory.physicalDescription">
      {([ariaLabel]) => (
        <Field
          ariaLabel={ariaLabel}
          name={field}
          component={TextField}
          disabled={!canEdit}
        />
      )}
    </FormattedMessage>
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
DescriptionFields.defaultProps = {
  canAdd: true,
  canEdit: true,
  canDelete: true,
};

export default DescriptionFields;
