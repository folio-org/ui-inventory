import { FieldArray } from 'react-final-form-arrays';
import { Field } from 'react-final-form';
import {
  useIntl,
  FormattedMessage,
} from 'react-intl';

import {
  RepeatableField,
  Label,
  TextArea,
} from '@folio/stripes/components';

import {
  validateFieldLength
} from '../utils';

import {
  NOTE_CHARS_MAX_LENGTH
} from '../constants';

const AdministrativeNoteFields = () => {
  const { formatMessage } = useIntl();

  const administrativeNoteLabel = formatMessage({ id: 'ui-inventory.administrativeNote' });
  const validate = value => validateFieldLength(value, NOTE_CHARS_MAX_LENGTH);

  const legend = (
    <Label tagName="legend">
      {administrativeNoteLabel}
    </Label>
  );

  const renderField = field => (
    <Field
      aria-label={administrativeNoteLabel}
      name={field}
      component={TextArea}
      rows={1}
      fullWidth
      validate={validate}
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

export default AdministrativeNoteFields;
