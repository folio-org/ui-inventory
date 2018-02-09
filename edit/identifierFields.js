import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@folio/stripes-components/lib/TextField';
import Select from '@folio/stripes-components/lib/Select';
import RepeatableField from '@folio/stripes-components/lib/structures/RepeatableField';

const IdentifierFields = ({ identifierTypes }) => {
  const identifierTypeOptions = identifierTypes.map(
    it => ({
      label: it.name,
      value: it.id,
    }),
  );
  return (
    <RepeatableField
      name="identifiers"
      label="Identifiers"
      addLabel="+ Add identifier"
      addButtonId="clickable-add-identifier"
      template={[
        {
          name: 'value',
          label: 'Identifier *',
          component: TextField,
          required: true,
        },
        {
          name: 'identifierTypeId',
          label: 'Type *',
          component: Select,
          dataOptions: [{ label: 'Select identifier type', value: '' }, ...identifierTypeOptions],
          required: true,
        },
      ]}
      newItemTemplate={{ value: '', identifierTypeId: '' }}
    />
  );
};

IdentifierFields.propTypes = {
  identifierTypes: PropTypes.arrayOf(PropTypes.object),
};

export default IdentifierFields;

