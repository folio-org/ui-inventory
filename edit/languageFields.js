import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import Select from '@folio/stripes-components/lib/Select';
import RepeatableField from '@folio/stripes-components/lib/structures/RepeatableField';
import languages from '../data/languages';

const renderLanguageField = ({ field, fieldIndex }) => {
  const languageOptions = languages.selectOptions(field);
  return (
    <Field
      label={fieldIndex === 0 ? 'language' : null}
      name={`${field}`}
      component={Select}
      dataOptions={[{ label: 'Select language', value: '' }, ...languageOptions]}
    />
  );
};

renderLanguageField.propTypes = {
  field: PropTypes.object,
  fieldIndex: PropTypes.number,
};

const LanguageFields = () => (
  <RepeatableField
    name="languages"
    label="Languages"
    addLabel="+ Add language"
    addId="clickable-add-language"
    template={[{
      render: renderLanguageField,
    }]}
  />
);

export default LanguageFields;
