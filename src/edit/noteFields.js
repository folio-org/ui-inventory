import React from 'react';
import { FormattedMessage } from 'react-intl';

import {
  Icon,
  TextField,
} from '@folio/stripes/components';

import RepeatableField from '../components/RepeatableField';

const NoteFields = () => (
  <RepeatableField
    name="notes"
    label={<FormattedMessage id="ui-inventory.notes" />}
    addLabel={
      <Icon icon="plus-sign">
        <FormattedMessage id="ui-inventory.addNote" />
      </Icon>
    }
    addButtonId="clickable-add-notes"
    template={[{
      label: <FormattedMessage id="ui-inventory.note" />,
      component: TextField,
    }]}
  />
);

export default NoteFields;
