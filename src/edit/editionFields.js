import React from 'react';
import { FormattedMessage } from 'react-intl';
import { FieldArray } from 'react-final-form-arrays';
import { Field } from 'react-final-form';
import PropTypes from 'prop-types';

import {
  Label,
  RepeatableField,
  TextField,
} from '@folio/stripes/components';

const EditionFields = props => {
  const {
    canAdd,
    canEdit,
    canDelete,
  } = props;

  const legend = (
    <Label tagName="legend">
      <FormattedMessage id="ui-inventory.edition" />
    </Label>
  );

  const renderField = field => (
    <Field
      name={field}
      component={TextField}
      disabled={!canEdit}
    />
  );

  return (
    <FieldArray
      name="editions"
      component={RepeatableField}
      legend={<FormattedMessage id="ui-inventory.editions" />}
      addLabel={<FormattedMessage id="ui-inventory.addEdition" />}
      onAdd={fields => fields.push('')}
      headLabels={legend}
      renderField={renderField}
      canAdd={canAdd}
      canRemove={canDelete}
    />
  );
};

EditionFields.propTypes = {
  canAdd: PropTypes.bool,
  canEdit: PropTypes.bool,
  canDelete: PropTypes.bool,
};
EditionFields.defaultProps = {
  canAdd: true,
  canEdit: true,
  canDelete: true,
};

export default EditionFields;
