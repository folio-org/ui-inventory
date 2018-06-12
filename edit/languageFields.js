import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import Select from '@folio/stripes-components/lib/Select';
import RepeatableField from '@folio/stripes-components/lib/RepeatableField';
import languages from '../data/languages';

const renderLanguageField = ({ field, fieldIndex }, formatMsg) => {
  const languageOptions = languages.selectOptions(field);
  return (
    <Field
      label={fieldIndex === 0 ? formatMsg({ id: 'ui-inventory.language' }) : null}
      name={`${field}`}
      component={Select}
      dataOptions={[{ label: formatMsg({ id: 'ui-inventory.selectLanguage' }), value: '' }, ...languageOptions]}
    />
  );
};

renderLanguageField.propTypes = {
  field: PropTypes.object,
  fieldIndex: PropTypes.number,
};

const LanguageFields = ({ formatMsg }) => (
  <RepeatableField
    name="languages"
    label={formatMsg({ id: 'ui-inventory.languages' })}
    addLabel={formatMsg({ id: 'ui-inventory.addLanguage' })}
    addButtonId="clickable-add-language"
    template={[{
        render(fieldObj) { return renderLanguageField(fieldObj, formatMsg); },
      }]}
  />
);
LanguageFields.propTypes = { formatMsg: PropTypes.func };

export default LanguageFields;
