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
    [browseModeOptions.CONTRIBUTORS]: {
      qindex: queryIndexes.CONTRIBUTOR,
      query: row.name,
      filters: `${FACETS.SEARCH_CONTRIBUTORS}.${row.contributorNameTypeId}`,
    },
    [browseModeOptions.SUBJECTS]: {
      qindex: queryIndexes.SUBJECT,
      query: row.value,
    },
  };

  return optionsMap[qindex];
};
