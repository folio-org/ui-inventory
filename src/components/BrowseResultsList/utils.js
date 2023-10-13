import omit from 'lodash/omit';

import {
  browseCallNumberOptions,
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

// [true, false] => 'shared.true,shared.false'
const facetsToString = (filters, facetNameInBrowse, facetNameInSearch) => {
  return filters[facetNameInBrowse]?.map(value => `${facetNameInSearch}.${value}`).join(',');
}

const getExtraFilters = (row, qindex, allFilters) => {
  const filtersOnly = omit(allFilters, 'qindex', 'query');
  const extraFacets = [];

  let sharedFacetName;
  let heldByFacetName;

  if (qindex === browseModeOptions.SUBJECTS) {
    sharedFacetName = FACETS.SUBJECTS_SHARED;
    heldByFacetName = FACETS.SUBJECTS_HELD_BY;

    if (row.authorityId) {
      extraFacets.push(`${FACETS.AUTHORITY_ID}.${row.authorityId}`);
    }
  } else if (qindex === browseModeOptions.CONTRIBUTORS) {
    sharedFacetName = FACETS.CONTRIBUTORS_SHARED;
    heldByFacetName = FACETS.CONTRIBUTORS_HELD_BY;

    extraFacets.push(`${FACETS.SEARCH_CONTRIBUTORS}.${row.contributorNameTypeId}`);
  } else if (Object.values(browseCallNumberOptions).includes(qindex)) {
    sharedFacetName = FACETS.SHARED;
    heldByFacetName = FACETS.CALL_NUMBERS_HELD_BY;
  }

  const sharedExtraFacets = facetsToString(filtersOnly, sharedFacetName, FACETS.SHARED);
  const heldByExtraFacets = facetsToString(filtersOnly, heldByFacetName, FACETS.HELD_BY);
  const extraFacetsString = [...extraFacets, sharedExtraFacets, heldByExtraFacets].filter(Boolean).join(',');

  return extraFacetsString ? { filters: extraFacetsString } : {};
}

export const getSearchParams = (row, qindex, allFilters) => {
  const filters = getExtraFilters(row, qindex, allFilters);

  const optionsMap = {
    [browseModeOptions.CALL_NUMBERS]: {
      qindex: queryIndexes.CALL_NUMBER,
      query: row.shelfKey,
      ...filters,
    },
    [browseModeOptions.DEWEY]: {
      qindex: queryIndexes.CALL_NUMBER,
      query: row.shelfKey,
      ...filters,
    },
    [browseModeOptions.LIBRARY_OF_CONGRESS]: {
      qindex: queryIndexes.CALL_NUMBER,
      query: row.shelfKey,
      ...filters,
    },
    [browseModeOptions.LOCAL]: {
      qindex: queryIndexes.CALL_NUMBER,
      query: row.shelfKey,
      ...filters,
    },
    [browseModeOptions.NATIONAL_LIBRARY_OF_MEDICINE]: {
      qindex: queryIndexes.CALL_NUMBER,
      query: row.shelfKey,
      ...filters,
    },
    [browseModeOptions.OTHER]: {
      qindex: queryIndexes.CALL_NUMBER,
      query: row.shelfKey,
      ...filters,
    },
    [browseModeOptions.SUPERINTENDENT]: {
      qindex: queryIndexes.CALL_NUMBER,
      query: row.shelfKey,
      ...filters,
    },
    [browseModeOptions.CONTRIBUTORS]: {
      qindex: queryIndexes.CONTRIBUTOR,
      query: row.name,
      ...filters,
    },
    [browseModeOptions.SUBJECTS]: {
      qindex: queryIndexes.SUBJECT,
      query: row.value,
      ...filters,
    },
  };

  return optionsMap[qindex];
};
