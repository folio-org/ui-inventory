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
  RepeatableField,
  TextField,
} from '@folio/stripes/components';

const EditionFields = props => {
  const { formatMessage } = useIntl();

  const {
    canAdd,
    canEdit,
    canDelete,
  } = props;

  const editionLabel = formatMessage({ id: 'ui-inventory.edition' });

  const legend = (
    <Label tagName="legend">
      {editionLabel}
    </Label>
  );

  const renderField = field => (
    <Field
      ariaLabel={editionLabel}
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
