import React from 'react';
import TextField from '@folio/stripes-components/lib/TextField';
import RepeatableField from '@folio/stripes-components/lib/structures/RepeatableField';

const SubjectFields = () => (
  <RepeatableField
    name="subjects"
    label="Subjects"
    addLabel="+ Add subject"
    addId="clickable-add-subject"
    template={[{
      component: TextField,
    }]}
  />
);

export default SubjectFields;
