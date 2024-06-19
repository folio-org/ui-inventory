import { FormattedMessage } from 'react-intl';

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
