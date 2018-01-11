import React from 'react';
import TextField from '@folio/stripes-components/lib/TextField';
import RepeatableField from '@folio/stripes-components/lib/structures/RepeatableField';

const PublicationFields = () => (
  <RepeatableField
    name="publication"
    label="Publications"
    addLabel="+ Add publication"
    addId="clickable-add-publication"
    template={[
      {
        name: 'publisher',
        label: 'Publisher',
        component: TextField,
      },
      {
        name: 'place',
        label: 'Place',
        component: TextField,
      },
      {
        name: 'dateOfPublication',
        label: 'Date',
        component: TextField,
      },
    ]}
  />
);

export default PublicationFields;
