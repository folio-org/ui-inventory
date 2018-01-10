import React from 'react';
import TextField from '@folio/stripes-components/lib/TextField';
import RepeatableField from '@folio/stripes-components/lib/structures/RepeatableField';

const URLFields = () => (
  <RepeatableField
    name="urls"
    label="URLs"
    addLabel="+ Add URL"
    addId="clickable-add-url"
    template={[{
      label: 'URL',
      component: TextField,
    }]}
  />
);

export default URLFields;
