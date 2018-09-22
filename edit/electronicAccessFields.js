import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@folio/stripes-components/lib/TextField';
import Select from '@folio/stripes-components/lib/Select';
import RepeatableField from '../src/components/RepeatableField';

const ElectronicAccessFields = ({ formatMsg, electronicAccessRelationships }) => {
  const relationshipOptions = electronicAccessRelationships.map(
    it => ({
      label: it.name,
      value: it.id,
    }),
  );

  return (
    <RepeatableField
      name="electronicAccess"
      label={formatMsg({ id: 'ui-inventory.electronicAccess' })}
      addLabel={formatMsg({ id: 'ui-inventory.addElectronicAccess' })}
      addButtonId="clickable-add-electronicaccess"
      template={[
        {
          name: 'relationshipId',
          label: formatMsg({ id: 'ui-inventory.urlRelationship' }),
          component: Select,
          dataOptions: [{ label: 'Select type', value: '' }, ...relationshipOptions],
        },
        {
          name: 'uri',
          label: formatMsg({ id: 'ui-inventory.uri' }),
          component: TextField,
        },
        {
          name: 'linkText',
          label: formatMsg({ id: 'ui-inventory.linkText' }),
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
};

ElectronicAccessFields.propTypes = {
  formatMsg: PropTypes.func,
  electronicAccessRelationships: PropTypes.arrayOf(PropTypes.object)
};
export default ElectronicAccessFields;
