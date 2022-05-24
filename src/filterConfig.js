import {
  instanceFilterRenderer,
  holdingsRecordFilterRenderer,
  itemFilterRenderer,
  instanceFilterBrowseRenderer,
} from './components';
import {
  FACETS,
  FACETS_CQL
} from './constants';
import {
  buildDateRangeQuery,
} from './utils';

export const instanceFilterConfig = [
  {
    name: FACETS.EFFECTIVE_LOCATION,
    cql: FACETS_CQL.EFFECTIVE_LOCATION,
    values: [],
  },
  {
    name: FACETS.LANGUAGE,
    cql: FACETS_CQL.LANGUAGES,
    values: [],
  },
  {
    name: FACETS.FORMAT,
    cql: FACETS_CQL.INSTANCE_FORMAT,
    values: [],
  },
  {
    name: FACETS.RESOURCE,
    cql: FACETS_CQL.INSTANCE_TYPE,
    values: [],
  },
  {
    name: FACETS.MODE,
    cql: FACETS_CQL.MODE_OF_ISSUANCE,
    values: [],
  },
  {
    name: FACETS.NATURE_OF_CONTENT,
    cql: FACETS_CQL.NATURE_OF_CONTENT,
    values: [],
  },
  {
    name: 'location',
    cql: FACETS_CQL.HOLDINGS_PERMANENT_LOCATION,
    values: [],
  },
  {
    name: FACETS_CQL.STAFF_SUPPRESS,
    cql: FACETS_CQL.STAFF_SUPPRESS,
    values: [],
  },
  {
    name: FACETS.INSTANCES_DISCOVERY_SUPPRESS,
    cql: FACETS_CQL.INSTANCES_DISCOVERY_SUPPRESS,
    values: [],
  },
  {
    name: FACETS.CREATED_DATE,
    cql: FACETS_CQL.CREATED_DATE,
    values: [],
    parse: buildDateRangeQuery(FACETS_CQL.CREATED_DATE),
  },
  {
    name: FACETS.UPDATED_DATE,
    cql: FACETS_CQL.UPDATED_DATE,
    values: [],
    parse: buildDateRangeQuery(FACETS_CQL.UPDATED_DATE),
  },
  {
    name: FACETS.SOURCE,
    cql: FACETS_CQL.SOURCE,
    operator: '==',
    values: [],
  },
  {
    name: FACETS.STATISTICAL_CODE_IDS,
    cql: FACETS_CQL.STATISTICAL_CODE_IDS,
    values: [],
  },
  {
    name: FACETS.INSTANCES_TAGS,
    cql: FACETS_CQL.INSTANCES_TAGS,
    values: [],
  },
];

export const browseModeOptions = {
  CALL_NUMBERS: 'callNumbers',
  CONTRIBUTORS: 'contributors',
  SUBJECTS: 'browseSubjects',
};

export const instanceFilterBrowseConfig = [
  {
    name: FACETS.EFFECTIVE_LOCATION,
    cql: FACETS_CQL.EFFECTIVE_LOCATION,
    values: [],
  },
  {
    name: FACETS.NAME_TYPE,
    cql: FACETS_CQL.NAME_TYPE,
    values: [],
  },
];

export const instanceIndexes = [
  // NOTE: the 'all' value was first used for a 'keyword all' query, but then
  // a *real* 'all' query option was added ('allInstances any'). That was given the value `allFields`
  // instead. It might make sense to rename the keyword option to something like `keywordAll`
  // but, without tracing the use of the value, I don't know what effects that would have in the code.
  { label: 'ui-inventory.search.all', value: 'all', queryTemplate: 'keyword all "%{query.query}"' },
  { label: 'ui-inventory.contributor', value: 'contributor', queryTemplate: 'contributors="%{query.query}"' },
  { label: 'ui-inventory.title', value: 'title', queryTemplate: 'title all "%{query.query}"' },
  { label: 'ui-inventory.identifierAll', value: 'identifier', queryTemplate: 'identifiers.value="%{query.query}"' },
  { label: 'ui-inventory.isbn', value: 'isbn', queryTemplate: 'isbn="%{query.query}"' },
  { label: 'ui-inventory.issn', value: 'issn', queryTemplate: 'issn="%{query.query}"' },
  { label: 'ui-inventory.subject', value: 'subject', queryTemplate: 'subjects="%{query.query}"' },
  { label: 'ui-inventory.instanceHrid', value: 'hrid', queryTemplate: 'hrid=="%{query.query}"' },
  { label: 'ui-inventory.instanceId', value: 'id', queryTemplate: 'id="%{query.query}"' },
  { label: 'ui-inventory.search.allFields', value: 'allFields', queryTemplate: 'cql.all all "%{query.query}"' },
  { label: 'ui-inventory.querySearch', value: 'querySearch', queryTemplate: '%{query.query}' },
  { label: 'ui-inventory.callNumber', value: 'callNumber', queryTemplate: 'callNumber=%{query.query}' },
  { label: 'ui-inventory.search.oclc', value: 'oclc', queryTemplate: 'oclc="%{query.query}"' },
  { label: '-------------------------------------------', value: 'noValue', disabled: true },
  { label: 'ui-inventory.browseCallNumbers', value: `${browseModeOptions.CALL_NUMBERS}`, queryTemplate: '%{query.query}' },
  { label: 'ui-inventory.browseContributors', value: `${browseModeOptions.CONTRIBUTORS}`, queryTemplate: '%{query.query}' },
  { label: 'ui-inventory.browseSubjects', value: `${browseModeOptions.SUBJECTS}`, queryTemplate: '%{query.query}' },
];

export const instanceBrowseSortMap = {
  callNumber: 'callNumber',
  title: 'title',
  numberOfTitles: 'numberOfTitles',
};

export const instanceSortMap = {
  Title: 'title',
  publishers: 'publication',
  Contributors: 'contributors',
};

export const holdingIndexes = [
  // See note for instanceIndexes about 'all' vs. 'allFields'
  { label: 'ui-inventory.search.all', value: 'all', queryTemplate: 'keyword all "%{query.query}"' },
  { label: 'ui-inventory.isbn', value: 'isbn', queryTemplate: 'isbn="%{query.query}"' },
  { label: 'ui-inventory.issn', value: 'issn', queryTemplate: 'issn="%{query.query}"' },
  { label: 'ui-inventory.callNumberEyeReadable',
    value: 'holdingsFullCallNumbers',
    queryTemplate: 'holdingsFullCallNumbers="%{query.query}"' },
  { label: 'ui-inventory.callNumberNormalized',
    value: 'callNumberNormalized',
    queryTemplate: 'holdingsNormalizedCallNumbers="%{query.query}"' },
  { label: 'ui-inventory.holdingsHrid', value: 'hrid', queryTemplate: 'holdings.hrid=="%{query.query}"' },
  { label: 'ui-inventory.search.allFields', value: 'allFields', queryTemplate: 'cql.all all "%{query.query}"' },
  { label: 'ui-inventory.querySearch', value: 'querySearch', queryTemplate: '%{query.query}' },
];

export const holdingSortMap = {};

export const holdingFilterConfig = [
  {
    name: FACETS.EFFECTIVE_LOCATION,
    cql: FACETS_CQL.EFFECTIVE_LOCATION,
    values: [],
  },
  {
    name: FACETS.HOLDINGS_PERMANENT_LOCATION,
    cql: FACETS_CQL.HOLDINGS_PERMANENT_LOCATION,
    values: [],
  },
  {
    name: FACETS.HOLDINGS_DISCOVERY_SUPPRESS,
    cql: FACETS_CQL.HOLDINGS_DISCOVERY_SUPPRESS,
    values: [],
  },
  {
    name: FACETS.HOLDINGS_TAGS,
    cql: FACETS_CQL.HOLDINGS_TAGS,
    values: [],
  },
  {
    name: FACETS.HOLDINGS_STATISTICAL_CODE_IDS,
    cql: FACETS_CQL.HOLDINGS_STATISTICAL_CODE_IDS,
    values: [],
  },
  {
    name: FACETS.HOLDINGS_CREATED_DATE,
    cql: FACETS_CQL.HOLDINGS_CREATED_DATE,
    values: [],
    parse: buildDateRangeQuery(FACETS_CQL.HOLDINGS_CREATED_DATE),
  },
  {
    name: FACETS.HOLDINGS_UPDATED_DATE,
    cql: FACETS_CQL.HOLDINGS_UPDATED_DATE,
    values: [],
    parse: buildDateRangeQuery(FACETS_CQL.HOLDINGS_UPDATED_DATE),
  },
  {
    name: FACETS.HOLDINGS_SOURCE,
    cql: FACETS_CQL.HOLDINGS_SOURCE,
    values: [],
  },
];

export const itemIndexes = [
  // See note for instanceIndexes about 'all' vs. 'allFields'
  { label: 'ui-inventory.search.all', value: 'all', queryTemplate: 'keyword all "%{query.query}"' },
  { label: 'ui-inventory.barcode', value: 'items.barcode', queryTemplate: 'items.barcode=="%{query.query}"' },
  { label: 'ui-inventory.isbn', value: 'isbn', queryTemplate: 'isbn="%{query.query}"' },
  { label: 'ui-inventory.issn', value: 'issn', queryTemplate: 'issn="%{query.query}"' },
  { label: 'ui-inventory.itemEffectiveCallNumberEyeReadable',
    value: 'itemFullCallNumbers',
    queryTemplate: 'itemFullCallNumbers="%{query.query}"' },
  { label: 'ui-inventory.itemEffectiveCallNumberNormalized',
    value: 'itemNormalizedCallNumbers',
    queryTemplate: 'itemNormalizedCallNumbers="%{query.query}"' },
  { label: 'ui-inventory.itemHrid', value: 'hrid', queryTemplate: 'items.hrid=="%{query.query}"' },
  { label: 'ui-inventory.search.allFields', value: 'allFields', queryTemplate: 'cql.all all "%{query.query}"' },
  { label: 'ui-inventory.querySearch', value: 'querySearch', queryTemplate: '%{query.query}' },

];

export const itemFilterConfig = [
  {
    name: FACETS.MATERIAL_TYPE,
    cql: FACETS_CQL.MATERIAL_TYPES,
    values: [],
  },
  {
    name: FACETS.ITEM_STATUS,
    cql: FACETS_CQL.ITEMS_STATUSES,
    operator: '==',
    values: [],
  },
  {
    name: FACETS.EFFECTIVE_LOCATION,
    cql: FACETS_CQL.EFFECTIVE_LOCATION,
    values: [],
  },
  {
    name: FACETS.HOLDINGS_PERMANENT_LOCATION,
    cql: FACETS_CQL.HOLDINGS_PERMANENT_LOCATION,
    values: [],
  },
  {
    name: FACETS.ITEMS_DISCOVERY_SUPPRESS,
    cql: FACETS_CQL.ITEMS_DISCOVERY_SUPPRESS,
    values: [],
  },
  {
    name: FACETS.ITEMS_STATISTICAL_CODE_IDS,
    cql: FACETS_CQL.ITEMS_STATISTICAL_CODE_IDS,
    values: [],
  },
  {
    name: FACETS.ITEMS_CREATED_DATE,
    cql: FACETS_CQL.ITEMS_CREATED_DATE,
    values: [],
    parse: buildDateRangeQuery(FACETS_CQL.ITEMS_CREATED_DATE),
  },
  {
    name: FACETS.ITEMS_UPDATED_DATE,
    cql: FACETS_CQL.ITEMS_UPDATED_DATE,
    values: [],
    parse: buildDateRangeQuery(FACETS_CQL.ITEMS_UPDATED_DATE),
  },
  {
    name: FACETS.ITEMS_TAGS,
    cql: FACETS_CQL.ITEMS_TAGS,
    values: [],
  },
];

export const itemSortMap = {
  Title: 'title',
  publishers: 'publication',
  Contributors: 'contributors',
};

const config = {
  instances: {
    filters: instanceFilterConfig,
    indexes: instanceIndexes,
    sortMap: instanceSortMap,
    renderer: instanceFilterRenderer,
  },
  holdings: {
    filters: holdingFilterConfig,
    indexes: holdingIndexes,
    sortMap: holdingSortMap,
    renderer: holdingsRecordFilterRenderer,
  },
  items: {
    filters: itemFilterConfig,
    indexes: itemIndexes,
    sortMap: itemSortMap,
    renderer: itemFilterRenderer,
  },
  browse: {
    filters: instanceFilterBrowseConfig,
    indexes: instanceIndexes,
    sortMap: instanceSortMap,
    renderer: instanceFilterBrowseRenderer,
  }
};

export const getFilterConfig = (segment = 'instances') => config[segment];
