import { FormattedMessage } from 'react-intl';
import { Layout } from '@folio/stripes-components';
import { NumberGeneratorModalButton } from '@folio/service-interaction';

// Moving this to a separate utility method so we can declutter this work
// Since ItemForm is not a functional component, we must pass in configs and change here.
// If ItemForm was to become functional, this could be rewritten as a hook, and utilise
// `useForm` and `useConfigurationQuery` to get these parameters.
const getNumberGeneratorModals = (configs, change) => {
  const {
    accessionNumberGeneratorSettingItems,
    barcodeGeneratorSettingItems,
    callNumberGeneratorSettingItems,
    useAccessionNumberForCallNumberItems
  } = configs;

  const accessionNumberGeneratorActive = accessionNumberGeneratorSettingItems === 'useGenerator' ||
  accessionNumberGeneratorSettingItems === 'useBoth';

  const barcodeGeneratorActive = barcodeGeneratorSettingItems === 'useGenerator' ||
  barcodeGeneratorSettingItems === 'useBoth';

  const callNumberGeneratorActive = callNumberGeneratorSettingItems === 'useGenerator' ||
  callNumberGeneratorSettingItems === 'useBoth';

  const disableAccessionNumberField = accessionNumberGeneratorSettingItems === 'useGenerator';
  const disableBarcodeField = barcodeGeneratorSettingItems === 'useGenerator';
  const disableCallNumberField = callNumberGeneratorSettingItems === 'useGenerator';

  // This is to ensure that if the field somehow _did_ get set when it's not supposed to, we ignore it
  const useJointModal = useAccessionNumberForCallNumberItems && accessionNumberGeneratorActive && callNumberGeneratorActive;

  // Don't worry about calling logic in here, do that in renderAccession... and renderCall...
  const renderJointNumberGenerator = () => (
    <NumberGeneratorModalButton
      buttonLabel={
        <span style={{ whiteSpace: 'normal' }}>
          <FormattedMessage id="ui-inventory.numberGenerator.generateAccessionAndCallNumber" />
        </span>
      }
      callback={(generated) => {
        change('accessionNumber', generated);
        change('itemLevelCallNumber', generated);
      }}
      generateButtonLabel={<FormattedMessage id="ui-inventory.numberGenerator.generateAccessionAndCallNumber" />}
      generator="inventory_accessionNumber"
      id="inventoryAccessionNumberAndCallNumber"
      modalProps={{
        label: <FormattedMessage id="ui-inventory.numberGenerator.accessionAndCallNumberGenerator" />
      }}
      renderTop={() => (
        <Layout className="padding-bottom-gutter">
          <FormattedMessage id="ui-inventory.numberGenerator.generateAccessionAndCallNumberWarning" />
        </Layout>
      )}
    />
  );

  const renderAccessionNumberGenerator = () => {
    if (useJointModal) {
      return renderJointNumberGenerator();
    } else if (accessionNumberGeneratorActive) {
      return (
        <NumberGeneratorModalButton
          buttonLabel={<FormattedMessage id="ui-inventory.numberGenerator.generateAccessionNumber" />}
          callback={(generated) => change('accessionNumber', generated)}
          generateButtonLabel={<FormattedMessage id="ui-inventory.numberGenerator.generateAccessionNumber" />}
          generator="inventory_accessionNumber"
          id="inventoryAccessionNumber"
          modalProps={{
            label: <FormattedMessage id="ui-inventory.numberGenerator.accessionNumberGenerator" />
          }}
        />
      );
    }

    return null;
  };

  const renderCallNumberGenerator = () => {
    if (useJointModal) {
      return renderJointNumberGenerator();
    } else if (callNumberGeneratorActive) {
      return (
        <NumberGeneratorModalButton
          buttonLabel={<FormattedMessage id="ui-inventory.numberGenerator.generateCallNumber" />}
          callback={(generated) => change('itemLevelCallNumber', generated)}
          generateButtonLabel={<FormattedMessage id="ui-inventory.numberGenerator.generateCallNumber" />}
          generator="inventory_callNumber"
          id="inventoryCallNumber"
          modalProps={{
            label: <FormattedMessage id="ui-inventory.numberGenerator.callNumberGenerator" />
          }}
        />
      );
    }

    return null;
  };

  const renderBarcodeGenerator = () => {
    if (barcodeGeneratorActive) {
      return (
        <NumberGeneratorModalButton
          buttonLabel={
            <FormattedMessage id="ui-inventory.numberGenerator.generateItemBarcode" />
          }
          callback={(generated) => change('barcode', generated)}
          generateButtonLabel={<FormattedMessage id="ui-inventory.numberGenerator.generateItemBarcode" />}
          generator="inventory_itemBarcode"
          id="inventorybarcode"
          modalProps={{
            label: <FormattedMessage id="ui-inventory.numberGenerator.itemBarcodeGenerator" />
          }}
        />
      );
    }
    return null;
  };

  return {
    disableAccessionNumberField,
    disableBarcodeField,
    disableCallNumberField,
    renderAccessionNumberGenerator,
    renderCallNumberGenerator,
    renderBarcodeGenerator
  };
};

export default getNumberGeneratorModals;
