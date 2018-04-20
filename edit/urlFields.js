import React from 'react';
import TextField from '@folio/stripes-components/lib/TextField';
import RepeatableField from '@folio/stripes-components/lib/structures/RepeatableField';

const URLFields = ({ formatMsg }) => {
  return (
    <RepeatableField
      name="urls"
      label={formatMsg({ id: "ui-inventory.urls" })}
      addLabel={formatMsg({ id: "ui-inventory.addUrl" })}
      addButtonId="clickable-add-url"
      template={[{
        label: formatMsg({ id: "ui-inventory.url" }),
        component: TextField,
      }]}
    />
  );
}

export default URLFields;
