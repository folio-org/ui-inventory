import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@folio/stripes-components/lib/TextField';
import Select from '@folio/stripes-components/lib/Select';
import RepeatableField from '@folio/stripes-components/lib/RepeatableField';

const ChildInstanceFields = ({ instanceRelationshipTypes, formatMsg }) => {
  const relationshipOptions = instanceRelationshipTypes.map(
    it => ({
      label: it.name,
      value: it.id,
    }),
  );

  return (
    <RepeatableField
      name="childInstances"
      label="Child instances"
      addLabel="+ Add child instance"
      addButtonId="clickable-add-childinstance"
      template={[
        {
          label: 'Child instance *',
          name: 'subInstanceId',
          component: TextField,
          required: true,
        },
        {
          label: 'Type of relation *',
          name: 'instanceRelationshipTypeId',
          component: Select,
          dataOptions: [{ label: 'Select type', value: '' }, ...relationshipOptions],
          required: true,
        },
      ]}
      newItemTemplate={{ subInstanceId: '', relationshipTypeId: '' }}
    />
  );
};

ChildInstanceFields.propTypes = {
  instanceRelationshipTypes: PropTypes.arrayOf(PropTypes.object),
  formatMsg: PropTypes.func,
};

export default ChildInstanceFields;
