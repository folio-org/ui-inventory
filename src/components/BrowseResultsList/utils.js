import {
  browseModeOptions,
  FACETS,
  queryIndexes,
} from '../../constants';

export const isRowPreventsClick = (row, browseOption) => {
  const isMissedMatchItemRow = !!row.isAnchor && row.totalRecords === 0;

  return isMissedMatchItemRow || (
    (browseOption === browseModeOptions.CALL_NUMBERS && !row.shelfKey) ||
    (browseOption === browseModeOptions.CONTRIBUTORS && !row.contributorNameTypeId) ||
    (browseOption === browseModeOptions.SUBJECTS && !row.totalRecords)
  );
};

export const getSearchParams = (row, qindex) => {
  const optionsMap = {
    [browseModeOptions.CALL_NUMBERS]: {
      qindex: queryIndexes.CALL_NUMBER,
      query: row.shelfKey,
    },
    [browseModeOptions.DEWEY]: {
      qindex: queryIndexes.CALL_NUMBER,
      query: row.shelfKey,
    },
    [browseModeOptions.LIBRARY_OF_CONGRESS]: {
      qindex: queryIndexes.CALL_NUMBER,
      query: row.shelfKey,
    },
    [browseModeOptions.LOCAL]: {
      qindex: queryIndexes.CALL_NUMBER,
      query: row.shelfKey,
    },
    [browseModeOptions.NATIONAL_LIBRARY_OF_MEDICINE]: {
      qindex: queryIndexes.CALL_NUMBER,
      query: row.shelfKey,
    },
    [browseModeOptions.OTHER]: {
      qindex: queryIndexes.CALL_NUMBER,
      query: row.shelfKey,
    },
    [browseModeOptions.SUPERINTENDENT]: {
      qindex: queryIndexes.CALL_NUMBER,
      query: row.shelfKey,
    },
    [browseModeOptions.CONTRIBUTORS]: {
      qindex: queryIndexes.CONTRIBUTOR,
      query: row.name,
      filters: `${FACETS.SEARCH_CONTRIBUTORS}.${row.contributorNameTypeId}`,
    },
    [browseModeOptions.SUBJECTS]: {
      qindex: queryIndexes.SUBJECT,
      query: row.value,
      ...(row.authorityId && { filters: `${FACETS.AUTHORITY_ID}.${row.authorityId}` }),
    },
  };

  return optionsMap[qindex];
};
