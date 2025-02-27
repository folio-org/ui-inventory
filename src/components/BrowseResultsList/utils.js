import omit from 'lodash/omit';

import {
  browseCallNumberOptions,
  browseClassificationOptions,
  browseModeOptions,
  browseClassificationIndexToId,
  browseCallNumberIndexToId,
  FACETS,
  queryIndexes,
} from '@folio/stripes-inventory-components';

export const isRowPreventsClick = (row, browseOption) => {
  /**
   * there is a special case when contributors and subject search can return shared records even with "Shared - No" in facets
   * in this case there will be a non-anchor item with 0 total results. we need to show it as item with 0 results
   * and make it not clickable
   *
   * items with isAnchor=false and totalRecords=0 should not appear in any other case,
   * so we can safely just check for totalRecords here
   */
  const isItemHasNoRecords = row.totalRecords === 0;

  return isItemHasNoRecords || (
    (browseOption === browseModeOptions.CONTRIBUTORS && !row.contributorNameTypeId) ||
    (browseOption === browseModeOptions.SUBJECTS && !row.totalRecords)
  );
};

const facetsToString = (filters, facetNameInBrowse, facetNameInSearch) => {
  return filters[facetNameInBrowse]?.map(value => `${facetNameInSearch}.${value}`).join(',');
};

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

    if (row.sourceId) {
      extraFacets.push(`${FACETS.SEARCH_SUBJECT_SOURCE}.${row.sourceId}`);
    }

    if (row.typeId) {
      extraFacets.push(`${FACETS.SEARCH_SUBJECT_TYPE}.${row.typeId}`);
    }
  } else if (qindex === browseModeOptions.CONTRIBUTORS) {
    sharedFacetName = FACETS.CONTRIBUTORS_SHARED;
    heldByFacetName = FACETS.CONTRIBUTORS_HELD_BY;

    extraFacets.push(`${FACETS.SEARCH_CONTRIBUTORS}.${row.contributorNameTypeId}`);
  } else if (Object.values(browseCallNumberOptions).includes(qindex)) {
    sharedFacetName = FACETS.CALL_NUMBERS_SHARED;
    heldByFacetName = FACETS.CALL_NUMBERS_HELD_BY;
  } else if (Object.values(browseClassificationOptions).includes(qindex)) {
    sharedFacetName = FACETS.CLASSIFICATION_SHARED;
  }

  const sharedExtraFacets = facetsToString(filtersOnly, sharedFacetName, FACETS.SHARED);
  const heldByExtraFacets = facetsToString(filtersOnly, heldByFacetName, FACETS.HELD_BY);
  const extraFacetsString = [...extraFacets, sharedExtraFacets, heldByExtraFacets].filter(Boolean).join(',');

  return extraFacetsString ? { filters: extraFacetsString } : {};
};

const getClassificationQuery = (qindex, data, row) => {
  const isClassificationBrowse = Object.values(browseClassificationOptions).includes(qindex);

  if (!isClassificationBrowse) {
    return '';
  }

  let query = `classifications.classificationNumber=="${row.classificationNumber}"`;

  const classificationBrowseConfigId = browseClassificationIndexToId[qindex];

  const classificationBrowseTypes = data.classificationBrowseConfig
    .find(config => config.id === classificationBrowseConfigId)?.typeIds;

  const classificationBrowseTypesQuery = classificationBrowseTypes
    ?.map(typeId => `classifications.classificationTypeId=="${typeId}"`)
    .join(' or ');

  if (classificationBrowseTypesQuery) {
    query += ` and (${classificationBrowseTypesQuery})`;
  }

  return query;
};

export const getFullCallNumber = (row) => {
  const fullCallNumber = [row.callNumberPrefix, row.callNumber, row.callNumberSuffix].filter(Boolean).join(' ');

  return fullCallNumber;
};

/**
 * Constructs a query string for browsing call numbers based on the provided parameters.
 *
 * @param {string} qindex - The query index indicating the type of browse (e.g., callNumbers, dewey, lc).
 * @param {Object} data - The data object containing configuration for call number browsing.
 * @param {Object} row - The row object containing details of the item being browsed.
 * @returns {string} - The constructed query string for browsing call numbers.
 */
const getCallNumberQuery = (qindex, data, row) => {
  const fullCallNumber = getFullCallNumber(row);

  const isCallNumberBrowse = Object.values(browseCallNumberOptions).includes(qindex);

  if (!isCallNumberBrowse) {
    return '';
  }

  let query = `itemFullCallNumbers="${fullCallNumber}"`;

  const callNumberBrowseConfigId = browseCallNumberIndexToId[qindex];

  const callNumberBrowseTypes = data?.callNumberBrowseConfig
    .find(config => config.id === callNumberBrowseConfigId)?.typeIds;

  const callNumberBrowseTypesQuery = callNumberBrowseTypes
    ?.map(typeId => `item.effectiveCallNumberComponents.typeId=="${typeId}"`)
    .join(' or ');

  if (callNumberBrowseTypesQuery) {
    query += ` and (${callNumberBrowseTypesQuery})`;
  }

  return query;
};

export const getSearchParams = (row, qindex, allFilters, data) => {
  const filters = getExtraFilters(row, qindex, allFilters);
  const classificationQuery = getClassificationQuery(qindex, data, row);
  const callNumberQuery = getCallNumberQuery(qindex, data, row);

  const classificationOption = {
    qindex: queryIndexes.QUERY_SEARCH,
    query: classificationQuery,
    ...filters,
  };

  const callNumberOption = {
    qindex: queryIndexes.QUERY_SEARCH,
    query: callNumberQuery,
    ...filters,
  };

  const optionsMap = {
    [browseModeOptions.CALL_NUMBERS]: callNumberOption,
    [browseModeOptions.DEWEY]: callNumberOption,
    [browseModeOptions.LIBRARY_OF_CONGRESS]: callNumberOption,
    [browseModeOptions.LOCAL]: callNumberOption,
    [browseModeOptions.NATIONAL_LIBRARY_OF_MEDICINE]: callNumberOption,
    [browseModeOptions.OTHER]: callNumberOption,
    [browseModeOptions.SUPERINTENDENT]: callNumberOption,
    [browseModeOptions.CLASSIFICATION_ALL]: classificationOption,
    [browseModeOptions.DEWEY_CLASSIFICATION]: classificationOption,
    [browseModeOptions.LC_CLASSIFICATION]: classificationOption,
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
