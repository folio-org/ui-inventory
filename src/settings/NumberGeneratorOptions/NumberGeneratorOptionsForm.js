import { FormattedMessage } from 'react-intl';
import { Field, useFormState } from 'react-final-form';

import { Col, Label, MessageBanner, RadioButton, Row } from '@folio/stripes/components';
import css from './NumberGeneratorOptions.css';

const NumberGeneratorOptionsForm = () => {
  const { values } = useFormState();
  const disableUseForBothFields = values?.accessionNumberGeneratorSetting === 'useTextField';
  const disableCallNumberFields = !disableUseForBothFields && values?.useAccessionNumberForCallNumber === 'yes';

  return (
    <>
      <Row>
        <Col xs={12}>
          <div className={css.marginBottomGutter}>
            <Label>
              <FormattedMessage id="ui-inventory.barcode" />
            </Label>
            <Field
              component={RadioButton}
              id="useGeneratorBarcode"
              label={<FormattedMessage id="ui-inventory.settings.numberGeneratorOptions.useGeneratorForBarcode" />}
              name="barcodeGeneratorSetting"
              type="radio"
              value="useGenerator"
            />
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
              id="useGeneratorAccessionNumber"
              label={<FormattedMessage id="ui-inventory.settings.numberGeneratorOptions.useGeneratorForAccessionNumber" />}
              name="accessionNumberGeneratorSetting"
              type="radio"
              value="useGenerator"
            />
            <Field
              component={RadioButton}
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
          </div>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <div className={css.marginBottomGutter}>
            {disableUseForBothFields &&
              <MessageBanner type="warning">
                <FormattedMessage id="ui-inventory.settings.numberGeneratorOptions.useAccessionNumberForCallNumberWarning" />
              </MessageBanner>
            }
            <Label>
              <FormattedMessage id="ui-inventory.settings.numberGeneratorOptions.useAccessionNumberForCallNumber" />
            </Label>
            <Field
              component={RadioButton}
              disabled={disableUseForBothFields}
              id="yesUseAccessionForCallNumber"
              inline
              label={<FormattedMessage id="ui-inventory.yes" />}
              name="useAccessionNumberForCallNumber"
              type="radio"
              value="yes"
            />
            <Field
              component={RadioButton}
              disabled={disableUseForBothFields}
              id="noUseAccessionForCallNumber"
              inline
              label={<FormattedMessage id="ui-inventory.no" />}
              name="useAccessionNumberForCallNumber"
              type="radio"
              value="no"
            />
          </div>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <div className={css.marginBottomGutter}>
            {disableCallNumberFields &&
              <MessageBanner type="warning">
                <FormattedMessage id="ui-inventory.settings.numberGeneratorOptions.callNumberGeneratorWarning" />
              </MessageBanner>
            }
            <Label>
              <FormattedMessage id="ui-inventory.callNumber" />
            </Label>
            <Field
              component={RadioButton}
              disabled={disableCallNumberFields}
              id="useGeneratorCallNumber"
              label={<FormattedMessage id="ui-inventory.settings.numberGeneratorOptions.useGeneratorForCallNumber" />}
              name="callNumberGeneratorSetting"
              type="radio"
              value="useGenerator"
            />
            <Field
              component={RadioButton}
              disabled={disableCallNumberFields}
              id="useTextFieldCallNumber"
              label={<FormattedMessage id="ui-inventory.settings.numberGeneratorOptions.useTextFieldForCallNumber" />}
              name="callNumberGeneratorSetting"
              type="radio"
              value="useTextField"
            />
            <Field
              component={RadioButton}
              disabled={disableCallNumberFields}
              id="useBothCallNumber"
              label={<FormattedMessage id="ui-inventory.settings.numberGeneratorOptions.useBothForCallNumber" />}
              name="callNumberGeneratorSetting"
              type="radio"
              value="useBoth"
            />
          </div>
        </Col>
      </Row>
    </>
  );
};

export default NumberGeneratorOptionsForm;
