import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import {
  MultiColumnList,
  KeyValue,
  IconButton,
  Tooltip,
} from '@folio/stripes/components';
import {
  queryIndexes,
  ADVANCED_SEARCH_INDEX,
  advancedSearchQueryBuilder,
} from '@folio/stripes-inventory-components';

import {
  getIdentifiers,
  getIdentifiersValues,
} from '../../utils';
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
  const createInstanceLink = (row) => {
    const identifiersValues = getIdentifiersValues(row.identifiers, [ISBN, ISSN], identifierTypesById);
    const isbn = identifiersValues?.[ISBN];
    const issn = identifiersValues?.[ISSN];

    const advancedSearchRows = [
      {
        bool: '',
        match: 'exactPhrase',
        searchOption: queryIndexes.TITLE,
        query: row.title,
      },
      ...(isbn ? [{
        bool: 'and',
        match: 'containsAll',
        searchOption: queryIndexes.ISBN,
        query: isbn,
      }] : []),
      ...(issn ? [{
        bool: 'and',
        match: 'containsAll',
        searchOption: queryIndexes.ISSN,
        query: issn,
      }] : [])
    ];

    const builtQuery = advancedSearchQueryBuilder(advancedSearchRows);

    const searchParams = new URLSearchParams({
      qindex: ADVANCED_SEARCH_INDEX,
      query: builtQuery,
    });

    return `/inventory?${searchParams.toString()}`;
  };

  const formatter = {
    title: row => (row[titleKey]
      ?
        <Link
          to={`/inventory/view/${row[titleKey]}`}
        >
          {row.title}
        </Link>
      : row.title
        ?
          <>
            {row.title}
            <Tooltip
              id="searchForTitle"
              text={<FormattedMessage id="ui-inventory.searchForTitle" values={{ title: row.title }} />}
            >
              {({ ref, ariaIds }) => (
                <IconButton
                  ref={ref}
                  icon="search"
                  to={createInstanceLink(row)}
                  target="_blank"
                  aria-labelledby={ariaIds.text}
                />
              )}
            </Tooltip>
          </>
        : '-'
    ),
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
        columnIdPrefix={id}
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
  identifierTypesById: PropTypes.object,
};

export default TitlesViews;
