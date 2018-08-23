import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@folio/stripes-components/lib/TextField';
import RepeatableField from '@folio/stripes-components/lib/RepeatableField';

const SucceedingTitleFields = ({ formatMsg }) => (
  <RepeatableField
    name="succeedingTitle"
    label={formatMsg({ id: 'ui-inventory.succeedingTitle' })}
    addLabel={formatMsg({ id: 'ui-inventory.addSucceedingTitle' })}
    addButtonId="clickable-add-succeeding-title"
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

SucceedingTitleFields.propTypes = { formatMsg: PropTypes.func };
export default SucceedingTitleFields;
