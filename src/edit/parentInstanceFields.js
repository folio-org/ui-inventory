import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  TextArea,
  Select,
} from '@folio/stripes/components';

import RepeatableField from '../components/RepeatableField';

const ParentInstanceFields = props => {
  const {
    instanceRelationshipTypes,
    canAdd,
    canEdit,
    canDelete,
  } = props;
  const relationshipOptions = instanceRelationshipTypes.map(it => ({
    label: it.name,
    value: it.id,
  }));

  return (
    <FormattedMessage id="ui-inventory.selectType">
      {([placeholder]) => (
        <RepeatableField
          name="parentInstances"
          label={<FormattedMessage id="ui-inventory.parentInstances" />}
          addLabel={<FormattedMessage id="ui-inventory.addParentInstance" />}
          addButtonId="clickable-add-parentinstance"
          template={[
            {
              label: <FormattedMessage id="ui-inventory.parentInstances" />,
              name: 'superInstanceId',
              component: TextArea,
              rows: 1,
              required: true,
              disabled: !canEdit,
            },
            {
              label: <FormattedMessage id="ui-inventory.typeOfRelation" />,
              name: 'instanceRelationshipTypeId',
              component: Select,
              placeholder,
              dataOptions: relationshipOptions,
              required: true,
              disabled: !canEdit,
            },
          ]}
          newItemTemplate={{ superInstanceId: '', instanceRelationshipTypeId: '' }}
          canAdd={canAdd}
          canDelete={canDelete}
        />
      )}
    </FormattedMessage>
  );
};

ParentInstanceFields.propTypes = {
  instanceRelationshipTypes: PropTypes.arrayOf(PropTypes.object),
  canAdd: PropTypes.bool,
  canEdit: PropTypes.bool,
  canDelete: PropTypes.bool,
};
ParentInstanceFields.defaultProps = {
  canAdd: true,
  canEdit: true,
  canDelete: true,
};

export default ParentInstanceFields;
