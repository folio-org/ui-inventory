import React, {
  Component,
  Fragment,
  createRef,
} from 'react';
import { Field } from 'react-final-form';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  clone,
  get,
  isEmpty,
  keys,
  omit,
  parseInt,
  isEqual,
} from 'lodash';

import { stripesConnect } from '@folio/stripes-core';
import {
  Col,
  Checkbox,
  Headline,
  Row,
  TextField,
} from '@folio/stripes/components';
import {
  Callout,
  ConfirmationModal,
} from '@folio/stripes-components';

import HRIDHandlingForm from './HRIDHandlingForm';

import {
  validateAlphaNumericField,
  validateFieldLength,
  validateNumericField,
  validateRequiredField,
} from '../../utils';
import { hridSettingsSections } from '../../constants';

import css from './HRIDHandling.css';

const START_WITH_MAX_LENGTH = 11;
const ASSIGN_PREFIX_MAX_LENGTH = 10;
const validateStartWithMaxLength = value => validateFieldLength(value, START_WITH_MAX_LENGTH);
const validateAssignPrefixMaxLength = value => validateFieldLength(value, ASSIGN_PREFIX_MAX_LENGTH);

const composeValidators = (...validators) => value => validators.reduce((error, validator) => error || validator(value), undefined);

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
  };

  constructor(props) {
    super(props);

    this.state = {
      isConfirmModalOpen: false,
      fieldsValues: {},
    };
    this.calloutRef = createRef();
  }

  showCallout(type, messageId) {
    this.calloutRef.current.sendCallout({
      type,
      message: <FormattedMessage id={messageId} />,
    });
  }

  getInitialValues() {
    const { resources } = this.props;
    const settings = get(resources, ['hridSettings', 'records', '0'], {});

    if (settings.commonRetainLeadingZeroes) {
      keys(settings).forEach(key => {
        if (settings[key].startNumber) {
          const value = settings[key].startNumber.toString();

          settings[key].startNumber = value.padStart(START_WITH_MAX_LENGTH, '0');
        }
      });
    }

    return { ...settings };
  }

  toggleRemoveZeroes(form, removeZeroes) {
    const fieldsValues = form.getState().values;
    const fieldsToUpdate = omit(fieldsValues, ['id', 'commonRetainLeadingZeroes']);

    keys(fieldsToUpdate).forEach(key => {
      const entityStartNumber = fieldsValues[key].startNumber;

      if (entityStartNumber) {
        if (removeZeroes) {
          const updatedStartNumber = parseInt(entityStartNumber);

          form.change(`${key}.startNumber`, updatedStartNumber);
        } else {
          const value = entityStartNumber.toString();
          const updatedStartNumber = value.padStart(11, '0');

          form.change(`${key}.startNumber`, updatedStartNumber);
        }
      }
    });
  }

  onBeforeSave(data) {
    const settings = clone(data);

    keys(settings).forEach(key => {
      if (settings[key].startNumber) {
        const startNumber = settings[key].startNumber;

        settings[key].startNumber = parseInt(startNumber);
      }
    });

    return omit(settings, ['id']);
  }

  onEdit() {
    const { fieldsValues } = this.state;
    const data = !isEmpty(fieldsValues) ? this.onBeforeSave(fieldsValues) : {};

    return this.props.mutator.hridSettings.PUT(data)
      .then(() => this.showCallout('success', 'ui-inventory.hridHandling.toast.updated'))
      .catch(() => this.showCallout('error', 'ui-inventory.communicationProblem'));
  }

  onSubmit(data) {
    this.setState({
      isConfirmModalOpen: true,
      fieldsValues: data,
    });
  }

  render() {
    const { mutator } = this.props;
    const initialValues = this.getInitialValues();

    return (
      <HRIDHandlingForm
        initialValues={initialValues}
        mutator={mutator}
        onSubmit={data => this.onSubmit(data)}
        render={form => (
          <>
            <FormattedMessage id="ui-inventory.hridHandling.checkbox.label">
              {([label]) => (
                <div data-test-remove-zeroes-checkbox>
                  <Field
                    name="commonRetainLeadingZeroes"
                    type="checkbox"
                    isEqual={isEqual}
                    format={value => (value === undefined ? false : !value)}
                    parse={value => !value}
                    render={fieldProps => (
                      <Checkbox
                        {...fieldProps.input}
                        label={label}
                        checked={fieldProps.input.checked}
                        onChange={event => {
                          fieldProps.input.onChange(event);
                          this.toggleRemoveZeroes(form, event.target.checked);
                        }}
                        inline
                        labelClass={css.checkboxLabel}
                      />
                    )}
                  />
                </div>
              )}
            </FormattedMessage>
            {hridSettingsSections.map((record, index) => (
              <Fragment key={index}>
                <Row className={css.headlineRow}>
                  <Col xs={12}>
                    <Headline>
                      <FormattedMessage id={record.title} />
                    </Headline>
                  </Col>
                </Row>
                <Row className={css.inputRow}>
                  <Col className={css.inputLabel}>
                    <FormattedMessage id="ui-inventory.hridHandling.label.startWith">
                      {([inputLabel]) => (
                        <div>
                          {inputLabel}
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
                        validate={composeValidators(validateNumericField, validateRequiredField, validateStartWithMaxLength)}
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
                        validate={composeValidators(validateAlphaNumericField, validateAssignPrefixMaxLength)}
                      />
                    </div>
                  </Col>
                </Row>
              </Fragment>
            ))}
            <ConfirmationModal
              id="confirm-edit-hrid-settings-modal"
              open={this.state.isConfirmModalOpen}
              heading={<FormattedMessage id="ui-inventory.hridHandling.modal.header" />}
              message={<FormattedMessage id="ui-inventory.hridHandling.modal.body" />}
              confirmLabel={<FormattedMessage id="ui-inventory.hridHandling.modal.button.confirm" />}
              cancelLabel={<FormattedMessage id="ui-inventory.hridHandling.modal.button.close" />}
              onConfirm={() => {
                this.setState({ isConfirmModalOpen: false });
                this.onEdit();
              }}
              onCancel={() => {
                this.setState({ isConfirmModalOpen: false });
                form.reset();
              }}
              buttonStyle="default"
              cancelButtonStyle="primary"
            />
            <Callout ref={this.calloutRef} />
          </>
        )}
      />
    );
  }
}

export default HRIDHandlingSettings;
