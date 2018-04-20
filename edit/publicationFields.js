import React from 'react';
import TextField from '@folio/stripes-components/lib/TextField';
import RepeatableField from '@folio/stripes-components/lib/structures/RepeatableField';

const PublicationFields = ({ formatMsg }) => {
  return (
    <RepeatableField
      name="publication"
      label={formatMsg({ id: "ui-inventory.publications" })}
      addLabel={formatMsg({ id: "ui-inventory.addPublication" })}
      addButtonId="clickable-add-publication"
      template={[
        {
          name: 'publisher',
          label: formatMsg({ id: "ui-inventory.publisher" }),
          component: TextField,
        },
        {
          name: 'place',
          label: formatMsg({ id: "ui-inventory.place" }),
          component: TextField,
        },
        {
          name: 'dateOfPublication',
          label: formatMsg({ id: "ui-inventory.date" }),
          component: TextField,
        },
      ]}
    />
  );
}

export default PublicationFields;
