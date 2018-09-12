import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@folio/stripes-components/lib/TextField';
import RepeatableField from '@folio/stripes-components/lib/RepeatableField';

const ElectronicAccessFields = ({ formatMsg }) => (
  <RepeatableField
    name="electronicAccess"
    label={formatMsg({ id: 'ui-inventory.electronicAccess' })}
    addLabel={formatMsg({ id: 'ui-inventory.addElectronicAccess' })}
    addButtonId="clickable-add-electronicaccess"
    template={[
        {
          name: 'relationship',
          label: formatMsg({ id: 'ui-inventory.urlRelationship'}),
          component: TextField,
        },
        {
          name: 'uri',
          label: formatMsg({ id: 'ui-inventory.uri' }),
          component: TextField,
        },
        {
          name: 'linkText',
          label: formatMsg({ id: 'ui-inventory.linkText'}),
          component: TextField,
        },
        {
          name: 'materialsSpecification',
          label: formatMsg({ id: 'ui-inventory.materialsSpecification' }),
          component: TextField,
        },
        {
          name: 'publicNote',
          label: formatMsg({ id: 'ui-inventory.urlPublicNote' }),
          component: TextField,
        },
      ]}
  />
);

ElectronicAccessFields.propTypes = { formatMsg: PropTypes.func };
export default ElectronicAccessFields;
