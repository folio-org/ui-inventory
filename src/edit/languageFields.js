import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { FormattedMessage } from 'react-intl';
import { sortBy } from 'lodash';

import {
  formattedLanguageName,
  languages,
  Select,
} from '@folio/stripes/components';

import RepeatableField from '../components/RepeatableField';

const renderLanguageField = ({ field, fieldIndex, canEdit, languageOptions }) => {
  const label = fieldIndex === 0 ? <FormattedMessage id="ui-inventory.language" /> : null;

  return (
    <FormattedMessage id="ui-inventory.selectLanguage">
      {placeholder => (
        <Field
          label={label}
          name={field}
          component={Select}
          placeholder={placeholder}
          dataOptions={languageOptions}
          required
          data-test-language-field-count={fieldIndex}
          disabled={!canEdit}
        />
      )}
    </FormattedMessage>
  );
};

renderLanguageField.propTypes = {
  field: PropTypes.object,
  fieldIndex: PropTypes.number,
  canEdit: PropTypes.bool,
  languageOptions: PropTypes.arrayOf(PropTypes.object),
};
renderLanguageField.defaultProps = {
  canEdit: true,
  languageOptions: [],
};

const LanguageFields = props => {
  const {
    canAdd,
    canEdit,
    canDelete,
  } = props;

  let languageOptions = languages.map(l => (
    {
      label: formattedLanguageName(l.alpha3),
      value: l.alpha3,
    }
  ));
  languageOptions = sortBy(languageOptions, ['label']);

  return (
    <RepeatableField
      name="languages"
      label={<FormattedMessage id="ui-inventory.languages" />}
      addLabel={<FormattedMessage id="ui-inventory.addLanguage" />}
      addButtonId="clickable-add-language"
      template={[{
        render(fieldObj) { return renderLanguageField({ ...fieldObj, canEdit, languageOptions }); },
      }]}
      canAdd={canAdd}
      canDelete={canDelete}
    />
  );
};

LanguageFields.propTypes = {
  canAdd: PropTypes.bool,
  canEdit: PropTypes.bool,
  canDelete: PropTypes.bool,
};
LanguageFields.defaultProps = {
  canAdd: true,
  canEdit: true,
  canDelete: true,
};

export default LanguageFields;
