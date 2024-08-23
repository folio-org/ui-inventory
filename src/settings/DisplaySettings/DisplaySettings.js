import React, {
  useMemo,
} from 'react';
import { useIntl } from 'react-intl';
import { Field } from 'react-final-form';

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
} from '@folio/stripes-inventory-components';

import { getSortOptions } from '../../utils';

const DisplaySettings = () => {
  const intl = useIntl();
  const stripes = useStripes();
  const ConnectedConfigManager = useMemo(() => stripes.connect(ConfigManager), [stripes]);
  const label = intl.formatMessage({ id: 'ui-inventory.settings.displaySettings.defaultSort' });
  const paneTitle = intl.formatMessage({ id: 'ui-inventory.settings.section.displaySettings' });
  const fieldNames = {
    DEFAULT_SORT: 'defaultSort',
  };

  const getInitialValues = ([data]) => {
    return {
      [fieldNames.DEFAULT_SORT]: data?.value[fieldNames.DEFAULT_SORT] || DEFAULT_SORT,
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
                label={label}
                component={Select}
                dataOptions={getSortOptions(intl)}
              />
            </Col>
          </Row>
        </ConnectedConfigManager>
      </TitleManager>
    </CommandList>
  );
};

export default DisplaySettings;
