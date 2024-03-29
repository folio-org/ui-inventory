import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';
import {
  get,
  isEmpty,
} from 'lodash';

import {
  IntlConsumer,
  TitleManager,
} from '@folio/stripes/core';

import {
  Col,
  Row,
  Select,
  LoadingPane,
} from '@folio/stripes/components';
import { ConfigManager } from '@folio/stripes/smart-components';

import FastAddForm from './FastAddForm';

class FastAddSettings extends Component {
  static manifest = Object.freeze({
    instanceStatuses: {
      type: 'okapi',
      path: 'instance-statuses',
      throwErrors: false,
      records: 'instanceStatuses',
    },
  });

  static propTypes = {
    resources: PropTypes.object.isRequired,
    stripes: PropTypes.object.isRequired,
    label: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this.configManager = props.stripes.connect(ConfigManager);
  }

  getInitialValues(settings) {
    let config;
    const value = isEmpty(settings) ? '' : settings[0].value;
    const defaultConfig = {
      instanceStatusCode: '',
      defaultDiscoverySuppress: 'true',
    };

    try {
      config = { ...defaultConfig, ...JSON.parse(value) };
    } catch (e) {
      config = defaultConfig;
    }

    return config;
  }

  beforeSave(data) {
    return JSON.stringify(data);
  }

  render() {
    const {
      label,
      resources,
      stripes,
    } = this.props;

    const instanceStatuses = get(resources, 'instanceStatuses.records', []).map(({ code, name }) => ({
      label: name,
      value: code,
    }));

    const canEdit = stripes.hasPerm('ui-inventory.settings.fast-add');

    if (resources.instanceStatuses.isPending) return <LoadingPane />;

    return (
      <this.configManager
        configName="fastAddSettings"
        moduleName="FAST_ADD"
        label={label}
        configFormComponent={FastAddForm}
        getInitialValues={this.getInitialValues}
        onBeforeSave={this.beforeSave}
      >
        <IntlConsumer>
          {intl => (
            <>
              <TitleManager
                page={intl.formatMessage({ id: 'ui-inventory.settings.inventory.title' })}
                record={intl.formatMessage({ id: 'ui-inventory.fastAdd' })}
              />
              <Row>
                <Col
                  xs={4}
                  data-test-default-instance-status
                >
                  <FormattedMessage id="ui-inventory.selectInstanceStatus">
                    {([placeholder]) => (
                      <Field
                        component={Select}
                        dataOptions={[{ label: `${placeholder}`, value: '' }, ...instanceStatuses]}
                        fullWidth
                        label={<FormattedMessage id="ui-inventory.defaultInstanceStatus" />}
                        name="instanceStatusCode"
                        readOnly={!canEdit}
                      />
                    )}
                  </FormattedMessage>
                </Col>
              </Row>
              <Row>
                <Col
                  xs={4}
                  data-test-default-discovery-suppress
                >
                  <Field
                    component={Select}
                    dataOptions={[
                      {
                        label: intl.formatMessage({ id: 'ui-inventory.yes' }),
                        value: true,
                      },
                      {
                        label: intl.formatMessage({ id: 'ui-inventory.no' }),
                        value: false,
                      },
                    ]}
                    fullWidth
                    label={<FormattedMessage id="ui-inventory.defaultDiscoverySuppress" />}
                    name="defaultDiscoverySuppress"
                    readOnly={!canEdit}
                  />
                </Col>
              </Row>
            </>
          )}
        </IntlConsumer>
      </this.configManager>
    );
  }
}

export default FastAddSettings;
