import React from 'react';
import TextField from '@folio/stripes-components/lib/TextField';
import RepeatableField from '@folio/stripes-components/lib/structures/RepeatableField';

const AlternativeTitles = () => (
  <RepeatableField
    name="alternativeTitles"
    label="Alternative titles"
    addLabel="+ Add alternative title"
    addButtonId="clickable-add-alternativeTitle"
    template={[{
      label: 'Alternative title',
      component: TextField,
    }]}
  />
);

export default AlternativeTitles;
