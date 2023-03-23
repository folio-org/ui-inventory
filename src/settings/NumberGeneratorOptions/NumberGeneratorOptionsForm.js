import { FormattedMessage } from 'react-intl';
import { Field, useFormState } from 'react-final-form';

import { Checkbox, Col, InfoPopover, Label, MessageBanner, RadioButton, Row } from '@folio/stripes/components';
import css from './NumberGeneratorOptions.css';

const NumberGeneratorOptionsForm = () => {
  const { values } = useFormState();
  const disableUseForBothFields =
    (values?.accessionNumberGeneratorSetting ?? 'useTextField') === 'useTextField' ||
    (values?.callNumberGeneratorSetting ?? 'useTextField') === 'useTextField';

  const disableAccessionNumberAndCallNumberOffOptions = !!values?.useAccessionNumberForCallNumber;

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
      <Row>
        <Col xs={12}>
          <div className={css.marginBottomGutter}>
            <Label>
              <FormattedMessage id="ui-inventory.barcode" />
            </Label>
            <Field
              component={RadioButton}
              id="useTextFieldBarcode"
              label={<FormattedMessage id="ui-inventory.settings.numberGeneratorOptions.useTextFieldForBarcode" />}
              name="barcodeGeneratorSetting"
              type="radio"
              value="useTextField"
            />
            <Field
              component={RadioButton}
              id="useBothBarcode"
              label={<FormattedMessage id="ui-inventory.settings.numberGeneratorOptions.useBothForBarcode" />}
              name="barcodeGeneratorSetting"
              type="radio"
              value="useBoth"
            />
            <Field
              component={RadioButton}
              id="useGeneratorBarcode"
              label={<FormattedMessage id="ui-inventory.settings.numberGeneratorOptions.useGeneratorForBarcode" />}
              name="barcodeGeneratorSetting"
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
              id="useTextFieldAccessionNumber"
              label={<FormattedMessage id="ui-inventory.settings.numberGeneratorOptions.useTextFieldForAccessionNumber" />}
              name="accessionNumberGeneratorSetting"
              type="radio"
              value="useTextField"
            />
            <Field
              component={RadioButton}
              id="useBothAccessionNumber"
              label={<FormattedMessage id="ui-inventory.settings.numberGeneratorOptions.useBothForAccessionNumber" />}
              name="accessionNumberGeneratorSetting"
              type="radio"
              value="useBoth"
            />
            <Field
              component={RadioButton}
              id="useGeneratorAccessionNumber"
              label={<FormattedMessage id="ui-inventory.settings.numberGeneratorOptions.useGeneratorForAccessionNumber" />}
              name="accessionNumberGeneratorSetting"
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
              component={RadioButton}
              disabled={disableAccessionNumberAndCallNumberOffOptions}
              id="useTextFieldCallNumber"
              label={<FormattedMessage id="ui-inventory.settings.numberGeneratorOptions.useTextFieldForCallNumber" />}
              name="callNumberGeneratorSetting"
              type="radio"
              value="useTextField"
            />
            <Field
              component={RadioButton}
              id="useBothCallNumber"
              label={<FormattedMessage id="ui-inventory.settings.numberGeneratorOptions.useBothForCallNumber" />}
              name="callNumberGeneratorSetting"
              type="radio"
              value="useBoth"
            />
            <Field
              component={RadioButton}
              id="useGeneratorCallNumber"
              label={<FormattedMessage id="ui-inventory.settings.numberGeneratorOptions.useGeneratorForCallNumber" />}
              name="callNumberGeneratorSetting"
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
                      <FormattedMessage
                        id="ui-inventory.settings.numberGeneratorOptions.useAccessionNumberForCallNumberInfo"
                        values={{
                          linebreak: <br />
                        }}
                      />
                    }
                    iconSize="medium"
                  />
                </>
              }
              name="useAccessionNumberForCallNumber"
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
    </>
  );
};

export default NumberGeneratorOptionsForm;
