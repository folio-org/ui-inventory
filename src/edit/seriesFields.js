import React from 'react';
import { FormattedMessage } from 'react-intl';

import { TextField } from '@folio/stripes/components';

import RepeatableField from '../components/RepeatableField';

const SeriesFields = () => (
  <RepeatableField
    name="series"
    label={<FormattedMessage id="ui-inventory.seriesStatements" />}
    addLabel={<FormattedMessage id="ui-inventory.addSeries" />}
    addButtonId="clickable-add-series"
    template={[{
      component: TextField,
    }]}
  />
);

export default SeriesFields;
