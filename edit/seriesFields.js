import React from 'react';
import TextField from '@folio/stripes-components/lib/TextField';
import RepeatableField from '@folio/stripes-components/lib/structures/RepeatableField';

const SeriesFields = () => (
  <RepeatableField
    name="series"
    label="Series statements"
    addLabel="+ Add series"
    addButtonId="clickable-add-series"
    template={[{
      component: TextField,
    }]}
  />
);

export default SeriesFields;
