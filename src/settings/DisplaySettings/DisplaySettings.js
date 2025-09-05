import React, {
  useMemo,
} from 'react';
import { useIntl } from 'react-intl';
import { Field } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';

import { ConfigManager } from '@folio/stripes/smart-components';
import {
  Select,
  Row,
  Col,
  CommandList,
  defaultKeyboardShortcuts,
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
import { CheckboxGroup } from './components';

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
      [fieldNames.DEFAULT_COLUMNS]: data?.value[fieldNames.DEFAULT_COLUMNS] || TOGGLEABLE_COLUMNS,
    };
  };

  const formatPayload = (data) => {
    return {
      ...data,
      // defaultColumns is null when all checkboxes are unchecked, so we need to add an empty array
      // as a default value
      [fieldNames.DEFAULT_COLUMNS]: data[fieldNames.DEFAULT_COLUMNS] || [],
    };
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
