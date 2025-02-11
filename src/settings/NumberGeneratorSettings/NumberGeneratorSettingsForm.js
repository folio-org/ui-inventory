import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { FormattedMessage } from 'react-intl';
import { upperFirst } from 'lodash';

import {
  Accordion,
  AccordionSet,
  AccordionStatus,
  Button,
  Checkbox,
  Col,
  ExpandAllButton,
  Label,
  MessageBanner,
  Pane,
  PaneFooter,
  PaneHeader,
  RadioButton,
  Row,
} from '@folio/stripes/components';
import stripesFinalForm from '@folio/stripes/final-form';

import css from './NumberGeneratorSettings.css';
import {
  ACCESSION_NUMBER_SETTING,
  BARCODE_SETTING,
  CALL_NUMBER_SETTING,
  NUMBER_GENERATOR_OPTIONS,
  USE_SHARED_NUMBER,
} from './constants';

const NumberGeneratorSettingsForm = ({
  pristine,
  submitting,
  handleSubmit,
  values,
}) => {
  const disableSharedNumber =
    values?.accessionNumber === NUMBER_GENERATOR_OPTIONS.USE_TEXT_FIELD ||
    values?.callNumber === NUMBER_GENERATOR_OPTIONS.USE_TEXT_FIELD;
  const disableGeneratorOffOption = values?.useSharedNumber;

  const paneHeader = (renderProps) => (
    <PaneHeader
      {...renderProps}
      paneTitle={<FormattedMessage id="ui-inventory.numberGenerator.options" />}
    />
  );

  const paneFooter = (
    <PaneFooter
      renderEnd={
        <Button
          buttonStyle="primary mega"
          disabled={pristine || submitting}
          id="clickable-save-number-generator-settings"
          onClick={handleSubmit}
          type="submit"
        >
          <FormattedMessage id="stripes-core.button.save" />
        </Button>
      }
    />
  );

  return (
    <form onSubmit={handleSubmit} id="numberGeneratorSettingsForm">
      <Pane
        defaultWidth="fill"
        footer={paneFooter}
        id="number-generator-settings-form"
        renderHeader={paneHeader}
      >
        <Row className={css.marginBottomGutter}>
          <Col xs={12}>
            <MessageBanner>
              <p><FormattedMessage id="ui-inventory.numberGenerator.info" /></p>
            </MessageBanner>
          </Col>
        </Row>
        <AccordionStatus>
          <Row end="xs">
            <Col xs>
              <ExpandAllButton />
            </Col>
          </Row>
          <AccordionSet initialStatus={{}}>
            <Accordion
              id="acc01"
              label={<FormattedMessage id="ui-inventory.holdings" />}
            >
              <Row className={css.marginBottomGutter}>
                <Col xs={12}>
                  <Label><FormattedMessage id="ui-inventory.numberGenerator.callNumber" /></Label>
                  <Field
                    component={RadioButton}
                    id={`${CALL_NUMBER_SETTING}Holdings${upperFirst(NUMBER_GENERATOR_OPTIONS.USE_TEXT_FIELD)}`}
                    label={<FormattedMessage id="ui-inventory.numberGenerator.setManually" values={{ number: <FormattedMessage id="ui-inventory.numberGenerator.callNumber" /> }} />}
                    name={`${CALL_NUMBER_SETTING}Holdings`}
                    type="radio"
                    value={NUMBER_GENERATOR_OPTIONS.USE_TEXT_FIELD}
                  />
                  <Field
                    component={RadioButton}
                    id={`${CALL_NUMBER_SETTING}Holdings${upperFirst(NUMBER_GENERATOR_OPTIONS.USE_BOTH)}`}
                    label={<FormattedMessage id="ui-inventory.numberGenerator.setGeneratorOrManually" values={{ number: <FormattedMessage id="ui-inventory.numberGenerator.callNumber" /> }} />}
                    name={`${CALL_NUMBER_SETTING}Holdings`}
                    type="radio"
                    value={NUMBER_GENERATOR_OPTIONS.USE_BOTH}
                  />
                  <Field
                    component={RadioButton}
                    id={`${CALL_NUMBER_SETTING}Holdings${upperFirst(NUMBER_GENERATOR_OPTIONS.USE_GENERATOR)}`}
                    label={<FormattedMessage id="ui-inventory.numberGenerator.setGenerator" values={{ number: <FormattedMessage id="ui-inventory.numberGenerator.callNumber" /> }} />}
                    name={`${CALL_NUMBER_SETTING}Holdings`}
                    type="radio"
                    value={NUMBER_GENERATOR_OPTIONS.USE_GENERATOR}
                  />
                </Col>
              </Row>
            </Accordion>
            <Accordion
              id="acc02"
              label={<FormattedMessage id="ui-inventory.items" />}
            >
              <Row className={css.marginBottomGutter}>
                <Col xs={12}>
                  <Label><FormattedMessage id="ui-inventory.numberGenerator.barcode" /></Label>
                  <Field
                    component={RadioButton}
                    id={`${BARCODE_SETTING}${upperFirst(NUMBER_GENERATOR_OPTIONS.USE_TEXT_FIELD)}`}
                    label={<FormattedMessage id="ui-inventory.numberGenerator.setManually" values={{ number: <FormattedMessage id="ui-inventory.numberGenerator.barcode" /> }} />}
                    name={BARCODE_SETTING}
                    type="radio"
                    value={NUMBER_GENERATOR_OPTIONS.USE_TEXT_FIELD}
                  />
                  <Field
                    component={RadioButton}
                    id={`${BARCODE_SETTING}${upperFirst(NUMBER_GENERATOR_OPTIONS.USE_BOTH)}`}
                    label={<FormattedMessage id="ui-inventory.numberGenerator.setGeneratorOrManually" values={{ number: <FormattedMessage id="ui-inventory.numberGenerator.barcode" /> }} />}
                    name={BARCODE_SETTING}
                    type="radio"
                    value={NUMBER_GENERATOR_OPTIONS.USE_BOTH}
                  />
                  <Field
                    component={RadioButton}
                    id={`${BARCODE_SETTING}${upperFirst(NUMBER_GENERATOR_OPTIONS.USE_GENERATOR)}`}
                    label={<FormattedMessage id="ui-inventory.numberGenerator.setGenerator" values={{ number: <FormattedMessage id="ui-inventory.numberGenerator.barcode" /> }} />}
                    name={BARCODE_SETTING}
                    type="radio"
                    value={NUMBER_GENERATOR_OPTIONS.USE_GENERATOR}
                  />
                </Col>
              </Row>
              <Row className={css.marginBottomGutter}>
                <Col xs={12}>
                  <Label><FormattedMessage id="ui-inventory.numberGenerator.accessionNumber" /></Label>
                  <Field
                    className={disableGeneratorOffOption ? css.greyLabel : null}
                    component={RadioButton}
                    disabled={disableGeneratorOffOption}
                    id={`${ACCESSION_NUMBER_SETTING}${upperFirst(NUMBER_GENERATOR_OPTIONS.USE_TEXT_FIELD)}`}
                    label={<FormattedMessage id="ui-inventory.numberGenerator.setManually" values={{ number: <FormattedMessage id="ui-inventory.numberGenerator.accessionNumber" /> }} />}
                    name={ACCESSION_NUMBER_SETTING}
                    type="radio"
                    value={NUMBER_GENERATOR_OPTIONS.USE_TEXT_FIELD}
                  />
                  <Field
                    component={RadioButton}
                    id={`${ACCESSION_NUMBER_SETTING}${upperFirst(NUMBER_GENERATOR_OPTIONS.USE_BOTH)}`}
                    label={<FormattedMessage id="ui-inventory.numberGenerator.setGeneratorOrManually" values={{ number: <FormattedMessage id="ui-inventory.numberGenerator.accessionNumber" /> }} />}
                    name={ACCESSION_NUMBER_SETTING}
                    type="radio"
                    value={NUMBER_GENERATOR_OPTIONS.USE_BOTH}
                  />
                  <Field
                    component={RadioButton}
                    id={`${ACCESSION_NUMBER_SETTING}${upperFirst(NUMBER_GENERATOR_OPTIONS.USE_GENERATOR)}`}
                    label={<FormattedMessage id="ui-inventory.numberGenerator.setGenerator" values={{ number: <FormattedMessage id="ui-inventory.numberGenerator.accessionNumber" /> }} />}
                    name={ACCESSION_NUMBER_SETTING}
                    type="radio"
                    value={NUMBER_GENERATOR_OPTIONS.USE_GENERATOR}
                  />
                </Col>
              </Row>
              <Row className={css.marginBottomGutter}>
                <Col xs={12}>
                  <Label><FormattedMessage id="ui-inventory.numberGenerator.callNumber" /></Label>
                  <Field
                    className={disableGeneratorOffOption ? css.greyLabel : null}
                    component={RadioButton}
                    disabled={disableGeneratorOffOption}
                    id={`${CALL_NUMBER_SETTING}${upperFirst(NUMBER_GENERATOR_OPTIONS.USE_TEXT_FIELD)}`}
                    label={<FormattedMessage id="ui-inventory.numberGenerator.setManually" values={{ number: <FormattedMessage id="ui-inventory.numberGenerator.callNumber" /> }} />}
                    name={CALL_NUMBER_SETTING}
                    type="radio"
                    value={NUMBER_GENERATOR_OPTIONS.USE_TEXT_FIELD}
                  />
                  <Field
                    component={RadioButton}
                    id={`${CALL_NUMBER_SETTING}${upperFirst(NUMBER_GENERATOR_OPTIONS.USE_BOTH)}`}
                    label={<FormattedMessage id="ui-inventory.numberGenerator.setGeneratorOrManually" values={{ number: <FormattedMessage id="ui-inventory.numberGenerator.callNumber" /> }} />}
                    name={CALL_NUMBER_SETTING}
                    type="radio"
                    value={NUMBER_GENERATOR_OPTIONS.USE_BOTH}
                  />
                  <Field
                    component={RadioButton}
                    id={`${CALL_NUMBER_SETTING}${upperFirst(NUMBER_GENERATOR_OPTIONS.USE_GENERATOR)}`}
                    label={<FormattedMessage id="ui-inventory.numberGenerator.setGenerator" values={{ number: <FormattedMessage id="ui-inventory.numberGenerator.callNumber" /> }} />}
                    name={CALL_NUMBER_SETTING}
                    type="radio"
                    value={NUMBER_GENERATOR_OPTIONS.USE_GENERATOR}
                  />
                </Col>
              </Row>
              <Row>
                <Col xs={12}>
                  <Field
                    component={Checkbox}
                    disabled={disableSharedNumber}
                    id={USE_SHARED_NUMBER}
                    label={<FormattedMessage id="ui-inventory.numberGenerator.accessionNumberEqualCallNumber" />}
                    name={USE_SHARED_NUMBER}
                    type="checkbox"
                  />
                  {disableSharedNumber &&
                    <MessageBanner type="warning">
                      <FormattedMessage id="ui-inventory.numberGenerator.accessionNumberEqualCallNumber.warning" />
                    </MessageBanner>
                  }
                </Col>
              </Row>
            </Accordion>
          </AccordionSet>
        </AccordionStatus>
      </Pane>
    </form>
  );
};

NumberGeneratorSettingsForm.propTypes = {
  pristine: PropTypes.bool,
  submitting: PropTypes.bool,
  handleSubmit: PropTypes.func.isRequired,
  values: PropTypes.object,
};

export default stripesFinalForm({
  enableReinitialize: true,
  keepDirtyOnReinitialize: true,
  navigationCheck: true,
  subscription: { values: true },
})(NumberGeneratorSettingsForm);
