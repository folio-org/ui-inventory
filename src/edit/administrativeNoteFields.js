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

const AdministrativeNoteFields = () => {
  const { formatMessage } = useIntl();

  const administrativeNoteLabel = formatMessage({ id: 'ui-inventory.administrativeNote' });

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
