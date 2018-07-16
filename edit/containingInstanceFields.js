import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@folio/stripes-components/lib/TextField';
import Select from '@folio/stripes-components/lib/Select';
import RepeatableField from '@folio/stripes-components/lib/RepeatableField';

const ContainingInstanceFields = ({ instanceRelationshipTypes, formatMsg }) => {
  const relationshipOptions = instanceRelationshipTypes.map(
    it => ({
      label: it.name,
      value: it.id,
    }),
  );

  return (
    <RepeatableField
      name="containingInstances"
      label="Containing instances"
      addLabel="+ Add containing instance"
      addButtonId="clickable-add-containinginstance"
      template={[
        {
          label: 'Containing instance',
          name: 'instanceId',
          component: TextField,
        },
        {
          label: 'Type of Relation *',
          name: 'relationshipTypeId',
          component: Select,
          dataOptions: [{ label: 'Select type', value: '' }, ...relationshipOptions],
          required: true,
        },
      ]}
      newItemTemplate={{ relatedInstanceId: '', relationshipTypeId: '' }}
    />
  );
};

ContainingInstanceFields.propTypes = {
  instanceRelationshipTypes: PropTypes.arrayOf(PropTypes.object),
  formatMsg: PropTypes.func,
};

export default ContainingInstanceFields;
