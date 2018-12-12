import React from 'react';
import { FormattedMessage } from 'react-intl';

import { TextField } from '@folio/stripes/components';

import RepeatableField from '../components/RepeatableField';

const PublicationFrequencyFields = () => (
  <RepeatableField
    name="publicationFrequency"
    label={<FormattedMessage id="ui-inventory.publicationFrequency" />}
    addLabel={<FormattedMessage id="ui-inventory.addPublicationFrequency" />}
    addButtonId="clickable-add-publicationfrequency"
    template={[{
      label: <FormattedMessage id="ui-inventory.publicationFrequency" />,
      component: TextField,
    }]}
  />
);

export default PublicationFrequencyFields;
