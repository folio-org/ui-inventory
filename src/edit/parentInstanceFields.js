import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  TextField,
  Select,
} from '@folio/stripes/components';

import RepeatableField from '../components/RepeatableField';

const ParentInstanceFields = ({ instanceRelationshipTypes }) => {
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
          name="parentInstances"
          label={<FormattedMessage id="ui-inventory.parentInstances" />}
          addLabel={<FormattedMessage id="ui-inventory.addParentInstance" />}
          addButtonId="clickable-add-parentinstance"
          template={[
            {
              label: <FormattedMessage id="ui-inventory.parentInstancesRequired" />,
              name: 'superInstanceId',
              component: TextField,
            },
            {
              label: <FormattedMessage id="ui-inventory.typeOfRelationRequired" />,
              name: 'instanceRelationshipTypeId',
              component: Select,
              placeholder,
              dataOptions: relationshipOptions,
              required: true,
            },
          ]}
          newItemTemplate={{ superInstanceId: '', instanceRelationshipTypeId: '' }}
        />
      )}
    </FormattedMessage>
  );
};

ParentInstanceFields.propTypes = {
  instanceRelationshipTypes: PropTypes.arrayOf(PropTypes.object),
};

export default ParentInstanceFields;
