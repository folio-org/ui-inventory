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

const visibleColumns = ['statement'];
const getColumnMapping = intl => ({
  statement: intl.formatMessage({ id: 'ui-inventory.seriesStatement' }),
});
const formatter = {
  statement: item => item.statement || noValue,
};

const TitleSeriesStatements = ({
  seriesStatements,
}) => {
  const intl = useIntl();

  const columnMapping = useMemo(() => getColumnMapping(intl), []);
  const contentData = useMemo(() => {
    return checkIfArrayIsEmpty(seriesStatements.map(statement => ({ statement })));
  }, [seriesStatements]);

  return (
    <MultiColumnList
      id="list-series-statement"
      contentData={contentData}
      visibleColumns={visibleColumns}
      columnMapping={columnMapping}
      formatter={formatter}
      ariaLabel={intl.formatMessage({ id: 'ui-inventory.seriesStatement' })}
      interactive={false}
    />
  );
};

TitleSeriesStatements.propTypes = {
  seriesStatements: PropTypes.arrayOf(PropTypes.object),
};

TitleSeriesStatements.defaultProps = {
  seriesStatements: [],
};

export default TitleSeriesStatements;
