import React from 'react';
import PropTypes from 'prop-types';
import { FieldArray } from 'react-final-form-arrays';
import { FormattedMessage } from 'react-intl';

import { RepeatableField } from '@folio/stripes/components';

import RelatedInstanceField from '../RelatedInstanceField';

const RelatedInstanceFields = ({
  canAdd,
  canEdit,
  canDelete,
  isDisabled,
  relatedInstanceTypes,
}) => (
  <FieldArray
    addLabel={<FormattedMessage id="ui-inventory.addRelatedInstance" />}
    id="clickable-add-related-instance"
    component={RepeatableField}
    name="relatedInstances"
    canAdd={canAdd}
    canRemove={canDelete}
    canEdit={canEdit}
    renderField={(field, index, fields) => (
      <RelatedInstanceField
        field={field}
        index={index}
        fields={fields}
        isDisabled={isDisabled}
        relatedInstanceTypes={relatedInstanceTypes}
      />
    )}
  />
);

RelatedInstanceFields.propTypes = {
  canAdd: PropTypes.bool,
  canEdit: PropTypes.bool,
  canDelete: PropTypes.bool,
  isDisabled: PropTypes.bool,
  relatedInstanceTypes: PropTypes.arrayOf(PropTypes.object),
};

RelatedInstanceFields.defaultProps = {
  canAdd: true,
  canEdit: true,
  canDelete: true,
  isDisabled: false,
};

export default RelatedInstanceFields;
