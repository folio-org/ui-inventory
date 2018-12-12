import React from 'react';
import { FormattedMessage } from 'react-intl';

import { TextField } from '@folio/stripes/components';

import RepeatableField from '../components/RepeatableField';

const PublicationRangeFields = () => (
  <RepeatableField
    name="publicationRange"
    label={<FormattedMessage id="ui-inventory.publicationRange" />}
    addLabel={<FormattedMessage id="ui-inventory.addPublicationRange" />}
    addButtonId="clickable-add-publicationfrequency"
    template={[{
      label: <FormattedMessage id="ui-inventory.publicationRange" />,
      component: TextField,
    }]}
  />
);

export default PublicationRangeFields;
