import React, {
  Fragment,
  createRef,
} from 'react';
import { Field } from 'redux-form';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Callout,
  TextField,
  KeyValue,
  Row,
  Col,
} from '@folio/stripes/components';

import stripesForm from '@folio/stripes/form';

import HRIDHandlingForm from './HRIDHandlingForm';
import css from './HRIDHandling.css';
import {
  validateNumericField,
  validateAlphaNumericField,
  validateRequiredField,
  validateFieldLength,
} from '../../utils';

// TODO: this const will be removed after BE stories will be done

const DEFAULT_RECORDS = [
  {
    id: '1',
    title: 'ui-inventory.hridHandling.sectionHeader1',
    recordsType: 'instancesAndMARCBibliographic',
  },
  {
    id: '2',
    title: 'ui-inventory.hridHandling.sectionHeader2',
    recordsType: 'holdingAndMARCHoldings',
  },
  {
    id: '3',
    title: 'ui-inventory.hridHandling.sectionHeader3',
    recordsType: 'item',
  },
];
const START_WITH_MAX_LENGTH = 11;
const ASSIGN_PREFIX_MAX_LENGTH = 10;
const validateStartWithMaxLength = value => validateFieldLength(value, START_WITH_MAX_LENGTH);
const validateAssignPrefixMaxLength = value => validateFieldLength(value, ASSIGN_PREFIX_MAX_LENGTH);

const HRIDHandling = ({
  pristine,
  submitting,
  handleSubmit,
}) => {
  const isSubmitDisabled = pristine || submitting;
  const calloutRef = createRef();

  const showCallout = () => {
    calloutRef.current.sendCallout({
      type: 'success',
      message: (
        <FormattedMessage
          data-test-invoice-settings-voucher-number-error
          id="ui-inventory.hridHandling.successfullyMessage"
        />),
    });
  };

  return (
    <HRIDHandlingForm
      isSubmitDisabled={isSubmitDisabled}
      onSubmit={handleSubmit(showCallout)}
    >
      {DEFAULT_RECORDS.map((data, index) => {
        return (
          <Fragment key={index}>
            <Row className={css.headlineRow}>
              <Col
                xs={12}
              >
                <KeyValue
                  label={<FormattedMessage id={data.title} />}
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
              <Col className={css.inputField}>
                <div data-test-start-with-field>
                  <Field
                    name={`startWith${data.id}`}
                    required
                    component={TextField}
                    className={`${css.margin0} startWithField startWithField--${data.recordsType}`}
                    validate={[validateRequiredField, validateNumericField, validateStartWithMaxLength]}
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
              <Col className={css.inputField}>
                <div data-test-assign-prefix-field>
                  <Field
                    name={`assignPrefix${data.id}`}
                    component={TextField}
                    className={`${css.margin0} assignPrefixField assignPrefixField--${data.recordsType}`}
                    validate={[validateAlphaNumericField, validateAssignPrefixMaxLength]}
                  />
                </div>
              </Col>
            </Row>
          </Fragment>
        );
      })}
      <Callout ref={calloutRef} />
    </HRIDHandlingForm>
  );
};

HRIDHandling.propTypes = {
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

// TODO: initialValues will be renamed and passed to the component from BE after BE stories will be done

export default stripesForm({
  form: 'hridHandling',
  navigationCheck: true,
  enableReinitialize: true,
  initialValues: {
    startWith1: '00000000001',
    assignPrefix1: 'in',
    startWith2: '00000000001',
    assignPrefix2: 'ho',
    startWith3: '00000000001',
    assignPrefix3: 'it',
  },
})(HRIDHandling);
