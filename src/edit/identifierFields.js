import React from 'react';
import PropTypes from 'prop-types';
import {
  Select,
  TextField,
} from '@folio/stripes/components';
import RepeatableField from '../components/RepeatableField';

const IdentifierFields = ({ identifierTypes, formatMsg }) => {
  const identifierTypeOptions = identifierTypes.map(
    it => ({
      label: it.name,
      value: it.id,
    }),
  );

  return (
    <RepeatableField
      name="identifiers"
      label={formatMsg({ id: 'ui-inventory.identifiers' })}
      addLabel={formatMsg({ id: 'ui-inventory.addIdentifier' })}
      addButtonId="clickable-add-identifier"
      template={[
        {
          name: 'identifierTypeId',
          label: `${formatMsg({ id: 'ui-inventory.type' })} *`,
          component: Select,
          dataOptions: [{ label: 'Select identifier type', value: '' }, ...identifierTypeOptions],
          required: true,
        },
        {
          name: 'value',
          label: `${formatMsg({ id: 'ui-inventory.identifier' })} *`,
          component: TextField,
          required: true,
        }
      ]}
      newItemTemplate={{ identifierTypeId: '', value: '' }}
    />
  );
};

IdentifierFields.propTypes = {
  identifierTypes: PropTypes.arrayOf(PropTypes.object),
  formatMsg: PropTypes.func,
};

export default IdentifierFields;
