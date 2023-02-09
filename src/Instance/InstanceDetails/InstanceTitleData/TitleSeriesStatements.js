import React, {
  useMemo,
} from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import {
  MultiColumnList,
  NoValue,
} from '@folio/stripes/components';

import { MarcAuthorityLink } from '../MarcAuthorityLink';
import { segments } from '../../../constants';

const noValue = <NoValue />;

const visibleColumns = ['statement'];
const getColumnMapping = intl => ({
  statement: intl.formatMessage({ id: 'ui-inventory.seriesStatement' }),
});

const getStatementItem = (item, segment, source) => {
  const _segment = segment ?? segments.instances;

  if (_segment === segments.instances && source === 'MARC' && item.authorityId) {
    return (
      <MarcAuthorityLink authorityId={item.authorityId}>
        {item.value}
      </MarcAuthorityLink>
    );
  }

  return item.value || noValue;
};

const TitleSeriesStatements = ({
  seriesStatements,
  segment,
  source,
}) => {
  const intl = useIntl();

  const columnMapping = useMemo(() => getColumnMapping(intl), []);

  const formatter = {
    statement: item => getStatementItem(item, segment, source),
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
  segment: PropTypes.oneOf([Object.values(segments)]).isRequired,
  source: PropTypes.string.isRequired,
};

TitleSeriesStatements.defaultProps = {
  seriesStatements: [],
};

export default TitleSeriesStatements;
