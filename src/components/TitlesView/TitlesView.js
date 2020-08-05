import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import {
  MultiColumnList,
  KeyValue,
} from '@folio/stripes/components';

import { getIdentifiers } from '../../utils';
import { indentifierTypeNames } from '../../constants';

const TitlesViews = ({
  titles,
  id,
  titleKey,
  label,
  identifierTypesById,
}) => {
  const {
    ISSN,
    ISBN,
  } = indentifierTypeNames;
  const formatter = {
    title: row => (row[titleKey] ?
      <Link
        to={`/inventory/view/${row[titleKey]}`}
      >
        {row.title}
      </Link> :
      row.title || '-'),
    hrid: row => row.hrid || '-',
    issn: row => getIdentifiers(row.identifiers, ISSN, identifierTypesById) || '-',
    isbn: row => getIdentifiers(row.identifiers, ISBN, identifierTypesById) || '-',
  };

  const visibleColumns = [
    'title',
    'hrid',
    'isbn',
    'issn',
  ];

  const columnMapping = {
    title: <FormattedMessage id="ui-inventory.instances.columns.title" />,
    hrid: <FormattedMessage id="ui-inventory.instanceHrid" />,
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

TitlesViews.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.node.isRequired,
  titles: PropTypes.arrayOf(PropTypes.object).isRequired,
  titleKey: PropTypes.string.isRequired,
  identifierTypesById: PropTypes.func,
};

export default TitlesViews;
