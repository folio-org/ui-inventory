import React from 'react';
import TextField from '@folio/stripes-components/lib/TextField';
import RepeatableField from '@folio/stripes-components/lib/structures/RepeatableField';

const DescriptionFields = ({ formatMsg }) => {
  return (
    <RepeatableField
      name="physicalDescriptions"
      label={formatMsg({ id: "ui-inventory.descriptions" })}
      addLabel={formatMsg({ id: "ui-inventory.addDescription" })}
      addButtonId="clickable-add-description"
      template={[{
        label: formatMsg({ id: "ui-inventory.description" }),
        component: TextField,
      }]}
    />
  );
}


export default DescriptionFields;
