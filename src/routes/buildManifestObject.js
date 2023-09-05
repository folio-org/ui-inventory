import {
  get,
  isEmpty,
} from 'lodash';

import { makeQueryFunction } from '@folio/stripes/smart-components';
import {
  CQL_FIND_ALL,
  fieldSearchConfigurations,
  queryIndexes
} from '../constants';
import {
  getQueryTemplate,
  getIsbnIssnTemplate,
} from '../utils';
import { getFilterConfig } from '../filterConfig';
import facetsStore from '../stores/facetsStore';

const INITIAL_RESULT_COUNT = 100;
const DEFAULT_SORT = 'title';

const getQueryTemplateContributor = (queryValue) => `contributors.name==/string "${queryValue}"`;
const getAdvancedSearchQueryTemplate = (queryIndex, matchOption) => fieldSearchConfigurations[queryIndex]?.[matchOption];

export const getAdvancedSearchTemplate = (queryValue) => {
  const splitIntoRowsRegex = /(?=\sor\s|\sand\s|\snot\s)/g;

  // split will return array of strings:
  // ['keyword==test', 'or issn=123', ...]
  const rows = queryValue.split(splitIntoRowsRegex).map(i => i.trim());

  return rows.map((match, index) => {
    let bool = '';
    let query = match;

    // first row doesn't have a bool operator
    if (index !== 0) {
      bool = match.substr(0, match.indexOf(' '));
      query = match.substr(bool.length);
    }

    const splitIndexAndQueryRegex = /([^=]+)(exactPhrase|containsAll|startsWith)(.+)/g;


    const rowParts = [...query.matchAll(splitIndexAndQueryRegex)]?.[0] || [];
    // eslint-disable-next-line no-unused-vars
    const [, option, _match, value] = rowParts
      .map(i => i.trim())
      .map(i => i.replaceAll('"', ''));

    return {
      query: value,
      bool,
      searchOption: option,
      match: _match,
    };
  }).reduce((acc, row) => {
    const rowTemplate = getAdvancedSearchQueryTemplate(row.searchOption, row.match);

    if (!rowTemplate) {
      return acc;
    }

    const rowQuery = rowTemplate.replaceAll('%{query.query}', row.query);

    const formattedRow = `${row.bool} ${rowQuery}`.trim();
    return `${acc} ${formattedRow}`;
  }, '').trim();
};

export function buildQuery(queryParams, pathComponents, resourceData, logger, props) {
  const { indexes, sortMap, filters } = getFilterConfig(queryParams.segment);
  const query = { ...resourceData.query };
  const queryIndex = queryParams?.qindex ?? 'all';
  const queryValue = get(queryParams, 'query', '');
  let queryTemplate = getQueryTemplate(queryIndex, indexes);

  if (queryParams?.selectedBrowseResult) {
    if (queryIndex === queryIndexes.CONTRIBUTOR) {
      const escapedQueryValue = queryValue.replaceAll('"', '\\"');

      queryTemplate = getQueryTemplateContributor(escapedQueryValue);
    }

    query.selectedBrowseResult = null; // reset this parameter so the next search uses `=` instead of `==/string`
  }

  if (queryIndex === queryIndexes.ADVANCED_SEARCH) {
    queryTemplate = getAdvancedSearchTemplate(queryValue);
  }

  if (queryIndex.match(/isbn|issn/)) {
    // eslint-disable-next-line camelcase
    const identifierTypes = resourceData?.identifier_types?.records ?? [];
    queryTemplate = getIsbnIssnTemplate(queryTemplate, identifierTypes, queryIndex);
  }

  if (queryIndex === queryIndexes.QUERY_SEARCH && queryValue.match('sortby')) {
    query.sort = '';
  } else if (query.sort && query.sort === 'relevance') {
    query.sort = '';
  } else if (!query.sort) {
    // Default sort for filtering/searching instances/holdings/items should be by title (UIIN-1046)
    query.sort = DEFAULT_SORT;
  }

  resourceData.query = { ...query, qindex: '' };

  // makeQueryFunction escapes quote and backslash characters by default,
  // but when submitting a raw CQL query (i.e. when queryIndex === 'querySearch')
  // we assume the user knows what they are doing and wants to run the CQL as-is.
  return makeQueryFunction(
    CQL_FIND_ALL,
    queryTemplate,
    sortMap,
    filters,
    2,
    null,
    queryIndex !== 'querySearch',
  )(queryParams, pathComponents, resourceData, logger, props);
}

const memoizeGetFetch = (fn) => {
  let prevLocationKey = '';
  let prevResultOffset = '';
  let prevResult = false;

  return props => {
    const {
      location,
      resources: {
        resultOffset,
      },
    } = props;

    if (
      prevLocationKey === location.key &&
      prevResultOffset === resultOffset
    ) {
      return prevResult;
    } else {
      const result = fn(props);
      prevLocationKey = location.key;
      prevResultOffset = resultOffset;
      prevResult = result;
      return result;
    }
  };
};

const getFetchProp = () => {
  let prevQindex = null;
  let prevQuery = null;

  return memoizeGetFetch(props => {
    const {
      location,
    } = props;
    const params = new URLSearchParams(location.search);
    const qindex = params.get('qindex');
    const query = params.get('query');
    const filters = params.get('filters');
    const sort = params.get('sort');
    const selectedBrowseResult = params.get('selectedBrowseResult');
    const hasReset = (
      !qindex &&
      !query &&
      !filters &&
      (sort === DEFAULT_SORT || !sort) &&
      isEmpty(facetsStore.getState().facetSettings)
    );
    let isFetch = true;

    if (prevQindex !== qindex) {
      isFetch = (
        hasReset ||
        prevQuery !== query ||
        selectedBrowseResult === 'true'
      );
    }

    prevQindex = qindex;
    prevQuery = query;
    return isFetch;
  });
};

const buildRecordsManifest = (options = {}) => {
  const { path } = options;

  return {
    type: 'okapi',
    records: 'instances',
    resultOffset: '%{resultOffset}',
    perRequest: 100,
    throwErrors: false,
    path: 'inventory/instances',
    resultDensity: 'sparse',
    accumulate: 'true',
    fetch: getFetchProp(),
    GET: {
      path,
      params: {
        query: buildQuery,
      },
    },
  };
};

export function buildManifestObject() {
  return {
    numFiltersLoaded: { initialValue: 1 }, // will be incremented as each filter loads
    query: {
      initialValue: {
        query: '',
        filters: '',
        sort: '',
        selectedBrowseResult: false,
      },
    },
    resultCount: { initialValue: INITIAL_RESULT_COUNT },
    resultOffset: { initialValue: 0 },
    records: buildRecordsManifest({
      path: 'search/instances',
    }),
    recordsToExportIDs: {
      type: 'okapi',
      records: 'ids',
      accumulate: true,
      fetch: false,
      path: 'search/instances/ids',
      throwErrors: false,
      GET: {
        params: {
          query: buildQuery,
        },
        staticFallback: { params: {} },
      },
    },
    holdingsToExportIDs: {
      type: 'okapi',
      records: 'ids',
      accumulate: true,
      fetch: false,
      path: 'search/holdings/ids',
      throwErrors: false,
      GET: {
        params: {
          query: buildQuery,
        },
        staticFallback: { params: {} },
      },
    },
    quickExport: {
      type: 'okapi',
      fetch: false,
      path: 'data-export/quick-export',
      throwErrors: false,
      clientGeneratePk: false,
    },
    itemsInTransitReport: {
      type: 'okapi',
      records: 'items',
      path: 'inventory-reports/items-in-transit',
      accumulate: true,
      fetch: false,
    },
    itemsByQuery: {
      type: 'okapi',
      records: 'items',
      path: 'inventory/items',
      accumulate: true,
      fetch: false,
    },
  };
}
