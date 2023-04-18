import { FieldArray } from 'react-final-form-arrays';
import { Field } from 'react-final-form';
import { FormattedMessage } from 'react-intl';

import {
  RepeatableField,
  Label,
  TextArea,
} from '@folio/stripes/components';

const administrativeNoteFields = () => {
  const legend = (
    <Label tagName="legend">
      <FormattedMessage id="ui-inventory.administrativeNote" />
    </Label>
  );

  const renderField = field => (
    <Field
      name={field}
      component={TextArea}
      rows={1}
      fullWidth
    />
  );

  return (
    <FieldArray
      name="administrativeNotes"
      component={RepeatableField}
      addLabel={<FormattedMessage id="ui-inventory.addAdministrativeNote" />}
      onAdd={fields => fields.push('')}
      headLabels={legend}
      renderField={renderField}
    />
  );
};

export default administrativeNoteFields;
