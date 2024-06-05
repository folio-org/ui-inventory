import React, {
  useCallback,
  useMemo,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { orderBy } from 'lodash';

import {
  Checkbox,
  FormattedDate,
  MultiColumnList,
  NoValue,
} from '@folio/stripes/components';

import { RECEIVING_HISTORY_COLUMN_NAMES } from './constants';
import { SORT_DIRECTION } from '../../../constants';

const { ASCENDING, DESCENDING } = SORT_DIRECTION;

const columnMapping = {
  [RECEIVING_HISTORY_COLUMN_NAMES.displaySummary]: <FormattedMessage id="ui-inventory.displaySummary" />,
  [RECEIVING_HISTORY_COLUMN_NAMES.copyNumber]: <FormattedMessage id="ui-inventory.copyNumber" />,
  [RECEIVING_HISTORY_COLUMN_NAMES.enumeration]: <FormattedMessage id="ui-inventory.enumeration" />,
  [RECEIVING_HISTORY_COLUMN_NAMES.chronology]: <FormattedMessage id="ui-inventory.chronology" />,
  [RECEIVING_HISTORY_COLUMN_NAMES.receivedDate]: <FormattedMessage id="ui-inventory.receivingHistory.receivedDate" />,
  [RECEIVING_HISTORY_COLUMN_NAMES.comment]: <FormattedMessage id="ui-inventory.receivingHistory.comment" />,
  [RECEIVING_HISTORY_COLUMN_NAMES.displayToPublic]: <FormattedMessage id="ui-inventory.receivingHistory.displayToPublic" />,
  [RECEIVING_HISTORY_COLUMN_NAMES.source]: <FormattedMessage id="ui-inventory.receivingHistory.source" />,
};
const visibleColumns = [
  RECEIVING_HISTORY_COLUMN_NAMES.displaySummary,
  RECEIVING_HISTORY_COLUMN_NAMES.copyNumber,
  RECEIVING_HISTORY_COLUMN_NAMES.enumeration,
  RECEIVING_HISTORY_COLUMN_NAMES.chronology,
  RECEIVING_HISTORY_COLUMN_NAMES.receivedDate,
  RECEIVING_HISTORY_COLUMN_NAMES.comment,
  RECEIVING_HISTORY_COLUMN_NAMES.displayToPublic,
  RECEIVING_HISTORY_COLUMN_NAMES.source,
];
const columnFormatter = {
  [RECEIVING_HISTORY_COLUMN_NAMES.displaySummary]: i => i.displaySummary || <NoValue />,
  [RECEIVING_HISTORY_COLUMN_NAMES.copyNumber]: i => i.copyNumber || <NoValue />,
  [RECEIVING_HISTORY_COLUMN_NAMES.enumeration]: i => i.enumeration || <NoValue />,
  [RECEIVING_HISTORY_COLUMN_NAMES.chronology]: i => i.chronology || <NoValue />,
  [RECEIVING_HISTORY_COLUMN_NAMES.receivedDate]: i => (i.receivedDate ? <FormattedDate value={i.receivedDate} /> : <NoValue />),
  [RECEIVING_HISTORY_COLUMN_NAMES.comment]: i => i.comment || <NoValue />,
  [RECEIVING_HISTORY_COLUMN_NAMES.displayToPublic]: i => <Checkbox checked={i.displayToPublic || i.publicDisplay} disabled />,
  [RECEIVING_HISTORY_COLUMN_NAMES.source]: i => <FormattedMessage id={`ui-inventory.receivingHistory.source.${i.source || 'user'}`} />,
};
const sorters = {
  [RECEIVING_HISTORY_COLUMN_NAMES.displaySummary]: ({ displaySummary }) => displaySummary,
  [RECEIVING_HISTORY_COLUMN_NAMES.copyNumber]: ({ copyNumber }) => copyNumber,
  [RECEIVING_HISTORY_COLUMN_NAMES.chronology]: ({ chronology }) => chronology,
  [RECEIVING_HISTORY_COLUMN_NAMES.enumeration]: ({ enumeration }) => enumeration,
  [RECEIVING_HISTORY_COLUMN_NAMES.receivedDate]: ({ receivedDate }) => receivedDate,
  [RECEIVING_HISTORY_COLUMN_NAMES.source]: ({ source }) => source,
};

const HoldingReceivingHistoryList = ({
  data,
  isLoading,
  tenantId,
}) => {
  const [sortedColumn, setSortedColumn] = useState('');
  const [sortDirection, setSortDirection] = useState(ASCENDING);

  const receivingHistory = useMemo(() => (
    orderBy(data, sorters[sortedColumn], sortDirection === ASCENDING ? 'asc' : 'desc')
  ), [sortedColumn, sortDirection]);

  const onHeaderClick = useCallback((_e, { name: column }) => {
    if (!sorters[column]) return;

    const isChangeDirection = sortedColumn === column;

    setSortedColumn(isChangeDirection ? sortedColumn : column);
    setSortDirection(
      isChangeDirection && sortDirection === ASCENDING ? DESCENDING : ASCENDING
    );
  }, [sortedColumn, sortDirection]);

  return (
    <MultiColumnList
      id={`${tenantId}-receiving-history-list`}
      loading={isLoading}
      contentData={receivingHistory}
      visibleColumns={visibleColumns}
      columnMapping={columnMapping}
      formatter={columnFormatter}
      sortDirection={sortDirection}
      sortedColumn={sortedColumn}
      onHeaderClick={onHeaderClick}
    />
  );
};

HoldingReceivingHistoryList.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  isLoading: PropTypes.bool.isRequired,
  tenantId: PropTypes.string.isRequired,
};

export default HoldingReceivingHistoryList;
