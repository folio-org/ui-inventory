import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@folio/stripes-components/lib/TextField';
import RepeatableField from '../src/components/RepeatableField';

const PublicationFields = ({ formatMsg }) => (
  <RepeatableField
    name="publication"
    label={formatMsg({ id: 'ui-inventory.publications' })}
    addLabel={formatMsg({ id: 'ui-inventory.addPublication' })}
    addButtonId="clickable-add-publication"
    template={[
      {
        name: 'publisher',
        label: formatMsg({ id: 'ui-inventory.publisher' }),
        component: TextField,
      },
      {
        name: 'role',
        label: formatMsg({ id: 'ui-inventory.publisherRole' }),
        component: TextField,
      },
      {
        name: 'place',
        label: formatMsg({ id: 'ui-inventory.place' }),
        component: TextField,
      },
      {
        name: 'dateOfPublication',
        label: formatMsg({ id: 'ui-inventory.dateOfPublication' }),
        component: TextField,
      },
    ]}
  />
);

PublicationFields.propTypes = { formatMsg: PropTypes.func };
export default PublicationFields;
