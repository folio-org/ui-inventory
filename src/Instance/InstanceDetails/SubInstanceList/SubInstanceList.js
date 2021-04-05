import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import {
  MultiColumnList,
  KeyValue,
  NoValue,
} from '@folio/stripes/components';

import { getIdentifiers } from '../../../utils';
import { indentifierTypeNames } from '../../../constants';
import useReferenceData from '../../../hooks/useReferenceData';

const noValue = <NoValue />;

const SubInstanceList = ({
  titles,
  id,
  titleKey,
  label,
}) => {
  const {
    ISSN,
    ISBN,
  } = indentifierTypeNames;
  const {
    identifierTypesById,
  } = useReferenceData();

  const formatter = {
    title: row => (row[titleKey] ?
      <Link
        to={`/inventory/view/${row[titleKey]}`}
      >
        {row.title}
      </Link> :
      row.title || noValue),
    hrid: row => row.hrid || noValue,
    publisher: row => row.publication?.[0]?.publisher ?? noValue,
    publisherDate: row => row.publication?.[0]?.dateOfPublication ?? noValue,
    issn: row => getIdentifiers(row.identifiers, ISSN, identifierTypesById) || noValue,
    isbn: row => getIdentifiers(row.identifiers, ISBN, identifierTypesById) || noValue,
  };

  const visibleColumns = [
    'title',
    'hrid',
    'publisher',
    'publisherDate',
    'isbn',
    'issn',
  ];

  const columnMapping = {
    title: <FormattedMessage id="ui-inventory.instances.columns.title" />,
    hrid: <FormattedMessage id="ui-inventory.instanceHrid" />,
    publisher: <FormattedMessage id="ui-inventory.publisher" />,
    publisherDate: <FormattedMessage id="ui-inventory.publisherDate" />,
    issn: <FormattedMessage id="ui-inventory.issn" />,
    isbn: <FormattedMessage id="ui-inventory.isbn" />,
  };

  const columnWidths = {
    title: '40%',
    hrid: '25%',
  };

  return (
    <KeyValue label={label}>
      <MultiColumnList
        id={id}
        contentData={titles}
        visibleColumns={visibleColumns}
        columnMapping={columnMapping}
        columnWidths={columnWidths}
        formatter={formatter}
        ariaLabel={label}
        interactive={false}
      />
    </KeyValue>
  );
};

SubInstanceList.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.node.isRequired,
  titles: PropTypes.arrayOf(PropTypes.object).isRequired,
  titleKey: PropTypes.string.isRequired,
};

export default SubInstanceList;
