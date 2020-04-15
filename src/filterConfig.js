import {
  instanceFilterRenderer,
  holdingsRecordFilterRenderer,
  itemFilterRenderer,
} from './components';

import {
  buildDateRangeQuery,
  buildOptionalBooleanQuery,
} from './utils';

export const instanceFilterConfig = [
  {
    name: 'effectiveLocation',
    cql: 'item.effectiveLocationId',
    values: [],
  },
  {
    name: 'language',
    cql: 'languages',
    values: [],
  },
  {
    name: 'format',
    cql: 'instanceFormatIds',
    values: [],
  },
  {
    name: 'resource',
    cql: 'instanceTypeId',
    values: [],
  },
  {
    name: 'mode',
    cql: 'modeOfIssuanceId',
    values: [],
  },
  {
    name: 'natureOfContent',
    cql: 'natureOfContentTermIds',
    values: [],
  },
  {
    name: 'location',
    cql: 'holdingsRecords.permanentLocationId',
    values: [],
  },
  {
    name: 'staffSuppress',
    cql: 'staffSuppress',
    values: [],
    parse: buildOptionalBooleanQuery('staffSuppress'),
  },
  {
    name: 'discoverySuppress',
    cql: 'discoverySuppress',
    values: [],
    parse: buildOptionalBooleanQuery('discoverySuppress'),
  },
  {
    name: 'createdDate',
    cql: 'metadata.createdDate',
    values: [],
    parse: buildDateRangeQuery('createdDate'),
  },
];

export const instanceIndexes = [
  { label: 'ui-inventory.search.all', value: 'all', queryTemplate: 'keyword all "%{query.query}"' },
  { label: 'ui-inventory.contributor', value: 'contributor', queryTemplate: 'contributors =/@name "%{query.query}"' },
  { label: 'ui-inventory.title', value: 'title', queryTemplate: 'title all "%{query.query}"' },
  { label: 'ui-inventory.identifierAll', value: 'identifier', queryTemplate: 'identifiers =/@value "%{query.query}"' },
  { label: 'ui-inventory.isbn', prefix: '- ', value: 'isbn', queryTemplate: 'identifiers =/@value/@identifierTypeId="<%= identifierTypeId %>" "%{query.query}"' },
  { label: 'ui-inventory.isbnNormalized', prefix: '- ', value: 'isbnNormalized', queryTemplate: 'isbn="%{query.query}" OR invalidIsbn="%{query.query}"' },
  { label: 'ui-inventory.issn', prefix: '- ', value: 'issn', queryTemplate: 'identifiers =/@value/@identifierTypeId="<%= identifierTypeId %>" "%{query.query}"' },
  { label: 'ui-inventory.subject', value: 'subject', queryTemplate: 'subjects="%{query.query}"' },
  // { label: 'ui-inventory.barcode', value: 'item.barcode', queryTemplate: 'item.barcode=="%{query.query}"' },
  { label: 'ui-inventory.instanceHrid', value: 'hrid', queryTemplate: 'hrid=="%{query.query}"' },
  { label: 'ui-inventory.instanceId', value: 'id', queryTemplate: 'id="%{query.query}"' },
  { label: 'ui-inventory.querySearch', value: 'querySearch', queryTemplate: '%{query.query}' },
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
    queryTemplate: 'holdingsRecords.fullCallNumber=="%{query.query}" OR holdingsRecords.callNumberAndSuffix=="%{query.query}"' },
  { label: 'ui-inventory.holdingsHrid', value: 'hrid', queryTemplate: 'holdingsRecords.hrid=="%{query.query}"' },
  { label: 'ui-inventory.querySearch', value: 'querySearch', queryTemplate: '%{query.query}' },
];

export const holdingSortMap = {};

export const holdingFilterConfig = [
  {
    name: 'effectiveLocation',
    cql: 'item.effectiveLocationId',
    values: [],
  },
  {
    name: 'holdingsPermanentLocation',
    cql: 'holdingsRecords.permanentLocationId',
    values: [],
  },
  {
    name: 'discoverySuppress',
    cql: 'holdingsRecords.discoverySuppress',
    values: [],
    parse: buildOptionalBooleanQuery('holdingsRecords.discoverySuppress'),
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
    queryTemplate: 'item.fullCallNumber=="%{query.query}" OR item.callNumberAndSuffix=="%{query.query}"' },
  { label: 'ui-inventory.itemHrid', value: 'hrid', queryTemplate: 'item.hrid=="%{query.query}"' },
  { label: 'ui-inventory.querySearch', value: 'querySearch', queryTemplate: '%{query.query}' },
];

export const itemFilterConfig = [
  {
    name: 'materialType',
    cql: 'item.materialTypeId',
    values: [],
  },
  {
    name: 'itemStatus',
    cql: 'item.status.name',
    operator: '==',
    values: [],
  },
  {
    name: 'effectiveLocation',
    cql: 'item.effectiveLocationId',
    values: [],
  },
  {
    name: 'holdingsPermanentLocation',
    cql: 'holdingsRecords.permanentLocationId',
    values: [],
  },
  {
    name: 'discoverySuppress',
    cql: 'item.discoverySuppress',
    values: [],
    parse: buildOptionalBooleanQuery('item.discoverySuppress'),
  }
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
