import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { FormattedMessage, useIntl } from 'react-intl';
import { Link } from 'react-router-dom';

import {
  Accordion,
  AccordionSet,
  AccordionStatus,
  Button,
  Checkbox,
  Col,
  ExpandAllButton,
  MessageBanner,
  Pane,
  PaneFooter,
  PaneHeader,
  Row,
  Select,
} from '@folio/stripes/components';
import stripesFinalForm from '@folio/stripes/final-form';

import css from './NumberGeneratorSettings.css';
import {
  ACCESSION_NUMBER_SETTING,
  BARCODE_SETTING,
  CALL_NUMBER_SETTING,
  NUMBER_GENERATOR_OPTIONS,
  NUMBER_GENERATOR_OPTIONS_OFF,
  USE_SHARED_NUMBER,
  SERVICE_INTERACTION_API,
  SERVICE_INTERACTION_NUMBER_GENERATOR_SEQUENCES_API,
} from './constants';

const NumberGeneratorSettingsForm = ({
  pristine,
  submitting,
  handleSubmit,
  values,
}) => {
  const intl = useIntl();

  const disableSharedNumber =
    values?.accessionNumber === NUMBER_GENERATOR_OPTIONS_OFF ||
    values?.callNumber === NUMBER_GENERATOR_OPTIONS_OFF;
  const disableGeneratorOffOption = values?.useSharedNumber;

  const getTranslatedDataOptions = (field, shouldDisableOff) => {
    return field.map(item => ({
      label: item.value ? intl.formatMessage({ id: `ui-inventory.numberGenerator.options.${item.value}` }) : '',
      value: item.value,
      disabled: shouldDisableOff && item.value === NUMBER_GENERATOR_OPTIONS_OFF,
    }));
  };

  const dataOptionsAllEnabled = getTranslatedDataOptions(NUMBER_GENERATOR_OPTIONS, false);
  const dataOptionsOffDisabled = getTranslatedDataOptions(NUMBER_GENERATOR_OPTIONS, disableGeneratorOffOption);

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
              <p>
                <FormattedMessage
                  id="ui-inventory.numberGenerator.infoAdditional"
                  values={{
                    serviceInteractionLink: (
                      <Link to={SERVICE_INTERACTION_API}>
                        <FormattedMessage id="stripes-core.settings" />{' > '}
                        <FormattedMessage id="ui-service-interaction.meta.title" />
                      </Link>
                    ),
                    numberGeneratorSequencesLink: (
                      <Link to={SERVICE_INTERACTION_NUMBER_GENERATOR_SEQUENCES_API}>
                        <FormattedMessage id="stripes-core.settings" />{' > '}
                        <FormattedMessage id="ui-service-interaction.meta.title" />{' > '}
                        <FormattedMessage id="ui-service-interaction.settings.numberGeneratorSequences" />
                      </Link>
                    ),
                  }}
                />
              </p>
            </MessageBanner>
          </Col>
        </Row>
        <AccordionStatus>
          <Row end="xs">
            <Col xs>
              <ExpandAllButton />
            </Col>
          </Row>
          <AccordionSet>
            <Accordion
              id="acc01"
              label={<FormattedMessage id="ui-inventory.holdings" />}
            >
              <Row className={css.marginBottomGutter}>
                <Col xs={6}>
                  <Field
                    component={Select}
                    dataOptions={dataOptionsAllEnabled}
                    id={`${CALL_NUMBER_SETTING}Holdings`}
                    label={<FormattedMessage id="ui-inventory.numberGenerator.callNumber" />}
                    name={`${CALL_NUMBER_SETTING}Holdings`}
                  />
                </Col>
              </Row>
            </Accordion>
            <Accordion
              id="acc02"
              label={<FormattedMessage id="ui-inventory.items" />}
            >
              <Row className={css.marginBottomGutter}>
                <Col xs={6}>
                  <Field
                    component={Select}
                    dataOptions={dataOptionsAllEnabled}
                    id={BARCODE_SETTING}
                    label={<FormattedMessage id="ui-inventory.numberGenerator.barcode" />}
                    name={BARCODE_SETTING}
                  />
                </Col>
              </Row>
              <Row className={css.marginBottomGutter}>
                <Col xs={6}>
                  <Field
                    component={Select}
                    dataOptions={dataOptionsOffDisabled}
                    id={ACCESSION_NUMBER_SETTING}
                    label={<FormattedMessage id="ui-inventory.numberGenerator.accessionNumber" />}
                    name={ACCESSION_NUMBER_SETTING}
                  />
                </Col>
              </Row>
              <Row className={css.marginBottomGutter}>
                <Col xs={6}>
                  <Field
                    component={Select}
                    dataOptions={dataOptionsOffDisabled}
                    id={CALL_NUMBER_SETTING}
                    label={<FormattedMessage id="ui-inventory.numberGenerator.callNumber" />}
                    name={CALL_NUMBER_SETTING}
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
