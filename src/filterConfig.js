import {
  instanceFilterRenderer,
  holdingsRecordFilterRenderer,
  itemFilterRenderer,
} from './components';

import {
  buildDateRangeQuery,
  buildOptionalBooleanQuery,
} from './utils';
import {
  FACETS,
  FACETS_CQL
} from './constants';
import {
  AND,
  NOT,
  OR
} from './components/ElasticQueryField/constants';

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
    parse: buildOptionalBooleanQuery(FACETS_CQL.STAFF_SUPPRESS),
  },
  {
    name: FACETS.INSTANCES_DISCOVERY_SUPPRESS,
    cql: FACETS_CQL.INSTANCES_DISCOVERY_SUPPRESS,
    values: [],
    parse: buildOptionalBooleanQuery(FACETS_CQL.INSTANCES_DISCOVERY_SUPPRESS),
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
  { label: 'ui-inventory.contributor', value: 'contributor', queryTemplate: 'contributorsNames all "%{query.query}"' },
  { label: 'ui-inventory.title', value: 'title', queryTemplate: 'allTitles all "%{query.query}"' },
  { label: 'ui-inventory.identifierAll', value: 'identifier', queryTemplate: 'identifiers =/@value "%{query.query}"' },
  { label: 'ui-inventory.isbn', prefix: '- ', value: 'isbn', queryTemplate: 'identifiers =/@value/@identifierTypeId="<%= identifierTypeId %>" "%{query.query}"' },
  { label: 'ui-inventory.isbnNormalized', prefix: '- ', value: 'isbnNormalized', queryTemplate: 'isbn="%{query.query}" OR invalidIsbn="%{query.query}"' },
  { label: 'ui-inventory.issn', prefix: '- ', value: 'issn', queryTemplate: 'identifiers =/@value/@identifierTypeId="<%= identifierTypeId %>" "%{query.query}"' },
  { label: 'ui-inventory.subject', value: 'subject', queryTemplate: 'subjects="%{query.query}"' },
  // { label: 'ui-inventory.barcode', value: 'item.barcode', queryTemplate: 'item.barcode=="%{query.query}"' },
  { label: 'ui-inventory.instanceHrid', value: 'hrid', queryTemplate: 'hrid=="%{query.query}"' },
  { label: 'ui-inventory.instanceId', value: 'id', queryTemplate: 'id="%{query.query}"' },
  { label: 'ui-inventory.advancedSearch', value: 'advancedSearch', queryTemplate: '%{query.query}' },
];

export const instanceIndexesES = [
  { label: 'ui-inventory.search.all', value: 'all', queryTemplate: 'keyword all' },
  { label: 'ui-inventory.title', value: 'Title', queryTemplate: 'title all' },
  { label: 'ui-inventory.contributor', value: 'Contributor', queryTemplate: 'contributors=' },
  { label: 'ui-inventory.identifierAll', value: 'Identifier', queryTemplate: 'identifiers.value==' },
  { label: 'ui-inventory.issn', value: 'ISSN', queryTemplate: 'issn==' },
  { label: 'ui-inventory.isbn', value: 'ISBN', queryTemplate: 'isbn==' },
  { label: 'ui-inventory.subject', value: 'Subject', queryTemplate: 'subjects all' },
  { label: 'ui-inventory.instanceId', value: 'UUID', queryTemplate: 'id==' },
  { label: 'ui-inventory.instanceHrid', value: 'HRID', queryTemplate: 'hrid==' },
  { label: 'ui-inventory.electronicAccessAll', value: 'Electronic access (all)', queryTemplate: 'electronicAccess==' },
  { label: 'ui-inventory.electronicAccessURI', value: 'Electronic access (URI)', queryTemplate: 'electronicAccess.uri==' },
  { label: 'ui-inventory.electronicAccessPublicNote', value: 'Electronic access (Public Note)', queryTemplate: 'electronicAccess.publicNote all' },
  { label: 'ui-inventory.electronicAccessLinkText', value: 'Electronic access (Link text)', queryTemplate: 'electronicAccess.linkText all' },
  { label: 'ui-inventory.electronicAccessMaterialsSpecified', value: 'Electronic access (Materials specified)', queryTemplate: 'electronicAccess.materialsSpecification all' },
];

export const instanceSortMap = {
  Title: 'title',
  publishers: 'publication',
  Contributors: 'contributors',
};

export const holdingIndexes = [
  { label: 'ui-inventory.search.all', value: 'all', queryTemplate: 'keyword all "%{query.query}"' },
  { label: 'ui-inventory.isbn', value: 'isbn', queryTemplate: 'identifiers =/@value/@identifierTypeId="<%= identifierTypeId %>" "%{query.query}"' },
  { label: 'ui-inventory.isbnNormalized', value: 'isbnNormalized', queryTemplate: 'isbn="%{query.query}" OR invalidIsbn="%{query.query}"' },
  { label: 'ui-inventory.issn', value: 'issn', queryTemplate: 'identifiers =/@value/@identifierTypeId="<%= identifierTypeId %>" "%{query.query}"' },
  { label: 'ui-inventory.callNumberEyeReadable',
    value: 'callNumberER',
    queryTemplate: `
      holdingsRecords.fullCallNumber=="%{query.query}"
      OR holdingsRecords.callNumberAndSuffix=="%{query.query}"
      OR holdingsRecords.callNumber=="%{query.query}"
    ` },
  { label: 'ui-inventory.callNumberNormalized',
    value: 'callNumberNormalized',
    queryTemplate: 'holdingsRecords.fullCallNumberNormalized="%{query.query}" OR holdingsRecords.callNumberAndSuffixNormalized="%{query.query}"' },
  { label: 'ui-inventory.holdingsHrid', value: 'hrid', queryTemplate: 'holdingsRecords.hrid=="%{query.query}"' },
  { label: 'ui-inventory.advancedSearch', value: 'advancedSearch', queryTemplate: '%{query.query}' },
];

export const holdingIndexesES = [
  { label: 'ui-inventory.search.all', value: 'all', queryTemplate: 'keyword all' },
  { label: 'ui-inventory.issn', value: 'ISSN', queryTemplate: 'issn==' },
  { label: 'ui-inventory.isbn', value: 'ISBN', queryTemplate: 'isbn==' },
  { label: 'ui-inventory.callNumber', value: 'Call Number', queryTemplate: 'holdings.fullCallNumber==' },
  { label: 'ui-inventory.holdingsHrid', value: 'HRID', queryTemplate: 'holdings.hrid==' },
  { label: 'ui-inventory.electronicAccessAll', value: 'Electronic access (all)', queryTemplate: 'electronicAccess==' },
  { label: 'ui-inventory.electronicAccessURI', value: 'Electronic access (URI)', queryTemplate: 'electronicAccess.uri==' },
  { label: 'ui-inventory.electronicAccessPublicNote', value: 'Electronic access (Public Note)', queryTemplate: 'electronicAccess.publicNote all' },
  { label: 'ui-inventory.electronicAccessLinkText', value: 'Electronic access (Link text)', queryTemplate: 'electronicAccess.linkText all' },
  { label: 'ui-inventory.electronicAccessMaterialsSpecified', value: 'Electronic access (Materials specified)', queryTemplate: 'electronicAccess.materialsSpecification all' },
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
    parse: buildOptionalBooleanQuery(FACETS_CQL.HOLDINGS_DISCOVERY_SUPPRESS),
  },
  {
    name: FACETS.HOLDINGS_TAGS,
    cql: FACETS_CQL.HOLDINGS_TAGS,
    values: [],
  },
];

export const itemIndexes = [
  { label: 'ui-inventory.search.all', value: 'all', queryTemplate: 'keyword all "%{query.query}"' },
  { label: 'ui-inventory.barcode', value: 'item.barcode', queryTemplate: 'item.barcode=="%{query.query}"' },
  { label: 'ui-inventory.isbn', value: 'isbn', queryTemplate: 'identifiers =/@value/@identifierTypeId="<%= identifierTypeId %>" "%{query.query}"' },
  { label: 'ui-inventory.isbnNormalized', value: 'isbnNormalized', queryTemplate: 'isbn="%{query.query}" OR invalidIsbn="%{query.query}"' },
  { label: 'ui-inventory.issn', value: 'issn', queryTemplate: 'identifiers =/@value/@identifierTypeId="<%= identifierTypeId %>" "%{query.query}"' },
  { label: 'ui-inventory.itemEffectiveCallNumberEyeReadable',
    value: 'itemCallNumberER',
    queryTemplate: `
      item.fullCallNumber=="%{query.query}"
      OR item.callNumberAndSuffix=="%{query.query}"
      OR item.effectiveCallNumberComponents.callNumber=="%{query.query}"
    ` },
  { label: 'ui-inventory.itemEffectiveCallNumberNormalized',
    value: 'itemCallNumberNorm',
    queryTemplate: 'item.fullCallNumberNormalized="%{query.query}" OR item.callNumberAndSuffixNormalized="%{query.query}"' },
  { label: 'ui-inventory.itemHrid', value: 'hrid', queryTemplate: 'item.hrid=="%{query.query}"' },
  { label: 'ui-inventory.advancedSearch', value: 'advancedSearch', queryTemplate: '%{query.query}' },
];

export const itemIndexesES = [
  { label: 'ui-inventory.search.all', value: 'all', queryTemplate: 'keyword all' },
  { label: 'ui-inventory.barcode', value: 'Barcode', queryTemplate: 'items.barcode==' },
  { label: 'ui-inventory.issn', value: 'ISSN', queryTemplate: 'issn==' },
  { label: 'ui-inventory.isbn', value: 'ISBN', queryTemplate: 'isbn==' },
  { label: 'ui-inventory.callNumber', value: 'Call Number', queryTemplate: 'items.effectiveCallNumberComponents==' },
  { label: 'ui-inventory.itemHrid', value: 'Item HRID', queryTemplate: 'items.hrid==' },
  { label: 'ui-inventory.electronicAccessAll', value: 'Electronic access (all)', queryTemplate: 'electronicAccess==' },
  { label: 'ui-inventory.electronicAccessURI', value: 'Electronic access (URI)', queryTemplate: 'electronicAccess.uri==' },
  { label: 'ui-inventory.electronicAccessPublicNote', value: 'Electronic access (Public Note)', queryTemplate: 'electronicAccess.publicNote all' },
  { label: 'ui-inventory.electronicAccessLinkText', value: 'Electronic access (Link text)', queryTemplate: 'electronicAccess.linkText all' },
  { label: 'ui-inventory.electronicAccessMaterialsSpecified', value: 'Electronic access (Materials specified)', queryTemplate: 'electronicAccess.materialsSpecification all' },
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
    parse: buildOptionalBooleanQuery(FACETS_CQL.ITEMS_DISCOVERY_SUPPRESS),
  },
  {
    name: FACETS.ITEMS_TAGS,
    cql: FACETS_CQL.ITEMS_TAGS,
    values: [],
  },
];

const operators = [
  { label: '=', queryTemplate: '' },
];

const booleanOperators = [
  { label: AND },
  { label: OR },
  { label: NOT },
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
    indexesES: instanceIndexesES,
    operators,
    booleanOperators,
  },
  holdings: {
    filters: holdingFilterConfig,
    indexes: holdingIndexes,
    sortMap: holdingSortMap,
    renderer: holdingsRecordFilterRenderer,
    indexesES: holdingIndexesES,
    operators,
    booleanOperators,
  },
  items: {
    filters: itemFilterConfig,
    indexes: itemIndexes,
    sortMap: itemSortMap,
    renderer: itemFilterRenderer,
    indexesES: itemIndexesES,
    operators,
    booleanOperators,
  }
};

export const getFilterConfig = (segment = 'instances') => config[segment];
