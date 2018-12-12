import React from 'react';
import { FormattedMessage } from 'react-intl';

import { TextField } from '@folio/stripes/components';

import RepeatableField from '../components/RepeatableField';

const DescriptionFields = () => (
  <RepeatableField
    name="physicalDescriptions"
    label={<FormattedMessage id="ui-inventory.physicalDescriptions" />}
    addLabel={<FormattedMessage id="ui-inventory.addDescription" />}
    addButtonId="clickable-add-description"
    template={[{
      label: <FormattedMessage id="ui-inventory.physicalDescription" />,
      component: TextField,
    }]}
  />
);

export default DescriptionFields;
