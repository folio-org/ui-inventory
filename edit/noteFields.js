import React from 'react';
import TextField from '@folio/stripes-components/lib/TextField';
import RepeatableField from '@folio/stripes-components/lib/structures/RepeatableField';

const NoteFields = ({ formatMsg }) => (
  <RepeatableField
    name="notes"
    label={formatMsg({ id: "ui-inventory.notes" })}
    addLabel={formatMsg({ id: "ui-inventory.addNote" })}
    addButtonId="clickable-add-notes"
    template={[{
      label: formatMsg({ id: "ui-inventory.note" }),
      component: TextField,
    }]}
  />
);


export default NoteFields;
