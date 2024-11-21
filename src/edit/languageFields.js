import React from 'react';
import PropTypes from 'prop-types';
import { FieldArray } from 'react-final-form-arrays';
import { Field } from 'react-final-form';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';

import { useStripes } from '@folio/stripes/core';
import {
  languageOptions,
  Select,
  RepeatableField,
  Label,
} from '@folio/stripes/components';

const LanguageFields = ({
  canAdd = true,
  canEdit = true,
  canDelete = true,
}) => {
  const intl = useIntl();
  const stripes = useStripes();
  const langOptions = languageOptions(intl, stripes.locale);

  const languageLabel = intl.formatMessage({ id: 'ui-inventory.language' });

  const legend = (
    <Label tagName="legend" required>
      {languageLabel}
    </Label>
  );

  const renderField = (field, index) => (
    <Field
      aria-label={languageLabel}
      name={field}
      title={field}
      component={Select}
      placeholder={intl.formatMessage({ id: 'ui-inventory.selectLanguage' })}
      dataOptions={langOptions}
      data-test-language-field-count={index}
      required
      disabled={!canEdit}
    />
  );

  return (
    <FieldArray
      name="languages"
      component={RepeatableField}
      legend={<FormattedMessage id="ui-inventory.languages" />}
      addLabel={<FormattedMessage id="ui-inventory.addLanguage" />}
      onAdd={fields => fields.push('')}
      headLabels={legend}
      renderField={renderField}
      canAdd={canAdd}
      canRemove={canDelete}
    />
  );
};

LanguageFields.propTypes = {
  canAdd: PropTypes.bool,
  canEdit: PropTypes.bool,
  canDelete: PropTypes.bool,
};

export default LanguageFields;
