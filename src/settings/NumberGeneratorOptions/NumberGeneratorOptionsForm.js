import { useRef } from 'react';

import { FormattedMessage } from 'react-intl';
import { Field, useFormState } from 'react-final-form';

import {
  Accordion,
  AccordionSet,
  AccordionStatus,
  Button,
  Checkbox,
  Col,
  ExpandAllButton,
  InfoPopover,
  Label,
  Layout,
  MessageBanner,
  RadioButton,
  Row,
} from '@folio/stripes/components';

import css from './NumberGeneratorOptions.css';

const NumberGeneratorOptionsForm = () => {
  const accordionStatusRef = useRef();
  const { values } = useFormState();
  const disableUseForBothFields =
    (values?.accessionNumberGeneratorSettingItems ?? 'useTextField') === 'useTextField' ||
    (values?.callNumberGeneratorSettingItems ?? 'useTextField') === 'useTextField';

  const disableAccessionNumberAndCallNumberOffOptions = !!values?.useAccessionNumberForCallNumberItems;

  return (
    <>
      <Row>
        <Col xs={12}>
          <div className={css.marginBottomGutter}>
            <MessageBanner>
              <FormattedMessage id="ui-inventory.settings.numberGeneratorOptions.info" />
            </MessageBanner>
          </div>
        </Col>
      </Row>
      <AccordionStatus ref={accordionStatusRef}>
        <Row end="xs">
          <Col xs>
            <ExpandAllButton />
          </Col>
        </Row>
        <AccordionSet>
          <Accordion
            label={
              <h3>
                <FormattedMessage id="ui-inventory.holdings" />
              </h3>
            }
            id="number-generator-options-holdings"
          >
            <Row>
              <Col xs={12}>
                <div className={css.marginBottomGutter}>
                  <Label>
                    <FormattedMessage id="ui-inventory.callNumber" />
                  </Label>
                  <Field
                    component={RadioButton}
                    id="useTextFieldCallNumberHoldings"
                    label={
                      <div className={disableAccessionNumberAndCallNumberOffOptions ? css.greyLabel : null}>
                        <FormattedMessage id="ui-inventory.settings.numberGeneratorOptions.useTextFieldForCallNumber" />
                      </div>
                    }
                    name="callNumberGeneratorSettingHoldings"
                    type="radio"
                    value="useTextField"
                  />
                  <Field
                    component={RadioButton}
                    id="useBothCallNumberHoldings"
                    label={<FormattedMessage id="ui-inventory.settings.numberGeneratorOptions.useBothForCallNumber" />}
                    name="callNumberGeneratorSettingHoldings"
                    type="radio"
                    value="useBoth"
                  />
                  <Field
                    component={RadioButton}
                    id="useGeneratorCallNumberHoldings"
                    label={<FormattedMessage id="ui-inventory.settings.numberGeneratorOptions.useGeneratorForCallNumber" />}
                    name="callNumberGeneratorSettingHoldings"
                    type="radio"
                    value="useGenerator"
                  />
                </div>
              </Col>
            </Row>
          </Accordion>
          <Accordion
            label={
              <h3>
                <FormattedMessage id="ui-inventory.items" />
              </h3>
            }
            id="number-generator-options-items"
          >
            <Row>
              <Col xs={12}>
                <div className={css.marginBottomGutter}>
                  <Label>
                    <FormattedMessage id="ui-inventory.barcode" />
                  </Label>
                  <Field
                    component={RadioButton}
                    id="useTextFieldBarcodeIt"
                    label={<FormattedMessage id="ui-inventory.settings.numberGeneratorOptions.useTextFieldForBarcode" />}
                    name="barcodeGeneratorSettingItems"
                    type="radio"
                    value="useTextField"
                  />
                  <Field
                    component={RadioButton}
                    id="useBothBarcodeItems"
                    label={<FormattedMessage id="ui-inventory.settings.numberGeneratorOptions.useBothForBarcode" />}
                    name="barcodeGeneratorSettingItems"
                    type="radio"
                    value="useBoth"
                  />
                  <Field
                    component={RadioButton}
                    id="useGeneratorBarcodeItems"
                    label={<FormattedMessage id="ui-inventory.settings.numberGeneratorOptions.useGeneratorForBarcode" />}
                    name="barcodeGeneratorSettingItems"
                    type="radio"
                    value="useGenerator"
                  />
                </div>
              </Col>
            </Row>
            <Row>
              <Col xs={12}>
                <div className={css.marginBottomGutter}>
                  <Label>
                    <FormattedMessage id="ui-inventory.accessionNumber" />
                  </Label>
                  <Field
                    component={RadioButton}
                    disabled={disableAccessionNumberAndCallNumberOffOptions}
                    id="useTextFieldAccessionNumberItems"
                    label={
                      <div className={disableAccessionNumberAndCallNumberOffOptions ? css.greyLabel : null}>
                        <FormattedMessage id="ui-inventory.settings.numberGeneratorOptions.useTextFieldForAccessionNumber" />
                      </div>
                    }
                    name="accessionNumberGeneratorSettingItems"
                    type="radio"
                    value="useTextField"
                  />
                  <Field
                    component={RadioButton}
                    id="useBothAccessionNumberItems"
                    label={<FormattedMessage id="ui-inventory.settings.numberGeneratorOptions.useBothForAccessionNumber" />}
                    name="accessionNumberGeneratorSettingItems"
                    type="radio"
                    value="useBoth"
                  />
                  <Field
                    component={RadioButton}
                    id="useGeneratorAccessionNumberItems"
                    label={<FormattedMessage id="ui-inventory.settings.numberGeneratorOptions.useGeneratorForAccessionNumber" />}
                    name="accessionNumberGeneratorSettingItems"
                    type="radio"
                    value="useGenerator"
                  />
                </div>
              </Col>
            </Row>
            <Row>
              <Col xs={12}>
                <div className={css.marginBottomGutter}>
                  <Label>
                    <FormattedMessage id="ui-inventory.callNumber" />
                  </Label>
                  <Field
                    className={disableAccessionNumberAndCallNumberOffOptions ? css.greyLabel : null}
                    component={RadioButton}
                    disabled={disableAccessionNumberAndCallNumberOffOptions}
                    id="useTextFieldCallNumberItems"
                    label={
                      <div className={disableAccessionNumberAndCallNumberOffOptions ? css.greyLabel : null}>
                        <FormattedMessage id="ui-inventory.settings.numberGeneratorOptions.useTextFieldForCallNumber" />
                      </div>
                    }
                    name="callNumberGeneratorSettingItems"
                    type="radio"
                    value="useTextField"
                  />
                  <Field
                    component={RadioButton}
                    id="useBothCallNumberItems"
                    label={<FormattedMessage id="ui-inventory.settings.numberGeneratorOptions.useBothForCallNumber" />}
                    name="callNumberGeneratorSettingItems"
                    type="radio"
                    value="useBoth"
                  />
                  <Field
                    component={RadioButton}
                    id="useGeneratorCallNumberItems"
                    label={<FormattedMessage id="ui-inventory.settings.numberGeneratorOptions.useGeneratorForCallNumber" />}
                    name="callNumberGeneratorSettingItems"
                    type="radio"
                    value="useGenerator"
                  />
                </div>
              </Col>
            </Row>
            <Row>
              <Col xs={12}>
                <div className={css.marginBottomGutter}>
                  <Field
                    disabled={disableUseForBothFields}
                    component={Checkbox}
                    label={
                      <>
                        <div className={disableUseForBothFields ? css.greyLabel : null}>
                          <FormattedMessage id="ui-inventory.settings.numberGeneratorOptions.useAccessionNumberForCallNumber" />
                        </div>
                        <InfoPopover
                          content={
                            <Layout className="display-flex flex-direction-column flex-align-items-center flex-wrap--wrap">
                              <Layout className="padding-bottom-gutter display-flex flex-direction-column flex-align-items-center">
                                <FormattedMessage
                                  id="ui-inventory.settings.numberGeneratorOptions.useAccessionNumberForCallNumberInfo"
                                  values={{
                                    linebreak: <br />
                                  }}
                                />
                              </Layout>
                            </Layout>
                          }
                          iconSize="medium"
                        />
                      </>
                    }
                    name="useAccessionNumberForCallNumberItems"
                    type="checkbox"
                  />
                  {disableUseForBothFields &&
                    <MessageBanner type="warning">
                      <FormattedMessage id="ui-inventory.settings.numberGeneratorOptions.useAccessionNumberForCallNumberWarning" />
                    </MessageBanner>
                  }
                </div>
              </Col>
            </Row>
          </Accordion>
        </AccordionSet>
      </AccordionStatus>
    </>
  );
};

export default NumberGeneratorOptionsForm;
