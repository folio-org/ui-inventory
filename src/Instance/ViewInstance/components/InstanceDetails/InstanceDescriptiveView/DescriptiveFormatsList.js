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
} from '../../../../../utils';

const noValue = <NoValue />;

const visibleColumns = ['category', 'term', 'code', 'source'];
const getColumnMapping = intl => ({
  category: intl.formatMessage({ id: 'ui-inventory.formatCategory' }),
  term: intl.formatMessage({ id: 'ui-inventory.formatTerm' }),
  code: intl.formatMessage({ id: 'ui-inventory.formatCode' }),
  source: intl.formatMessage({ id: 'ui-inventory.formatSource' }),
});
const formatter = {
  category: item => item.category || noValue,
  term: item => item.term || noValue,
  code: item => item.code || noValue,
  source: item => item.source || noValue,
};
const columnWidths = {
  category: '25%',
  term: '25%',
  code: '25%',
  source: '25%',
};

const DescriptiveFormatsList = ({
  formats = [],
  resourceFormats = [],
}) => {
  const intl = useIntl();

  const columnMapping = useMemo(() => getColumnMapping(intl), []);
  const contentData = useMemo(() => {
    const resourceFormatsMap = resourceFormats.reduce((acc, format) => {
      const [category, term] = (format.name || '').split('--');

      acc[format.id] = {
        ...format,
        category,
        term,
      };

      return acc;
    }, {});

    return checkIfArrayIsEmpty(
      formats.map(formatId => resourceFormatsMap[formatId])
    );
  }, [formats, resourceFormats]);

  return (
    <MultiColumnList
      id="list-formats"
      contentData={contentData}
      visibleColumns={visibleColumns}
      columnMapping={columnMapping}
      columnWidths={columnWidths}
      formatter={formatter}
      ariaLabel={intl.formatMessage({ id: 'ui-inventory.formats' })}
      interactive={false}
    />
  );
};

DescriptiveFormatsList.propTypes = {
  formats: PropTypes.arrayOf(PropTypes.string),
  resourceFormats: PropTypes.arrayOf(PropTypes.object),
};

export default DescriptiveFormatsList;
