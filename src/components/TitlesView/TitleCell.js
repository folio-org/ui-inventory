import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import {
  IconButton,
  NoValue,
  Tooltip,
} from '@folio/stripes/components';
import {
  ADVANCED_SEARCH_INDEX,
  advancedSearchQueryBuilder,
  queryIndexes,
} from '@folio/stripes-inventory-components';

import { getIdentifiersValues } from '../../utils';
import { indentifierTypeNames } from '../../constants';

const TitleCell = ({
  rowData,
  titleKey,
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

  if (!rowData.title) return <NoValue />;

  if (rowData.title && rowData[titleKey]) {
    return (
      <Link
        to={`/inventory/view/${rowData[titleKey]}`}
      >
        {rowData.title}
      </Link>
    );
  }

  return (
    <>
      {rowData.title}
      <Tooltip
        id="searchForTitle"
        text={<FormattedMessage id="ui-inventory.searchForTitle" values={{ title: rowData.title }} />}
      >
        {({ ref, ariaIds }) => (
          <IconButton
            ref={ref}
            icon="search"
            to={createInstanceLink(rowData)}
            target="_blank"
            aria-labelledby={ariaIds.text}
          />
        )}
      </Tooltip>
    </>
  );
};

TitleCell.propTypes = {
  rowData: PropTypes.object.isRequired,
  titleKey: PropTypes.string.isRequired,
  identifierTypesById: PropTypes.object,
};

export default TitleCell;
