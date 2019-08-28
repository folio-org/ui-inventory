import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { FormattedMessage } from 'react-intl';

import {
  Icon,
  Select,
} from '@folio/stripes/components';

import RepeatableField from '../components/RepeatableField';

const renderNatureOfContentField = ({ field, fieldIndex, canEdit }, natureOfContentTypes) => {
  const natureOfContentTypeOptions = natureOfContentTypes
    ? natureOfContentTypes.map(it => ({
      label: it.name,
      value: it.id,
    }))
    : [];
  const label = fieldIndex === 0 ? <FormattedMessage id="ui-inventory.natureOfContent" /> : null;

  return (
    <FormattedMessage id="ui-inventory.selectNatureOfContent">
      {placeholder => (
        <Field
          label={label}
          name={field}
          component={Select}
          placeholder={placeholder}
          dataOptions={natureOfContentTypeOptions}
          required
          data-test-nature-of-content-field-count={fieldIndex}
          disabled={!canEdit}
        />
      )}
    </FormattedMessage>
  );
};

renderNatureOfContentField.propTypes = {
  field: PropTypes.object,
  fieldIndex: PropTypes.number,
  canEdit: PropTypes.bool,
};
renderNatureOfContentField.defaultProps = {
  canEdit: true,
};

const NatureOfContentFields = props => {
  const {
    canAdd,
    canEdit,
    canDelete,
  } = props;

  return (
    <RepeatableField
      name="natureOfContentTypes"
      label={<FormattedMessage id="ui-inventory.natureOfContentTypes" />}
      addLabel={
        <Icon icon="plus-sign">
          <FormattedMessage id="ui-inventory.addNatureOfContent" />
        </Icon>
      }
      addButtonId="clickable-add-nature-of-content"
      template={[{
        render(fieldObj) { return renderNatureOfContentField({ ...fieldObj, canEdit }); },
      }]}
      canAdd={canAdd}
      canDelete={canDelete}
    />
  );
};

NatureOfContentFields.propTypes = {
  canAdd: PropTypes.bool,
  canEdit: PropTypes.bool,
  canDelete: PropTypes.bool,
  natureOfContentTypes: PropTypes.arrayOf(PropTypes.object),
};
NatureOfContentFields.defaultProps = {
  canAdd: true,
  canEdit: true,
  canDelete: true,
};

export default NatureOfContentFields;