import { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { FieldArray } from 'react-final-form-arrays';
import { Field, useForm } from 'react-final-form';
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
  const { getState, initialize } = useForm();
  const intl = useIntl();
  const stripes = useStripes();

  const langOptions = useMemo(() => languageOptions(intl, stripes.locale), [intl, stripes.locale]);
  const languageLabel = useMemo(() => intl.formatMessage({ id: 'ui-inventory.language' }), [intl]);
  const validLanguageCodes = useMemo(() => langOptions.map(opt => opt.value), [langOptions]);

  useEffect(() => {
    const languages = getState().values?.languages || [];
    if (languages.some(lang => lang && !validLanguageCodes.includes(lang))) {
      initialize(values => ({
        ...values,
        languages: languages.map(lang => (lang && validLanguageCodes.includes(lang) ? lang : null)),
      }));
    }
  }, []);

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
      dataOptions={[{ label: intl.formatMessage({ id: 'ui-inventory.selectLanguage' }), value: '' }, ...langOptions]}
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
