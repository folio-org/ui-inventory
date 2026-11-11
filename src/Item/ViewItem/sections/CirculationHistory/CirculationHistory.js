import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import {
  Accordion,
  MCLPagingTypes,
  MultiColumnList,
  NoValue,
} from '@folio/stripes/components';

import useItemCheckInsQuery from '../../../hooks/useItemCheckInsQuery';
import { getDateWithTime } from '../../../../utils';

export const CIRCULATION_HISTORY_COLUMNS_NAME = {
  DATE: 'date',
  OBJECT: 'object',
  CIRC_ACTION: 'circAction',
  SOURCE: 'source',
  SERVICE_POINT_NAME: 'servicePointName',
};

const VISIBLE_COLUMNS = [
  CIRCULATION_HISTORY_COLUMNS_NAME.DATE,
  CIRCULATION_HISTORY_COLUMNS_NAME.OBJECT,
  CIRCULATION_HISTORY_COLUMNS_NAME.CIRC_ACTION,
  CIRCULATION_HISTORY_COLUMNS_NAME.SOURCE,
  CIRCULATION_HISTORY_COLUMNS_NAME.SERVICE_POINT_NAME,
];
const EMPTY_ROW = [{ id: 'empty' }];

const columnWidths = {
  [CIRCULATION_HISTORY_COLUMNS_NAME.DATE]: '20%',
  [CIRCULATION_HISTORY_COLUMNS_NAME.OBJECT]: '20%',
  [CIRCULATION_HISTORY_COLUMNS_NAME.CIRC_ACTION]: '20%',
  [CIRCULATION_HISTORY_COLUMNS_NAME.SOURCE]: '20%',
  [CIRCULATION_HISTORY_COLUMNS_NAME.SERVICE_POINT_NAME]: '20%',
};

const columnMapping = {
  [CIRCULATION_HISTORY_COLUMNS_NAME.DATE]: <FormattedMessage id="ui-inventory.date" />,
  [CIRCULATION_HISTORY_COLUMNS_NAME.OBJECT]: <FormattedMessage id="ui-inventory.circulationHistory.object" />,
  [CIRCULATION_HISTORY_COLUMNS_NAME.CIRC_ACTION]: <FormattedMessage id="ui-inventory.circulationHistory.circAction" />,
  [CIRCULATION_HISTORY_COLUMNS_NAME.SOURCE]: <FormattedMessage id="ui-inventory.source" />,
  [CIRCULATION_HISTORY_COLUMNS_NAME.SERVICE_POINT_NAME]: <FormattedMessage id="ui-inventory.servicePoint" />,
};

const formatter = {
  [CIRCULATION_HISTORY_COLUMNS_NAME.DATE]: (record) => getDateWithTime(record.occurredDateTime),
  [CIRCULATION_HISTORY_COLUMNS_NAME.OBJECT]: (record) => record.object || <NoValue />,
  [CIRCULATION_HISTORY_COLUMNS_NAME.CIRC_ACTION]: (record) => record.action || <NoValue />,
  [CIRCULATION_HISTORY_COLUMNS_NAME.SOURCE]: (record) => record.source || <NoValue />,
  [CIRCULATION_HISTORY_COLUMNS_NAME.SERVICE_POINT_NAME]: (record) => record.servicePointName || <NoValue />,
};

const CirculationHistory = ({ itemId }) => {
  const {
    checkIns,
    totalRecords,
    isFetching,
    offset,
    setOffset,
    limit,
  } = useItemCheckInsQuery(itemId);

  const pagingCanGoPrevious = offset > 0;
  const pagingCanGoNext = totalRecords - offset > limit;

  const handleNeedMoreData = (askAmount, _index, _firstIndex, direction) => {
    const amount = (direction === 'next') ? askAmount : -askAmount;
    setOffset(offset + amount);
  };

  const contentData = (!isFetching && checkIns.length === 0) ? EMPTY_ROW : checkIns;

  return (
    <Accordion
      id="acc09"
      label={<FormattedMessage id="ui-inventory.circulationHistory" />}
    >
      <MultiColumnList
        id="circulation-history-list"
        contentData={contentData}
        columnWidths={columnWidths}
        totalCount={totalRecords}
        visibleColumns={VISIBLE_COLUMNS}
        columnMapping={columnMapping}
        formatter={formatter}
        interactive={false}
        loading={isFetching}
        pagingType={MCLPagingTypes.PREV_NEXT}
        pageAmount={limit}
        pagingOffset={offset}
        pagingCanGoPrevious={pagingCanGoPrevious}
        pagingCanGoNext={pagingCanGoNext}
        onNeedMoreData={handleNeedMoreData}
      />
    </Accordion>
  );
};

CirculationHistory.propTypes = {
  itemId: PropTypes.string.isRequired,
};

export default CirculationHistory;
