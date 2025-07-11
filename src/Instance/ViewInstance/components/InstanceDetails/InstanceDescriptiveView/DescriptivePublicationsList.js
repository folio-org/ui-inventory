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

const visibleColumns = ['publisher', 'role', 'place', 'date'];
const getColumnMapping = intl => ({
  publisher: intl.formatMessage({ id: 'ui-inventory.publisher' }),
  role: intl.formatMessage({ id: 'ui-inventory.publisherRole' }),
  place: intl.formatMessage({ id: 'ui-inventory.placeOfPublication' }),
  date: intl.formatMessage({ id: 'ui-inventory.dateOfPublication' }),
});
const formatter = {
  publisher: item => item.publisher || noValue,
  role: item => item.role || noValue,
  place: item => item.place || noValue,
  date: item => item.dateOfPublication || noValue,
};
const columnWidths = {
  publisher: '25%',
  role: '25%',
  place: '25%',
  date: '25%',
};

const DescriptivePublicationsList = ({
  publications = [],
}) => {
  const intl = useIntl();

  const columnMapping = useMemo(() => getColumnMapping(intl), []);
  const contentData = useMemo(() => checkIfArrayIsEmpty(publications), [publications]);

  return (
    <MultiColumnList
      id="list-publication"
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

DescriptivePublicationsList.propTypes = {
  publications: PropTypes.arrayOf(PropTypes.object),
};

export default DescriptivePublicationsList;
