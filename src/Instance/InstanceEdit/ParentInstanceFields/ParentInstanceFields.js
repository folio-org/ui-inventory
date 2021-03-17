import React from 'react';
import PropTypes from 'prop-types';
import { FieldArray } from 'react-final-form-arrays';
import { FormattedMessage } from 'react-intl';

import { RepeatableField } from '@folio/stripes/components';

import InstanceField from '../InstanceField';

const ParentInstanceFields = ({
  canAdd,
  canEdit,
  canDelete,
  isDisabled,
  relationshipTypes,
}) => (
  <FieldArray
    addLabel={<FormattedMessage id="ui-inventory.addParentInstance" />}
    legend={<FormattedMessage id="ui-inventory.parentInstances" />}
    id="clickable-add-parent-instance"
    component={RepeatableField}
    name="parentInstances"
    canAdd={canAdd}
    canRemove={canDelete}
    canEdit={canEdit}
    renderField={(field, index, fields) => (
      <InstanceField
        field={field}
        index={index}
        fields={fields}
        isDisabled={isDisabled}
        relationshipTypes={relationshipTypes}
        titleIdKey="superInstanceId"
      />
    )}
  />
);

ParentInstanceFields.propTypes = {
  canAdd: PropTypes.bool,
  canEdit: PropTypes.bool,
  canDelete: PropTypes.bool,
  isDisabled: PropTypes.bool,
  relationshipTypes: PropTypes.arrayOf(PropTypes.object),
};

ParentInstanceFields.defaultProps = {
  canAdd: true,
  canEdit: true,
  canDelete: true,
  isDisabled: false,
};

export default ParentInstanceFields;
