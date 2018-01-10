import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexbox-grid';
import Button from '@folio/stripes-components/lib/Button';
import Select from '@folio/stripes-components/lib/Select';
import RepeatableField from '@folio/stripes-components/lib/structures/RepeatableField';
import { Field } from 'redux-form';

import languages from '../data/languages';

const renderLanguageField = ({fields, field, fieldIndex, template, templateIndex}) => {
  const languageOptions = languages.selectOptions(field);
  return (
    <Field
      label={fieldIndex === 0 ? 'language' : null}
      name={`${field}`}
      component={Select}
      dataOptions={[{ label: 'Select language', value: '' }, ...languageOptions]}
    />
  );
}

class LanguageFields extends React.Component {
  render() {
    return (
      <RepeatableField
        name="languages"
        label="Languages"
        addLabel="+ Add language"
        addId="clickable-add-language"
        template={[{
          render: renderLanguageField
        }]}
      />
    );
  }
}

export default LanguageFields;
