import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { FormattedMessage } from 'react-intl';

import {
  Icon,
  Select,
} from '@folio/stripes/components';

import RepeatableField from '../components/RepeatableField';
import languages from '../data/languages';

const renderLanguageField = ({ field, fieldIndex, canEdit }) => {
  const languageOptions = languages.selectOptions(field);
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
};
renderLanguageField.defaultProps = {
  canEdit: true,
};

const LanguageFields = props => {
  const {
    canAdd,
    canEdit,
    canDelete,
  } = props;

  return (
    <RepeatableField
      name="languages"
      label={<FormattedMessage id="ui-inventory.languages" />}
      addLabel={
        <Icon icon="plus-sign">
          <FormattedMessage id="ui-inventory.addLanguage" />
        </Icon>
      }
      addButtonId="clickable-add-language"
      template={[{
        render(fieldObj) { return renderLanguageField({ ...fieldObj, canEdit }); },
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
