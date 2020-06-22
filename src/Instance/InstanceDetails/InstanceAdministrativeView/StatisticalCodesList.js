import React, {
  useMemo,
} from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import {
  MultiColumnList,
  NoValue,
} from '@folio/stripes/components';

import {
  checkIfArrayIsEmpty,
} from '../../../utils';

const noValue = <NoValue />;

const visibleColumns = ['type', 'code', 'name'];
const getColumnMapping = intl => ({
  type: intl.formatMessage({ id: 'ui-inventory.statisticalCodeType' }),
  code: intl.formatMessage({ id: 'ui-inventory.statisticalCode' }),
  name: intl.formatMessage({ id: 'ui-inventory.statisticalCodeName' }),
});
const formatter = {
  type: item => item.type || noValue,
  code: item => item.code || noValue,
  name: item => item.name || noValue,
};
const columnWidths = {
  type: '35%',
  code: '30%',
  name: '35%',
};

const StatisticalCodesList = ({
  statisticalCodes,
}) => {
  const intl = useIntl();

  const columnMapping = useMemo(() => getColumnMapping(intl), []);
  const contentData = useMemo(() => checkIfArrayIsEmpty(statisticalCodes), [statisticalCodes]);

  return (
    <MultiColumnList
      id="list-statistical-codes"
      contentData={contentData}
      visibleColumns={visibleColumns}
      columnMapping={columnMapping}
      columnWidths={columnWidths}
      formatter={formatter}
      ariaLabel={intl.formatMessage({ id: 'ui-inventory.statisticalCodes' })}
      interactive={false}
    />
  );
};

StatisticalCodesList.propTypes = {
  statisticalCodes: PropTypes.arrayOf(PropTypes.object),
};

StatisticalCodesList.defaultProps = {
  statisticalCodes: [],
};

export default StatisticalCodesList;
