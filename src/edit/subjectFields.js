import React from 'react';
import { FormattedMessage } from 'react-intl';

import { TextField } from '@folio/stripes/components';

import RepeatableField from '../components/RepeatableField';

const SubjectFields = () => (
  <RepeatableField
    name="subjects"
    addLabel={<FormattedMessage id="ui-inventory.addSubject" />}
    addButtonId="clickable-add-subject"
    template={[{
      component: TextField,
      label: <FormattedMessage id="ui-inventory.subjects" />,
    }]}
  />
);

export default SubjectFields;
