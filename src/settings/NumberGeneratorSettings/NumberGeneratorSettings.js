import { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';

import { useStripes } from '@folio/stripes/core';
import { ConfigManager } from '@folio/stripes/smart-components';

import {
  NUMBER_GENERATOR_SETTINGS_KEY,
  NUMBER_GENERATOR_SETTINGS_SCOPE,
} from './constants';
import NumberGeneratorSettingsForm from './NumberGeneratorSettingsForm';

const NumberGeneratorSettings = () => {
  const stripes = useStripes();
  const ConnectedConfigManager = useMemo(() => stripes.connect(ConfigManager), [stripes]);

  const beforeSave = (data) => data || '';
  const getInitialValues = (settings) => (settings?.[0]?.value || '');

  return (
    <ConnectedConfigManager
      configName={NUMBER_GENERATOR_SETTINGS_KEY}
      formType="final-form"
      getInitialValues={getInitialValues}
      label={<FormattedMessage id="ui-inventory.numberGenerator.options" />}
      onBeforeSave={beforeSave}
      scope={NUMBER_GENERATOR_SETTINGS_SCOPE}
      configFormComponent={NumberGeneratorSettingsForm}
    />
  );
};

export default NumberGeneratorSettings;
