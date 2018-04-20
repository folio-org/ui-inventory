import React from 'react';
import TextField from '@folio/stripes-components/lib/TextField';
import RepeatableField from '@folio/stripes-components/lib/structures/RepeatableField';

const SeriesFields = ({ formatMsg }) => (
  <RepeatableField
    name="series"
    label={formatMsg({ id: "ui-inventory.seriesStatements" })}
    addLabel={formatMsg({ id: "ui-inventory.addSeries" })}
    addButtonId="clickable-add-series"
    template={[{
      component: TextField,
    }]}
  />
);

export default SeriesFields;
