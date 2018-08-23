import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@folio/stripes-components/lib/TextField';
import RepeatableField from '@folio/stripes-components/lib/RepeatableField';

const PrecedingTitleFields = ({ formatMsg }) => (
  <RepeatableField
    name="precedingTitle"
    label={formatMsg({ id: 'ui-inventory.precedingTitle' })}
    addLabel={formatMsg({ id: 'ui-inventory.addPrecedingTitle' })}
    addButtonId="clickable-add-preceding-title"
    template={[
        {
          name: 'title',
          label: formatMsg({ id: 'ui-inventory.title' }),
          component: TextField,
        },
        {
          name: 'issn',
          label: formatMsg({ id: 'ui-inventory.issn' }),
          component: TextField,
        },
        {
          name: 'isbn',
          label: formatMsg({ id: 'ui-inventory.isbn' }),
          component: TextField,
        },
      ]}
  />
);

PrecedingTitleFields.propTypes = { formatMsg: PropTypes.func };
export default PrecedingTitleFields;
