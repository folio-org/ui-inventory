import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import {
  FormattedMessage,
  useIntl
} from 'react-intl';
import { sortBy } from 'lodash';

import {
  intlPreferredLanguageCode,
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

  // Build the language options for the select list in the instance create/edit form
  let languageOptions = languages.map(
    l => {
      // The label property is slightly tricky because some languages
      // can be represented by either a two- or three-character code (e.g.,
      // 'bur' and 'my' both represent Burmese), but formatDisplayName will only
      // return a localized language name for the two-char code (if there is one).
      // Otherwise, it returns undefined. Thus for localizing, we
      // have to favor the two-char code if there is one. If the function doesn't
      // return a formatted language name at all, we use the English name as a fallback label.
      const codeToUse = intlPreferredLanguageCode(l.alpha3);
      const intlDisplayName = useIntl().formatDisplayName(codeToUse, { fallback: 'none' });
      const label = intlDisplayName || l.name;

      return (
        {
          label,
          value: l.alpha3,
        }
      );
    }
  );
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
