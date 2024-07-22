import { FormattedMessage } from 'react-intl';

import { FolioFormattedDate } from '@folio/stripes-acq-components';
import {
  Button,
  Icon,
  NoValue,
  TextLink,
} from '@folio/stripes/components';

import { PIECE_COLUMNS } from './constants';

// eslint-disable-next-line import/prefer-default-export
export const getColumnFormatter = ({ hasViewReceivingPermissions, onRemove }) => {
  return ({
    [PIECE_COLUMNS.barcode]: record => {
      const { barcode, titleId } = record;
      const barcodeText = barcode || <FormattedMessage id="ui-inventory.noBarcode" />;

      if (!hasViewReceivingPermissions) return barcodeText;

      if (titleId) {
        return (
          <TextLink
            target="_blank"
            to={`/receiving/${titleId}/view`}
          >
            {barcodeText}
          </TextLink>
        );
      }

      return barcode;
    },
    [PIECE_COLUMNS.displaySummary]: record => record.displaySummary || <NoValue />,
    [PIECE_COLUMNS.chronology]: record => record.chronology || <NoValue />,
    [PIECE_COLUMNS.copyNumber]: record => record.copyNumber || <NoValue />,
    [PIECE_COLUMNS.enumeration]: record => record.enumeration || <NoValue />,
    [PIECE_COLUMNS.receiptDate]: record => <FolioFormattedDate value={record.receiptDate} />,
    [PIECE_COLUMNS.remove]: record => (
      <Button
        buttonStyle="fieldControl"
        align="end"
        type="button"
        id={`clickable-remove-user-${record.id}`}
        onClick={() => onRemove(record)}
      >
        <Icon icon="times-circle" />
      </Button>
    ),
  });
};
