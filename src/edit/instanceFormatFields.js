import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import Select from '@folio/stripes-components/lib/Select';
import RepeatableField from '../components/RepeatableField';

const renderInstanceFormatField = ({ field, fieldIndex }, formatMsg, instanceFormats) => {
  const instanceFormatOptions = instanceFormats ? instanceFormats.map(
    it => ({
      label: it.name,
      value: it.id,
    }),
  ) : [];

  return (
    <Field
      label={fieldIndex === 0 ? `${formatMsg({ id: 'ui-inventory.instanceFormat' })} *` : null}
      name={`${field}`}
      component={Select}
      dataOptions={[{ label: formatMsg({ id: 'ui-inventory.selectInstanceFormat' }), value: '' }, ...instanceFormatOptions]}
    />
  );
};

renderInstanceFormatField.propTypes = {
  field: PropTypes.object,
  fieldIndex: PropTypes.number,
};

const InstanceFormatFields = ({ formatMsg, instanceFormats }) => (
  <RepeatableField
    name="instanceFormatIds"
    label={formatMsg({ id: 'ui-inventory.instanceFormats' })}
    addLabel={formatMsg({ id: 'ui-inventory.addInstanceFormat' })}
    addButtonId="clickable-add-instanceformat"
    template={[{
      render(fieldObj) { return renderInstanceFormatField(fieldObj, formatMsg, instanceFormats); },
    }]}
  />
);

InstanceFormatFields.propTypes = {
  formatMsg: PropTypes.func,
  instanceFormats: PropTypes.arrayOf(PropTypes.object),
};

export default InstanceFormatFields;
