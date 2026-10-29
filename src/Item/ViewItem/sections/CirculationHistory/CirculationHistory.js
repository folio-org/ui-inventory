import { useMemo } from 'react';
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

const VISIBLE_COLUMNS = ['date', 'object', 'circAction', 'source', 'servicePoint'];
const EMPTY_ROW = [{ id: 'empty' }];

const columnMapping = {
  date: <FormattedMessage id="ui-inventory.date" />,
  object: <FormattedMessage id="ui-inventory.circulationHistory.object" />,
  circAction: <FormattedMessage id="ui-inventory.circulationHistory.circAction" />,
  source: <FormattedMessage id="ui-inventory.source" />,
  servicePoint: <FormattedMessage id="ui-inventory.servicePoint" />,
};

const CirculationHistory = ({ itemId }) => {
  const {
    checkIns,
    totalRecords,
    isFetching,
    setOffset,
    limit,
  } = useItemCheckInsQuery(itemId);

  const formatter = useMemo(() => ({
    date: (record) => getDateWithTime(record.occurredDateTime),
    object: (record) => (record.inHouseUse
      ? <FormattedMessage id="ui-inventory.circulationHistory.object.inHouseUse" />
      : <NoValue />
    ),
    circAction: (record) => {
      if (!record.occurredDateTime) return <NoValue />;
      return record.inHouseUse
        ? <FormattedMessage id="ui-inventory.circulationHistory.circAction.recorded" />
        : <FormattedMessage id="ui-inventory.circulationHistory.circAction.checkedIn" />;
    },
    source: (record) => {
      const personal = record.staffMember?.personal;
      if (!personal) return <NoValue />;
      return `${personal.lastName}, ${personal.firstName}`;
    },
    servicePoint: (record) => record.servicePoint?.name || <NoValue />,
  }), []);

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
