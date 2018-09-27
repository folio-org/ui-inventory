import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@folio/stripes-components/lib/TextField';
import RepeatableField from '../components/RepeatableField';

const NoteFields = ({ formatMsg }) => (
  <RepeatableField
    name="notes"
    label={formatMsg({ id: 'ui-inventory.notes' })}
    addLabel={formatMsg({ id: 'ui-inventory.addNote' })}
    addButtonId="clickable-add-notes"
    template={[{
      label: formatMsg({ id: 'ui-inventory.note' }),
      component: TextField,
    }]}
  />
);

NoteFields.propTypes = { formatMsg: PropTypes.func };
export default NoteFields;
