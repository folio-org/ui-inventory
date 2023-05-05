import React from 'react';
import { FieldArray } from 'react-final-form-arrays';
import { Field } from 'react-final-form';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';
import PropTypes from 'prop-types';

import {
  Label,
  RepeatableField,
  TextField,
} from '@folio/stripes/components';

const SubjectFields = props => {
  const { formatMessage } = useIntl();

  const {
    canAdd,
    canEdit,
    canDelete,
  } = props;

  const subjectsLabel = formatMessage({ id: 'ui-inventory.subjects' });

  const legend = (
    <Label tagName="legend">
      {subjectsLabel}
    </Label>
  );

  const renderField = field => {
    return (
      <Field
        ariaLabel={subjectsLabel}
        name={`${field}.value`}
        component={TextField}
        disabled={!canEdit}
      />
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
