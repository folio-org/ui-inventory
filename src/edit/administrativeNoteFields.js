import { FormattedMessage } from 'react-intl';

import { TextField } from '@folio/stripes/components';

import RepeatableField from '../components/RepeatableField';

const administrativeNoteFields = () => (
  <RepeatableField
    name="administrativeNotes"
    addLabel={<FormattedMessage id="ui-inventory.addAdministrativeNote" />}
    addButtonId="clickable-add-administrative-note"
    template={[{
      component: TextField,
      label: <FormattedMessage id="ui-inventory.administrativeNote" />,
    }]}
  />
);

export default administrativeNoteFields;
