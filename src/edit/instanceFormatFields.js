import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { FormattedMessage } from 'react-intl';

import {
  Icon,
  Select,
} from '@folio/stripes/components';

import RepeatableField from '../components/RepeatableField';

const renderInstanceFormatField = ({ field, fieldIndex }, instanceFormats) => {
  const instanceFormatOptions = instanceFormats
    ? instanceFormats.map(it => ({
      label: it.name,
      value: it.id,
    }))
    : [];

  const label = fieldIndex === 0 ? <FormattedMessage id="ui-inventory.instanceFormat" /> : null;

  return (
    <FormattedMessage id="ui-inventory.selectInstanceFormat">
      {placeholder => (
        <Field
          label={label}
          name={field}
          component={Select}
          placeholder={placeholder}
          dataOptions={instanceFormatOptions}
          required
          data-test-instance-format-field-count={fieldIndex}
        />
      )}
    </FormattedMessage>
  );
};

renderInstanceFormatField.propTypes = {
  field: PropTypes.object,
  fieldIndex: PropTypes.number,
};

const InstanceFormatFields = ({ instanceFormats }) => (
  <RepeatableField
    name="instanceFormatIds"
    label={<FormattedMessage id="ui-inventory.instanceFormats" />}
    addLabel={
      <Icon icon="plus-sign">
        <FormattedMessage id="ui-inventory.addInstanceFormat" />
      </Icon>
    }
    addButtonId="clickable-add-instanceformat"
    template={[{
      render(fieldObj) { return renderInstanceFormatField(fieldObj, instanceFormats); },
    }]}
  />
);

InstanceFormatFields.propTypes = {
  instanceFormats: PropTypes.arrayOf(PropTypes.object),
};

export default InstanceFormatFields;
