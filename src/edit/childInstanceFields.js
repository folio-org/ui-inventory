import React from 'react';
import PropTypes from 'prop-types';
import { TextField, Select } from '@folio/stripes/components';
import RepeatableField from '../components/RepeatableField';

const ChildInstanceFields = ({ instanceRelationshipTypes }) => {
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
};

export default ChildInstanceFields;
