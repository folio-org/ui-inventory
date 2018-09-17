import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@folio/stripes-components/lib/TextField';
import RepeatableField from '../src/components/RepeatableField';

const SeriesFields = ({ formatMsg }) => (
  <RepeatableField
    name="series"
    label={formatMsg({ id: 'ui-inventory.seriesStatements' })}
    addLabel={formatMsg({ id: 'ui-inventory.addSeries' })}
    addButtonId="clickable-add-series"
    template={[{
      component: TextField,
    }]}
  />
);

SeriesFields.propTypes = { formatMsg: PropTypes.func };
export default SeriesFields;
