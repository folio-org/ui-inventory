import React from 'react';
import { FieldArray } from 'react-final-form-arrays';
import { Field } from 'react-final-form';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import {
  Label,
  RepeatableField,
  TextField,
} from '@folio/stripes/components';

const SubjectFields = props => {
  const {
    canAdd,
    canEdit,
    canDelete,
  } = props;

  const legend = (
    <Label tagName="legend">
      <FormattedMessage id="ui-inventory.subjects" />
    </Label>
  );

  const renderField = field => {
    return (
      <FormattedMessage id="ui-inventory.subjects">
        {([ariaLabel]) => (
          <Field
            name={`${field}.value`}
            component={TextField}
            disabled={!canEdit}
            ariaLabel={ariaLabel}
          />
        )}
      </FormattedMessage>
    );
  };

  return (
    <FieldArray
      name="subjects"
      component={RepeatableField}
      addLabel={<FormattedMessage id="ui-inventory.addSubject" />}
      onAdd={fields => fields.push({ value: '' })}
      headLabels={legend}
      renderField={renderField}
      canAdd={canAdd}
      canRemove={canDelete}
    />
  );
};

SubjectFields.propTypes = {
  canAdd: PropTypes.bool,
  canEdit: PropTypes.bool,
  canDelete: PropTypes.bool,
};
SubjectFields.defaultProps = {
  canAdd: true,
  canEdit: true,
  canDelete: true,
};

export default SubjectFields;
