import React from 'react';
import TextField from '@folio/stripes-components/lib/TextField';
import RepeatableField from '@folio/stripes-components/lib/structures/RepeatableField';

const NoteFields = () => (
  <RepeatableField
    name="notes"
    label="Notes"
    addLabel="+ Add note"
    addButtonId="clickable-add-notes"
    template={[{
      label: 'Note',
      component: TextField,
    }]}
  />
);


export default NoteFields;
