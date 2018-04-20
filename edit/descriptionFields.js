import React from 'react';
import TextField from '@folio/stripes-components/lib/TextField';
import RepeatableField from '@folio/stripes-components/lib/structures/RepeatableField';

const DescriptionFields = () => (
  <RepeatableField
    name="physicalDescriptions"
    label="Physical descriptions"
    addLabel="+ Add description"
    addButtonId="clickable-add-description"
    template={[{
      label: 'Physical description',
      component: TextField,
    }]}
  />
);


export default DescriptionFields;
