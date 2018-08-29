import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@folio/stripes-components/lib/TextField';
import RepeatableField from '@folio/stripes-components/lib/RepeatableField';

const UrlFields = ({ formatMsg }) => (
  <RepeatableField
    name="urls"
    label={formatMsg({ id: 'ui-inventory.urls' })}
    addLabel={formatMsg({ id: 'ui-inventory.addUrls' })}
    addButtonId="clickable-add-urls"
    template={[
      {
        name: 'urlRelationship',
        label: formatMsg({ id: 'ui-inventory.urlRelationship' }),
        component: TextField,
      },
      {
        name: 'url',
        label: formatMsg({ id: 'ui-inventory.url' }),
        component: TextField,
      },
      {
        name: 'linkText',
        label: formatMsg({ id: 'ui-inventory.linkText' }),
        component: TextField,
      },
      {
        name: 'materialsSpecified',
        label: formatMsg({ id: 'ui-inventory.materialsSpecified' }),
        component: TextField,
      },
      {
        name: 'urlPublicNotes',
        label: formatMsg({ id: 'ui-inventory.urlPublicNotes' }),
        component: TextField,
      },
    ]}
  />
);

UrlFields.propTypes = { formatMsg: PropTypes.func };
export default UrlFields;
