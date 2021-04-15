import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { FormattedMessage, useIntl } from 'react-intl';

import { useStripes } from '@folio/stripes/core';
import {
  languageOptions,
  Select,
} from '@folio/stripes/components';

import RepeatableField from '../components/RepeatableField';

const renderLanguageField = ({ field, fieldIndex, canEdit, langOptions }) => {
  const label = fieldIndex === 0 ? <FormattedMessage id="ui-inventory.language" /> : null;

  return (
    <FormattedMessage id="ui-inventory.selectLanguage">
      {([placeholder]) => (
        <Field
          label={label}
          name={field}
          component={Select}
          placeholder={placeholder}
          dataOptions={langOptions}
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
  langOptions: PropTypes.arrayOf(PropTypes.object),
};
renderLanguageField.defaultProps = {
  canEdit: true,
  langOptions: [],
};

const LanguageFields = props => {
  const {
    canAdd,
    canEdit,
    canDelete,
  } = props;

  const intl = useIntl();
  const stripes = useStripes();
  const langOptions = languageOptions(intl, stripes.locale);

  return (
    <RepeatableField
      name="languages"
      label={<FormattedMessage id="ui-inventory.languages" />}
      addLabel={<FormattedMessage id="ui-inventory.addLanguage" />}
      addButtonId="clickable-add-language"
      template={[{
        render(fieldObj) { return renderLanguageField({ ...fieldObj, canEdit, langOptions }); },
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
