import React, { useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { orderBy } from 'lodash';

import {
  Accordion,
  FormattedDate,
  MultiColumnList,
  NoValue,
} from '@folio/stripes/components';

import { useControlledAccordion } from '../../../common/hooks';
import useReceivingHistory from './useReceivingHistory';
import { SORT_DIRECTION } from '../../../constants';

const { ASCENDING, DESCENDING } = SORT_DIRECTION;

const columnMapping = {
  'caption': <FormattedMessage id="ui-inventory.caption" />,
  'copyNumber': <FormattedMessage id="ui-inventory.copyNumber" />,
  'enumeration': <FormattedMessage id="ui-inventory.enumeration" />,
  'receivedDate': <FormattedMessage id="ui-inventory.receivingHistory.receivedDate" />,
  'comment': <FormattedMessage id="ui-inventory.receivingHistory.comment" />,
  'source': <FormattedMessage id="ui-inventory.receivingHistory.source" />,
};
const visibleColumns = ['caption', 'copyNumber', 'enumeration', 'receivedDate', 'comment', 'source'];
const columnFormatter = {
  'caption': i => i.caption || <NoValue />,
  'copyNumber': i => i.copyNumber || <NoValue />,
  'enumeration': i => i.enumeration || <NoValue />,
  'receivedDate': i => (i.receivedDate ? <FormattedDate value={i.receivedDate} /> : <NoValue />),
  'comment': i => i.comment || <NoValue />,
  'source': i => <FormattedMessage id={`ui-inventory.receivingHistory.source.${i.source || 'user'}`} />,
};
const sorters = {
  'caption': ({ caption }) => caption,
  'copyNumber': ({ copyNumber }) => copyNumber,
  'enumeration': ({ enumeration }) => enumeration,
  'receivedDate': ({ receivedDate }) => receivedDate,
  'source': ({ source }) => source,
};

const HoldingReceivingHistory = ({ holding }) => {
  const [sortedColumn, setSortedColumn] = useState('');
  const [sortDirection, setSortDirection] = useState(ASCENDING);
  const { receivingHistory, isLoading } = useReceivingHistory(holding);
  const controlledAccorion = useControlledAccordion(Boolean(receivingHistory.length));

  const data = useMemo(() => (
    orderBy(receivingHistory, sorters[sortedColumn], sortDirection === ASCENDING ? 'asc' : 'desc')
  ), [receivingHistory, sortedColumn, sortDirection]);

  const onHeaderClick = useCallback((_e, { name: column }) => {
    if (!sorters[column]) return;

    const isChangeDirection = sortedColumn === column;

    setSortedColumn(isChangeDirection ? sortedColumn : column);
    setSortDirection(
      isChangeDirection && sortDirection === ASCENDING ? DESCENDING : ASCENDING
    );
  }, [sortedColumn, sortDirection]);

  if (isLoading) {
    return (
      <Accordion
        id="acc07"
        label={<FormattedMessage id="ui-inventory.receivingHistory" />}
      />
    );
  }

  return (
    <Accordion
      id="acc07"
      label={<FormattedMessage id="ui-inventory.receivingHistory" />}
      {...controlledAccorion}
    >
      <MultiColumnList
        id="receiving-history-list"
        contentData={data}
        visibleColumns={visibleColumns}
        columnMapping={columnMapping}
        formatter={columnFormatter}
        sortDirection={sortDirection}
        sortedColumn={sortedColumn}
        onHeaderClick={onHeaderClick}
      />
    </Accordion>
  );
};

HoldingReceivingHistory.propTypes = {
  holding: PropTypes.object,
};

export default HoldingReceivingHistory;
