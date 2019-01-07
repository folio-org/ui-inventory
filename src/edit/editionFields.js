import React from 'react';
import { FormattedMessage } from 'react-intl';

import {
  Icon,
  TextField
} from '@folio/stripes/components';

import RepeatableField from '../components/RepeatableField';

const EditionFields = () => (
  <RepeatableField
    name="editions"
    label={<FormattedMessage id="ui-inventory.editions" />}
    addLabel={
      <Icon icon="plus-sign">
        <FormattedMessage id="ui-inventory.addEdition" />
      </Icon>
    }
    addButtonId="clickable-add-edition"
    template={[{
      component: TextField,
      label: <FormattedMessage id="ui-inventory.edition" />,
    }]}
  />
);

export default EditionFields;
