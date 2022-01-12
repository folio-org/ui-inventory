import {
  instanceFilterRenderer,
  holdingsRecordFilterRenderer,
  itemFilterRenderer,
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
    parse: buildDateRangeQuery(FACETS.CREATED_DATE),
  },
  {
    name: FACETS.UPDATED_DATE,
    cql: FACETS_CQL.UPDATED_DATE,
    values: [],
    parse: buildDateRangeQuery(FACETS.UPDATED_DATE),
  },
  {
    name: FACETS.SOURCE,
    cql: FACETS_CQL.SOURCE,
    operator: '==',
    values: [],
  },
  {
    name: FACETS.INSTANCES_TAGS,
    cql: FACETS_CQL.INSTANCES_TAGS,
    values: [],
  },
];

export const instanceIndexes = [
  { label: 'ui-inventory.search.all', value: 'all', queryTemplate: 'keyword all "%{query.query}"' },
  { label: 'ui-inventory.contributor', value: 'contributor', queryTemplate: 'contributors="%{query.query}"' },
  { label: 'ui-inventory.title', value: 'title', queryTemplate: 'title all "%{query.query}"' },
  { label: 'ui-inventory.identifierAll', value: 'identifier', queryTemplate: 'identifiers.value="%{query.query}"' },
  { label: 'ui-inventory.isbn', value: 'isbn', queryTemplate: 'isbn="%{query.query}"' },
  { label: 'ui-inventory.issn', value: 'issn', queryTemplate: 'issn="%{query.query}"' },
  { label: 'ui-inventory.subject', value: 'subject', queryTemplate: 'subjects="%{query.query}"' },
  { label: 'ui-inventory.instanceHrid', value: 'hrid', queryTemplate: 'hrid=="%{query.query}"' },
  { label: 'ui-inventory.instanceId', value: 'id', queryTemplate: 'id="%{query.query}"' },
  { label: 'ui-inventory.querySearch', value: 'querySearch', queryTemplate: '%{query.query}' },
  { label: '-------------------------------------------', value: 'noValue', disabled: true },
  { label: 'ui-inventory.browseCallNumbers', value: 'callNumbers', queryTemplate: '%{query.query}' },
  { label: 'ui-inventory.browseSubjects', value: 'browseSubject', queryTemplate: '%{query.query}' },
];

export const instanceSortMap = {
  Title: 'title',
  publishers: 'publication',
  Contributors: 'contributors',
};

export const holdingIndexes = [
  { label: 'ui-inventory.search.all', value: 'all', queryTemplate: 'keyword all "%{query.query}"' },
  { label: 'ui-inventory.isbn', value: 'isbn', queryTemplate: 'isbn="%{query.query}"' },
  { label: 'ui-inventory.issn', value: 'issn', queryTemplate: 'issn="%{query.query}"' },
  { label: 'ui-inventory.callNumberEyeReadable',
    value: 'callNumberER',
    queryTemplate: 'holdings.fullCallNumber=="%{query.query}"' },
  { label: 'ui-inventory.holdingsHrid', value: 'hrid', queryTemplate: 'holdings.hrid=="%{query.query}"' },
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
];

export const itemIndexes = [
  { label: 'ui-inventory.search.all', value: 'all', queryTemplate: 'keyword all "%{query.query}"' },
  { label: 'ui-inventory.barcode', value: 'items.barcode', queryTemplate: 'items.barcode=="%{query.query}"' },
  { label: 'ui-inventory.isbn', value: 'isbn', queryTemplate: 'isbn="%{query.query}"' },
  { label: 'ui-inventory.issn', value: 'issn', queryTemplate: 'issn="%{query.query}"' },
  { label: 'ui-inventory.itemEffectiveCallNumberEyeReadable',
    value: 'itemCallNumberER',
    queryTemplate: 'items.effectiveCallNumberComponents=="%{query.query}"' },
  { label: 'ui-inventory.itemHrid', value: 'hrid', queryTemplate: 'items.hrid=="%{query.query}"' },
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
  }
};

export const getFilterConfig = (segment = 'instances') => config[segment];
