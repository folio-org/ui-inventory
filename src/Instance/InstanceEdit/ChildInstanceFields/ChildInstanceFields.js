import React from 'react';
import PropTypes from 'prop-types';
import { FieldArray } from 'react-final-form-arrays';
import { FormattedMessage } from 'react-intl';

import { RepeatableField } from '@folio/stripes/components';

import InstanceField from '../InstanceField';

const ChildInstanceFields = ({
  canAdd,
  canEdit,
  canDelete,
  isDisabled,
  relationshipTypes,
}) => (
  <FieldArray
    addLabel={<FormattedMessage id="ui-inventory.addChildInstance" />}
    legend={<FormattedMessage id="ui-inventory.childInstances" />}
    id="clickable-add-child-instance"
    component={RepeatableField}
    name="childInstances"
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
        titleIdKey="subInstanceId"
      />
    )}
  />
);

ChildInstanceFields.propTypes = {
  canAdd: PropTypes.bool,
  canEdit: PropTypes.bool,
  canDelete: PropTypes.bool,
  isDisabled: PropTypes.bool,
  relationshipTypes: PropTypes.arrayOf(PropTypes.object),
};

ChildInstanceFields.defaultProps = {
  canAdd: true,
  canEdit: true,
  canDelete: true,
  isDisabled: false,
};

export default ChildInstanceFields;
