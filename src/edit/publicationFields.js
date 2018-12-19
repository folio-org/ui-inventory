import React from 'react';
import { FormattedMessage } from 'react-intl';

import {
  Icon,
  TextField,
} from '@folio/stripes/components';

import RepeatableField from '../components/RepeatableField';

const PublicationFields = () => (
  <RepeatableField
    name="publication"
    label={<FormattedMessage id="ui-inventory.publications" />}
    addLabel={
      <Icon icon="plus-sign">
        <FormattedMessage id="ui-inventory.addPublication" />
      </Icon>
    }
    addButtonId="clickable-add-publication"
    template={[
      {
        name: 'publisher',
        label: <FormattedMessage id="ui-inventory.publisher" />,
        component: TextField,
      },
      {
        name: 'role',
        label: <FormattedMessage id="ui-inventory.publisherRole" />,
        component: TextField,
      },
      {
        name: 'place',
        label: <FormattedMessage id="ui-inventory.place" />,
        component: TextField,
      },
      {
        name: 'dateOfPublication',
        label: <FormattedMessage id="ui-inventory.dateOfPublication" />,
        component: TextField,
      },
    ]}
  />
);

export default PublicationFields;
