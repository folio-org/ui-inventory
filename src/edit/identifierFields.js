import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Select,
  TextField,
} from '@folio/stripes/components';

import RepeatableField from '../components/RepeatableField';

const IdentifierFields = ({ identifierTypes }) => {
  const identifierTypeOptions = identifierTypes.map(
    it => ({
      label: it.name,
      value: it.id,
    }),
  );

  return (
    <FormattedMessage id="ui-inventory.selectIdentifierType">
      {placeholder => (
        <RepeatableField
          name="identifiers"
          label={<FormattedMessage id="ui-inventory.identifiers" />}
          addLabel={<FormattedMessage id="ui-inventory.addIdentifier" />}
          addButtonId="clickable-add-identifier"
          template={[
            {
              name: 'identifierTypeId',
              label: (
                <FormattedMessage id="ui-inventory.type">
                  {message => message + ' *'}
                </FormattedMessage>
              ),
              component: Select,
              placeholder,
              dataOptions: identifierTypeOptions,
              required: true,
            },
            {
              name: 'value',
              label: (
                <FormattedMessage id="ui-inventory.identifier">
                  {message => message + ' *'}
                </FormattedMessage>
              ),
              component: TextField,
              required: true,
            }
          ]}
          newItemTemplate={{ identifierTypeId: '', value: '' }}
        />
      )}
    </FormattedMessage>
  );
};

IdentifierFields.propTypes = {
  identifierTypes: PropTypes.arrayOf(PropTypes.object),
};

export default IdentifierFields;
