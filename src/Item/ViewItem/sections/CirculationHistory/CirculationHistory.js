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
  SERVICE_POINT: 'servicePoint',
};

const VISIBLE_COLUMNS = [
  CIRCULATION_HISTORY_COLUMNS_NAME.DATE,
  CIRCULATION_HISTORY_COLUMNS_NAME.OBJECT,
  CIRCULATION_HISTORY_COLUMNS_NAME.CIRC_ACTION,
  CIRCULATION_HISTORY_COLUMNS_NAME.SOURCE,
  CIRCULATION_HISTORY_COLUMNS_NAME.SERVICE_POINT,
];
const EMPTY_ROW = [{ id: 'empty' }];

const columnWidths = {
  [CIRCULATION_HISTORY_COLUMNS_NAME.DATE]: '20%',
  [CIRCULATION_HISTORY_COLUMNS_NAME.OBJECT]: '20%',
  [CIRCULATION_HISTORY_COLUMNS_NAME.CIRC_ACTION]: '20%',
  [CIRCULATION_HISTORY_COLUMNS_NAME.SOURCE]: '20%',
  [CIRCULATION_HISTORY_COLUMNS_NAME.SERVICE_POINT]: '20%',
};

const columnMapping = {
  [CIRCULATION_HISTORY_COLUMNS_NAME.DATE]: <FormattedMessage id="ui-inventory.date" />,
  [CIRCULATION_HISTORY_COLUMNS_NAME.OBJECT]: <FormattedMessage id="ui-inventory.circulationHistory.object" />,
  [CIRCULATION_HISTORY_COLUMNS_NAME.CIRC_ACTION]: <FormattedMessage id="ui-inventory.circulationHistory.circAction" />,
  [CIRCULATION_HISTORY_COLUMNS_NAME.SOURCE]: <FormattedMessage id="ui-inventory.source" />,
  [CIRCULATION_HISTORY_COLUMNS_NAME.SERVICE_POINT]: <FormattedMessage id="ui-inventory.servicePoint" />,
};

const formatter = {
  [CIRCULATION_HISTORY_COLUMNS_NAME.DATE]: (record) => getDateWithTime(record.occurredDateTime),
  [CIRCULATION_HISTORY_COLUMNS_NAME.OBJECT]: (record) => (record.inHouseUse
    ? <FormattedMessage id="ui-inventory.circulationHistory.object.inHouseUse" />
    : <NoValue />
  ),
  [CIRCULATION_HISTORY_COLUMNS_NAME.CIRC_ACTION]: (record) => {
    if (!record.occurredDateTime) {
      return <NoValue />;
    }

    return record.inHouseUse
      ? <FormattedMessage id="ui-inventory.circulationHistory.circAction.recorded" />
      : <FormattedMessage id="ui-inventory.circulationHistory.circAction.checkedIn" />;
  },
  [CIRCULATION_HISTORY_COLUMNS_NAME.SOURCE]: (record) => {
    const personal = record.staffMember?.personal;

    if (!personal) {
      return <NoValue />;
    }

    return `${personal.lastName}, ${personal.firstName}`;
  },
  [CIRCULATION_HISTORY_COLUMNS_NAME.SERVICE_POINT]: (record) => record.servicePoint?.name || <NoValue />,
};

const CirculationHistory = ({ itemId }) => {
  const {
    checkIns,
    totalRecords,
    isFetching,
    setOffset,
    limit,
  } = useItemCheckInsQuery(itemId);

  const handleNeedMoreData = (_askAmount, index) => {
    setOffset(index);
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
        onNeedMoreData={handleNeedMoreData}
      />
    </Accordion>
  );
};

CirculationHistory.propTypes = {
  itemId: PropTypes.string.isRequired,
};

export default CirculationHistory;
