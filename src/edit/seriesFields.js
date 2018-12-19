import React from 'react';
import { FormattedMessage } from 'react-intl';

import {
  Icon,
  TextField,
} from '@folio/stripes/components';

import RepeatableField from '../components/RepeatableField';

const SeriesFields = () => (
  <RepeatableField
    name="series"
    label={<FormattedMessage id="ui-inventory.seriesStatements" />}
    addLabel={
      <Icon icon="plus-sign">
        <FormattedMessage id="ui-inventory.addSeries" />
      </Icon>
    }
    addButtonId="clickable-add-series"
    template={[{
      component: TextField,
    }]}
  />
);

export default SeriesFields;
