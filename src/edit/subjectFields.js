import React from 'react';
import { FormattedMessage } from 'react-intl';

import {
  Icon,
  TextField,
} from '@folio/stripes/components';

import RepeatableField from '../components/RepeatableField';

const SubjectFields = () => (
  <RepeatableField
    name="subjects"
    addLabel={
      <Icon icon="plus-sign">
        <FormattedMessage id="ui-inventory.addSubject" />
      </Icon>
    }
    addButtonId="clickable-add-subject"
    template={[{
      component: TextField,
      label: <FormattedMessage id="ui-inventory.subjects" />,
    }]}
  />
);

export default SubjectFields;
