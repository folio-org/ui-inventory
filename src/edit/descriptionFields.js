import React from 'react';
import { FormattedMessage } from 'react-intl';

import {
  Icon,
  TextField,
} from '@folio/stripes/components';

import RepeatableField from '../components/RepeatableField';

const DescriptionFields = () => (
  <RepeatableField
    name="physicalDescriptions"
    label={<FormattedMessage id="ui-inventory.physicalDescriptions" />}
    addLabel={
      <Icon icon="plus-sign">
        <FormattedMessage id="ui-inventory.addDescription" />
      </Icon>
    }
    addButtonId="clickable-add-description"
    template={[{
      label: <FormattedMessage id="ui-inventory.physicalDescription" />,
      component: TextField,
    }]}
  />
);

export default DescriptionFields;
