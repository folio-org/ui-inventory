import React, {
  Component,
  Fragment,
  createRef,
} from 'react';
import { Field } from 'redux-form';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { stripesConnect } from '@folio/stripes-core';
import {
  Callout,
  Col,
  KeyValue,
  Row,
  TextField,
} from '@folio/stripes/components';

import {
  clone,
  get,
  keys,
  omit,
  parseInt,
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
export class HRIDHandlingSettings extends Component {
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
  };

  calloutRef = createRef();

  onEdit(data) {
    const { mutator } = this.props;
    const settings = this.onBeforeSave(data);

    return mutator.hridSettings.PUT(settings)
      .then(() => this.showCallout('success', 'ui-inventory.hridHandling.successfullyMessage'))
      .catch(() => this.showCallout('error', 'ui-inventory.hridHandling.errorMessage'));
  }

  onBeforeSave(value) {
    const settings = clone(value);

    keys(settings).forEach(key => {
      if (settings[key].startNumber) {
        const startNumber = settings[key].startNumber;

        settings[key].startNumber = parseInt(startNumber);
      }
    });

    return omit(settings, ['id']);
  }

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

  showCallout(type, messageId) {
    this.calloutRef.current.sendCallout({
      type,
      message: (<FormattedMessage id={messageId} />),
    });
  }

  render() {
    const { resources: { hridSettings } } = this.props;
    const initialValues = this.getInitialValues();

    return (
      <HRIDHandlingForm
        onSubmit={data => this.onEdit(data)}
        initialValues={initialValues}
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
                      className={`${css.margin0} startWithField startWithField--${record.type}`}
                      validate={[validateNumericField, validateRequiredField, validateStartWithMaxLength]}
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
                      className={`${css.margin0} assignPrefixField assignPrefixField--${record.type}`}
                      validate={[validateAlphaNumericField, validateAssignPrefixMaxLength]}
                    />
                  </div>
                </Col>
              </Row>
            </Fragment>
          );
        })}
        <Callout ref={this.calloutRef} />
      </HRIDHandlingForm>
    );
  }
}

export default HRIDHandlingSettings;
