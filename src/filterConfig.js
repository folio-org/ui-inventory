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
    cql: 'items.effectiveLocationId',
    values: [],
  },
  {
    name: 'language',
    cql: 'languages',
    values: [],
    operator: '=',
  },
  {
    name: 'format',
    cql: 'instanceFormatIds',
    values: [],
    operator: '=',
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
    operator: '=',
  },
  {
    name: 'location',
    cql: 'holdings.permanentLocationId',
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
  {
    name: 'updatedDate',
    cql: 'metadata.updatedDate',
    values: [],
    parse: buildDateRangeQuery('updatedDate'),
  },
  {
    name: 'source',
    cql: 'source',
    operator: '==',
    values: [],
  },
  {
    name: 'tags',
    cql: 'tags.tagList',
    values: [],
    operator: '=',
  },
];

export const instanceIndexes = [
  { label: 'ui-inventory.search.all', value: 'all', queryTemplate: 'keyword all "%{query.query}"' },
  { label: 'ui-inventory.contributor', value: 'contributor', queryTemplate: 'contributors="%{query.query}"' },
  { label: 'ui-inventory.title', value: 'title', queryTemplate: 'title all "%{query.query}"' },
  { label: 'ui-inventory.identifierAll', value: 'identifier', queryTemplate: 'identifiers.value=="%{query.query}"' },
  { label: 'ui-inventory.isbn', value: 'isbn', queryTemplate: 'isbn=="%{query.query}"' },
  { label: 'ui-inventory.issn', value: 'issn', queryTemplate: 'issn=="%{query.query}"' },
  { label: 'ui-inventory.subject', value: 'subject', queryTemplate: 'subjects="%{query.query}"' },
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
  { label: 'ui-inventory.isbn', value: 'isbn', queryTemplate: 'isbn=="%{query.query}"' },
  { label: 'ui-inventory.issn', value: 'issn', queryTemplate: 'issn=="%{query.query}"' },
  { label: 'ui-inventory.callNumberEyeReadable',
    value: 'callNumberER',
    queryTemplate: 'holdings.fullCallNumber=="%{query.query}"' },
  { label: 'ui-inventory.holdingsHrid', value: 'hrid', queryTemplate: 'holdings.hrid=="%{query.query}"' },
  { label: 'ui-inventory.querySearch', value: 'querySearch', queryTemplate: '%{query.query}' },
];

export const holdingSortMap = {};

export const holdingFilterConfig = [
  {
    name: 'effectiveLocation',
    cql: 'items.effectiveLocationId',
    values: [],
  },
  {
    name: 'holdingsPermanentLocation',
    cql: 'holdings.permanentLocationId',
    values: [],
  },
  {
    name: 'discoverySuppress',
    cql: 'holdings.discoverySuppress',
    values: [],
    parse: buildOptionalBooleanQuery('holdings.discoverySuppress'),
  },
  {
    name: 'tags',
    cql: 'holdings.tags.tagList',
    values: [],
    operator: '=',
  },
];

export const itemIndexes = [
  { label: 'ui-inventory.search.all', value: 'all', queryTemplate: 'keyword all "%{query.query}"' },
  { label: 'ui-inventory.barcode', value: 'items.barcode', queryTemplate: 'items.barcode=="%{query.query}"' },
  { label: 'ui-inventory.isbn', value: 'isbn', queryTemplate: 'isbn=="%{query.query}"' },
  { label: 'ui-inventory.issn', value: 'issn', queryTemplate: 'issn=="%{query.query}"' },
  { label: 'ui-inventory.itemEffectiveCallNumberEyeReadable',
    value: 'itemCallNumberER',
    queryTemplate: 'items.effectiveCallNumberComponents=="%{query.query}"' },
  { label: 'ui-inventory.itemHrid', value: 'hrid', queryTemplate: 'items.hrid=="%{query.query}"' },
  { label: 'ui-inventory.querySearch', value: 'querySearch', queryTemplate: '%{query.query}' },

];

export const itemFilterConfig = [
  {
    name: 'materialType',
    cql: 'items.materialTypeId',
    values: [],
  },
  {
    name: 'itemStatus',
    cql: 'items.status.name',
    operator: '==',
    values: [],
  },
  {
    name: 'effectiveLocation',
    cql: 'items.effectiveLocationId',
    values: [],
  },
  {
    name: 'holdingsPermanentLocation',
    cql: 'holdings.permanentLocationId',
    values: [],
  },
  {
    name: 'discoverySuppress',
    cql: 'items.discoverySuppress',
    values: [],
    parse: buildOptionalBooleanQuery('items.discoverySuppress'),
  },
  {
    name: 'tags',
    cql: 'items.tags.tagList',
    values: [],
    operator: '=',
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
