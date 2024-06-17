import { FormattedMessage } from 'react-intl';

import { FolioFormattedDate } from '@folio/stripes-acq-components';
import {
  Button,
  Icon,
  NoValue,
  TextLink,
} from '@folio/stripes/components';

export const PIECE_COLUMNS = {
  displaySummary: 'displaySummary',
  chronology: 'chronology',
  copyNumber: 'copyNumber',
  enumeration: 'enumeration',
  receiptDate: 'receiptDate',
  barcode: 'barcode',
  remove: 'remove',
};

export const PIECE_COLUMN_MAPPING = {
  [PIECE_COLUMNS.barcode]: <FormattedMessage id="ui-receiving.piece.barcode" />,
  [PIECE_COLUMNS.displaySummary]: <FormattedMessage id="ui-receiving.piece.displaySummary" />,
  [PIECE_COLUMNS.chronology]: <FormattedMessage id="ui-receiving.piece.chronology" />,
  [PIECE_COLUMNS.copyNumber]: <FormattedMessage id="ui-receiving.piece.copyNumber" />,
  [PIECE_COLUMNS.enumeration]: <FormattedMessage id="ui-receiving.piece.enumeration" />,
  [PIECE_COLUMNS.receiptDate]: <FormattedMessage id="ui-receiving.piece.receiptDate" />,
  [PIECE_COLUMNS.remove]: '',
};

export const VISIBLE_COLUMNS = [
  PIECE_COLUMNS.barcode,
  PIECE_COLUMNS.displaySummary,
  PIECE_COLUMNS.chronology,
  PIECE_COLUMNS.copyNumber,
  PIECE_COLUMNS.enumeration,
  PIECE_COLUMNS.receiptDate,
  PIECE_COLUMNS.remove,
];

export const COLUMN_FORMATTER = ({ hasViewReceivingPermissions, onRemove }) => {
  return ({
    [PIECE_COLUMNS.barcode]: record => {
      const { barcode, titleId } = record;

      if (!barcode) return <NoValue />;

      if (!hasViewReceivingPermissions) return barcode;

      if (titleId) {
        return <TextLink target="_blank" to={`/receiving/${titleId}/view`}>{barcode}</TextLink>;
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
