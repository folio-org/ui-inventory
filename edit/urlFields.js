import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@folio/stripes-components/lib/TextField';
import RepeatableField from '@folio/stripes-components/lib/RepeatableField';

const URLFields = ({ formatMsg }) => (
  <RepeatableField
    name="urls"
    label={formatMsg({ id: 'ui-inventory.urls' })}
    addLabel={formatMsg({ id: 'ui-inventory.addUrl' })}
    addButtonId="clickable-add-url"
    template={[{
      label: formatMsg({ id: 'ui-inventory.url' }),
      component: TextField,
    }]}
  />
);
URLFields.propTypes = { formatMsg: PropTypes.func };
export default URLFields;
