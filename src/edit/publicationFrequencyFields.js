import React from 'react';
import { FormattedMessage } from 'react-intl';

import {
  Icon,
  TextField,
} from '@folio/stripes/components';

import RepeatableField from '../components/RepeatableField';

const PublicationFrequencyFields = () => (
  <RepeatableField
    name="publicationFrequency"
    label={<FormattedMessage id="ui-inventory.publicationFrequency" />}
    addLabel={
      <Icon icon="plus-sign">
        <FormattedMessage id="ui-inventory.addPublicationFrequency" />
      </Icon>
    }
    addButtonId="clickable-add-publicationfrequency"
    template={[{
      label: <FormattedMessage id="ui-inventory.publicationFrequency" />,
      component: TextField,
    }]}
  />
);

export default PublicationFrequencyFields;
