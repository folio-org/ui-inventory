import React, {
  Component,
  Fragment,
} from 'react';
import { Field } from 'redux-form';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { stripesConnect } from '@folio/stripes-core';
import {
  Col,
  KeyValue,
  Row,
  TextField,
} from '@folio/stripes/components';

import {
  get,
  keys,
} from 'lodash';

import {
  validateAlphaNumericField,
  validateFieldLength,
  validateNumericField,
  validateRequiredField,
} from '../../utils';
import { hridSettingsSections } from '../../constants';
import HRIDHandlingForm from './HRIDHandlingForm';
import css from './HRIDHandling.css';

const START_WITH_MAX_LENGTH = 11;
const ASSIGN_PREFIX_MAX_LENGTH = 10;
const validateStartWithMaxLength = value => validateFieldLength(value, START_WITH_MAX_LENGTH);
const validateAssignPrefixMaxLength = value => validateFieldLength(value, ASSIGN_PREFIX_MAX_LENGTH);

@stripesConnect
class HRIDHandlingSettings extends Component {
  static manifest = Object.freeze({
    hridSettings: {
      type: 'okapi',
      path: 'hrid-settings-storage/hrid-settings',
      throwErrors: false,
      PUT: { path: 'hrid-settings-storage/hrid-settings' },
    },
  });

  static propTypes = {
    mutator: PropTypes.object.isRequired,
    resources: PropTypes.object.isRequired,
    stripes: PropTypes.shape({
      connect: PropTypes.func.isRequired,
    }).isRequired,
  };

  getInitialValues() {
    const { resources } = this.props;
    const settings = get(resources, ['hridSettings', 'records', '0'], {});

    keys(settings).forEach(key => {
      if (settings[key].startNumber) {
        const value = settings[key].startNumber.toString();

        settings[key].startNumber = value.padStart(START_WITH_MAX_LENGTH, '0');
      }
    });

    return { ...settings };
  }

  render() {
    const {
      mutator,
      stripes,
    } = this.props;
    const initialValues = this.getInitialValues();
    const hasPerm = stripes.hasPerm('ui-inventory.settings.hrid-handling');
    console.log('hasPerm');
    console.log(hasPerm);

    return (
      <HRIDHandlingForm
        initialValues={initialValues}
        mutator={mutator}
      >
        {hridSettingsSections.map((record, index) => {
          return (
            <Fragment key={index}>
              <Row className={css.headlineRow}>
                <Col
                  xs={12}
                >
                  <KeyValue
                    label={<FormattedMessage id={record.title} />}
                  />
                </Col>
              </Row>
              <Row className={css.inputRow}>
                <Col className={css.inputLabel}>
                  <FormattedMessage id="ui-inventory.hridHandling.label.startWith">
                    {txt => (
                      <div>
                        {txt}
                        <span className={css.asterisk}>*</span>
                      </div>
                    )}
                  </FormattedMessage>
                </Col>
                <Col>
                  <div
                    data-test-start-with-field
                    className={css.inputField}
                  >
                    <Field
                      name={`${record.type}.startNumber`}
                      required
                      component={TextField}
                      readOnly={!hasPerm}
                      className={`${css.margin0} startWithField startWithField--${record.type}`}
                      validate={hasPerm && [validateNumericField, validateRequiredField, validateStartWithMaxLength]}
                    />
                  </div>
                </Col>
              </Row>
              <Row className={css.inputRow}>
                <Col className={css.inputLabel}>
                  <div>
                    <FormattedMessage id="ui-inventory.hridHandling.label.assignPrefix" />
                  </div>
                </Col>
                <Col>
                  <div
                    data-test-assign-prefix-field
                    className={css.inputField}
                  >
                    <Field
                      name={`${record.type}.prefix`}
                      component={TextField}
                      readOnly={!hasPerm}
                      className={`${css.margin0} assignPrefixField assignPrefixField--${record.type}`}
                      validate={hasPerm && [validateAlphaNumericField, validateAssignPrefixMaxLength]}
                    />
                  </div>
                </Col>
              </Row>
            </Fragment>
          );
        })}
      </HRIDHandlingForm>
    );
  }
}

export default HRIDHandlingSettings;
