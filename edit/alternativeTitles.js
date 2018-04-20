import React from 'react';
import TextField from '@folio/stripes-components/lib/TextField';
import RepeatableField from '@folio/stripes-components/lib/structures/RepeatableField';

const AlternativeTitles = ({ formatMsg }) => {
  return (
    <RepeatableField
      name="alternativeTitles"
      label={formatMsg({ id: "ui-inventory.alternativeTitles" })}
      addLabel={formatMsg({ id: "ui-inventory.addAlternativeTitles" })}
      addButtonId="clickable-add-alternativeTitle"
      template={[{
        label: 'Alternative title',
        component: TextField,
      }]}
    />
  )
}

export default AlternativeTitles;
