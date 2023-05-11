import { FormattedMessage } from 'react-intl';
import { MessageBanner } from '@folio/stripes-components';
import { NumberGeneratorModalButton } from '@folio/service-interaction';

// Moving this to a separate utility method so we can declutter this work
// Since ItemForm is not a functional component, we must pass in configs and change here.
// If ItemForm was to become functional, this could be rewritten as a hook, and utilise
// `useForm` and `useConfigurationQuery` to get these parameters.
const getNumberGeneratorModals = (configs, change) => {
  const {
    accessionNumberGeneratorSetting,
    barcodeGeneratorSetting,
    callNumberGeneratorSetting,
    useAccessionNumberForCallNumber
  } = configs;

  const accessionNumberGeneratorActive = accessionNumberGeneratorSetting === 'useGenerator' ||
                                         accessionNumberGeneratorSetting === 'useBoth';

  const barcodeGeneratorActive = barcodeGeneratorSetting === 'useGenerator' ||
                                 barcodeGeneratorSetting === 'useBoth';

  const callNumberGeneratorActive = callNumberGeneratorSetting === 'useGenerator' ||
                                    callNumberGeneratorSetting === 'useBoth';

  const disableAccessionNumberField = accessionNumberGeneratorSetting === 'useGenerator';
  const disableBarcodeField = barcodeGeneratorSetting === 'useGenerator';
  const disableCallNumberField = callNumberGeneratorSetting === 'useGenerator';

  // This is to ensure that if the field somehow _did_ get set when it's not supposed to, we ignore it
  const useJointModal = useAccessionNumberForCallNumber && accessionNumberGeneratorActive && callNumberGeneratorActive;

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
      fullWidth
      generateButtonLabel={<FormattedMessage id="ui-inventory.numberGenerator.generateAccessionAndCallNumber" />}
      generator="inventory_accessionNumber"
      id="inventoryAccessionNumberAndCallNumber"
      modalProps={{
        label: <FormattedMessage id="ui-inventory.numberGenerator.accessionAndCallNumberGenerator" />
      }}
      renderTop={() => (
        <MessageBanner>
          <FormattedMessage id="ui-inventory.numberGenerator.generateAccessionAndCallNumberWarning" />
        </MessageBanner>
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
          fullWidth
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
          fullWidth
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
          fullWidth
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
