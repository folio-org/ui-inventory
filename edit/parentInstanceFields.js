import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@folio/stripes-components/lib/TextField';
import Select from '@folio/stripes-components/lib/Select';
import RepeatableField from '@folio/stripes-components/lib/RepeatableField';

const ParentInstanceFields = ({ instanceRelationshipTypes, formatMsg }) => {
  const relationshipOptions = instanceRelationshipTypes.map(
    it => ({
      label: it.name,
      value: it.id,
    }),
  );

  return (
    <RepeatableField
      name="parentInstances"
      label="Parent instances"
      addLabel="+ Add parent instance"
      addButtonId="clickable-add-parentinstance"
      template={[
        {
          label: 'Parent instance',
          name: 'superInstanceId',
          component: TextField,
        },
        {
          label: 'Type of Relation *',
          name: 'instanceRelationshipTypeId',
          component: Select,
          dataOptions: [{ label: 'Select type', value: '' }, ...relationshipOptions],
          required: true,
        },
      ]}
      newItemTemplate={{ superInstanceId: '', instanceRelationshipTypeId: '' }}
    />
  );
};

ParentInstanceFields.propTypes = {
  instanceRelationshipTypes: PropTypes.arrayOf(PropTypes.object),
  formatMsg: PropTypes.func,
};

export default ParentInstanceFields;
