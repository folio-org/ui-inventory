import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@folio/stripes-components/lib/TextField';
import Select from '@folio/stripes-components/lib/Select';
import RepeatableField from '@folio/stripes-components/lib/RepeatableField';

const ContainedInstanceFields = ({ instanceRelationshipTypes, formatMsg }) => {
  const relationshipOptions = instanceRelationshipTypes.map(
    it => ({
      label: it.name,
      value: it.id,
    }),
  );

  return (
    <RepeatableField
      name="contained-instances"
      label="Contained instances"
      addLabel="+ Add contained instance"
      addButtonId="clickable-add-containedinstance"
      template={[
        {
          label: 'Contained instance',
          name: 'relatedInstanceId',
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

ContainedInstanceFields.propTypes = {
  instanceRelationshipTypes: PropTypes.arrayOf(PropTypes.object),
  formatMsg: PropTypes.func,
};

export default ContainedInstanceFields;
