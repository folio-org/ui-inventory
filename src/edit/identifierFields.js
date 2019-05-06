import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { IntlConsumer } from '@folio/stripes/core';
import {
  Icon,
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
    <IntlConsumer>
      {intl => (
        <RepeatableField
          name="identifiers"
          label={<FormattedMessage id="ui-inventory.identifiers" />}
          addLabel={
            <Icon icon="plus-sign">
              <FormattedMessage id="ui-inventory.addIdentifier" />
            </Icon>
          }
          addButtonId="clickable-add-identifier"
          template={[
            {
              name: 'identifierTypeId',
              label: intl.formatMessage({ id: 'ui-inventory.type' }),
              component: Select,
              placeholder: intl.formatMessage({ id: 'ui-inventory.selectIdentifierType' }),
              dataOptions: identifierTypeOptions,
              required: true,
            },
            {
              name: 'value',
              label: intl.formatMessage({ id: 'ui-inventory.identifier' }),
              component: TextField,
              required: true,
            }
          ]}
          newItemTemplate={{ identifierTypeId: '', value: '' }}
        />
      )}
    </IntlConsumer>
  );
};

IdentifierFields.propTypes = {
  identifierTypes: PropTypes.arrayOf(PropTypes.object),
};

export default IdentifierFields;
