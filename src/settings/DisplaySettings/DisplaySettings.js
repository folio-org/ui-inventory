import React, {
  useMemo,
} from 'react';
import { useIntl } from 'react-intl';
import { Field } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays'; // TODO: check dep available

import { ConfigManager } from '@folio/stripes/smart-components';
import {
  Select,
  Row,
  Col,
  CommandList,
  defaultKeyboardShortcuts,
  Checkbox,
  Label,
} from '@folio/stripes/components';
import {
  TitleManager,
  useStripes,
} from '@folio/stripes/core';
import {
  DEFAULT_SORT,
  DISPLAY_SETTINGS_KEY,
  DISPLAY_SETTINGS_SCOPE,
  TOGGLEABLE_COLUMNS,
} from '@folio/stripes-inventory-components';

import { getSortOptions } from '../../utils';

const CheckboxGroup = ({ fields, options, label }) => {
  const handleCheck = (e, optionValue) => {
    const optionIndex = fields.value?.findIndex(option => option === optionValue);

    if (e.target.checked) {
      fields.push(optionValue);
    } else {
      fields.remove(optionIndex);
    }
  };

  return (
    <div>
      <Label>{label}</Label>
      {options.map(option => (
        <div key={option.value}>
          <Checkbox
            aria-label={label}
            checked={fields.value?.includes?.(option.value) ?? false}
            onChange={(e) => handleCheck(e, option.value)}
            type="checkbox"
            value={option.value}
            label={option.label}
          />
        </div>
      ))}
    </div>
  );
};

const DisplaySettings = () => {
  const intl = useIntl();
  const stripes = useStripes();
  const ConnectedConfigManager = useMemo(() => stripes.connect(ConfigManager), [stripes]);
  const sortFieldLabel = intl.formatMessage({ id: 'ui-inventory.settings.displaySettings.defaultSort' });
  const columnsFieldLabel = intl.formatMessage({ id: 'ui-inventory.settings.displaySettings.defaultColumns' });

  const paneTitle = intl.formatMessage({ id: 'ui-inventory.settings.section.displaySettings' });
  const fieldNames = {
    DEFAULT_SORT: 'defaultSort',
    DEFAULT_COLUMNS: 'defaultColumns',
  };

  const columnsOptions = TOGGLEABLE_COLUMNS.map(column => ({
    value: column,
    label: intl.formatMessage({ id: `ui-inventory.settings.displaySettings.defaultColumns.options.${column}` }),
  }));

  const getInitialValues = ([data]) => {
    return {
      [fieldNames.DEFAULT_SORT]: data?.value[fieldNames.DEFAULT_SORT] || DEFAULT_SORT,
      [fieldNames.DEFAULT_COLUMNS]: data?.value[fieldNames.DEFAULT_COLUMNS] || [],
    };
  };

  const formatPayload = (data) => {
    return data;
  };

  return (
    <CommandList commands={defaultKeyboardShortcuts}>
      <TitleManager record={paneTitle}>
        <ConnectedConfigManager
          formType="final-form"
          scope={DISPLAY_SETTINGS_SCOPE}
          configName={DISPLAY_SETTINGS_KEY}
          label={paneTitle}
          getInitialValues={getInitialValues}
          stripes={stripes}
          onBeforeSave={formatPayload}
        >
          <Row>
            <Col xs={4}>
              <Field
                name={fieldNames.DEFAULT_SORT}
                label={sortFieldLabel}
                component={Select}
                dataOptions={getSortOptions(intl)}
              />
              <FieldArray
                name={fieldNames.DEFAULT_COLUMNS}
                label={columnsFieldLabel}
                component={CheckboxGroup}
                options={columnsOptions}
              />
            </Col>
          </Row>
        </ConnectedConfigManager>
      </TitleManager>
    </CommandList>
  );
};

export default DisplaySettings;
