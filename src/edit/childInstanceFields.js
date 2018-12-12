import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  TextField,
  Select,
} from '@folio/stripes/components';

import RepeatableField from '../components/RepeatableField';

const ChildInstanceFields = ({ instanceRelationshipTypes }) => {
  const relationshipOptions = instanceRelationshipTypes.map(
    it => ({
      label: it.name,
      value: it.id,
    }),
  );

  return (
    <FormattedMessage id="ui-inventory.selectType">
      {placeholder => (
        <RepeatableField
          name="childInstances"
          label={<FormattedMessage id="ui-inventory.childInstances" />}
          addLabel={<FormattedMessage id="ui-inventory.addChildInstance" />}
          addButtonId="clickable-add-childinstance"
          template={[
            {
              label: (
                <FormattedMessage id="ui-inventory.childInstance">
                  {(message) => message + ' *'}
                </FormattedMessage>
              ),
              name: 'subInstanceId',
              component: TextField,
              required: true,
            },
            {
              label: (
                <FormattedMessage id="ui-inventory.typeOfRelation">
                  {(message) => message + ' *'}
                </FormattedMessage>
              ),
              name: 'instanceRelationshipTypeId',
              component: Select,
              placeholder,
              dataOptions: relationshipOptions,
              required: true,
            },
          ]}
          newItemTemplate={{ subInstanceId: '', relationshipTypeId: '' }}
        />
      )}
    </FormattedMessage>
  );
};

ChildInstanceFields.propTypes = {
  instanceRelationshipTypes: PropTypes.arrayOf(PropTypes.object),
};

export default ChildInstanceFields;
