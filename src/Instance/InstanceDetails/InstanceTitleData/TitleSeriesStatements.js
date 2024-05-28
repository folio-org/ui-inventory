import React, {
  useMemo,
} from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import { MultiColumnList } from '@folio/stripes/components';
import { segments } from '@folio/stripes-inventory-components';

import { ControllableDetail } from '../ControllableDetail';


const visibleColumns = ['statement'];
const getColumnMapping = intl => ({
  statement: intl.formatMessage({ id: 'ui-inventory.seriesStatement' }),
});

const TitleSeriesStatements = ({
  seriesStatements,
  segment,
  source,
}) => {
  const intl = useIntl();

  const columnMapping = useMemo(() => getColumnMapping(intl), []);

  const formatter = {
    statement: item => (
      <ControllableDetail
        authorityId={item.authorityId}
        value={item.value}
        segment={segment}
        source={source}
      />
    ),
  };

  return (
    <MultiColumnList
      id="list-series-statement"
      contentData={seriesStatements}
      visibleColumns={visibleColumns}
      columnMapping={columnMapping}
      formatter={formatter}
      ariaLabel={intl.formatMessage({ id: 'ui-inventory.seriesStatement' })}
      interactive={false}
    />
  );
};

TitleSeriesStatements.propTypes = {
  seriesStatements: PropTypes.arrayOf(PropTypes.string),
  segment: PropTypes.oneOf(Object.values(segments)).isRequired,
  source: PropTypes.string.isRequired,
};

TitleSeriesStatements.defaultProps = {
  seriesStatements: [],
};

export default TitleSeriesStatements;
