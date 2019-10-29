import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { IntlConsumer } from '@folio/stripes/core';
import {
  Select,
  TextField,
} from '@folio/stripes/components';

import RepeatableField from '../components/RepeatableField';

const IdentifierFields = props => {
  const {
    identifierTypes,
    canAdd,
    canEdit,
    canDelete,
  } = props;
  const identifierTypeOptions = identifierTypes.map(it => ({
    label: it.name,
    value: it.id,
  }));

  return (
    <IntlConsumer>
      {intl => (
        <RepeatableField
          name="identifiers"
          label={<FormattedMessage id="ui-inventory.identifiers" />}
          addLabel={<FormattedMessage id="ui-inventory.addIdentifier" />}
          addButtonId="clickable-add-identifier"
          template={[
            {
              name: 'identifierTypeId',
              label: intl.formatMessage({ id: 'ui-inventory.type' }),
              component: Select,
              placeholder: intl.formatMessage({ id: 'ui-inventory.selectIdentifierType' }),
              dataOptions: identifierTypeOptions,
              required: true,
              disabled: !canEdit,
            },
            {
              name: 'value',
              label: intl.formatMessage({ id: 'ui-inventory.identifier' }),
              component: TextField,
              required: true,
              disabled: !canEdit,
            }
          ]}
          newItemTemplate={{ identifierTypeId: '', value: '' }}
          canAdd={canAdd}
          canDelete={canDelete}
        />
      )}
    </IntlConsumer>
  );
};

IdentifierFields.propTypes = {
  identifierTypes: PropTypes.arrayOf(PropTypes.object),
  canAdd: PropTypes.bool,
  canEdit: PropTypes.bool,
  canDelete: PropTypes.bool,
};
IdentifierFields.defaultProps = {
  canAdd: true,
  canEdit: true,
  canDelete: true,
};

export default IdentifierFields;
