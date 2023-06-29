import itemFilterRenderer from './components/ItemFilters/itemFilterRenderer';
import holdingsRecordFilterRenderer from './components/HoldingsRecordFilters/holdingsRecordFilterRenderer';
import instanceFilterRenderer from './components/InstanceFilters/instanceFilterRenderer';

import {
  FACETS,
  FACETS_CQL,
  browseModeOptions,
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
    name: FACETS.STATUS,
    cql: FACETS_CQL.STATUS,
    operator: '==',
    values: [],
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
  {
    name: FACETS.SEARCH_CONTRIBUTORS,
    cql: FACETS_CQL.SEARCH_CONTRIBUTORS,
    values: [],
  },
  {
    name: FACETS.AUTHORITY_ID,
    cql: FACETS_CQL.AUTHORITY_ID,
    values: [],
  },
];

export const fieldSearchConfigurations = {
  keyword: {
    exactPhrase: 'keyword==/string "%{query.query}"',
    containsAll: 'keyword all "%{query.query}"',
    startsWith: 'keyword all "%{query.query}*"',
  },
  contributor: {
    exactPhrase: 'contributors.name==/string "%{query.query}"',
    containsAll: 'contributors.name="*%{query.query}*"',
    startsWith: 'contributors.name="%{query.query}*"',
  },
  title: {
    exactPhrase: 'title==/string "%{query.query}"',
    containsAll: 'title all "%{query.query}"',
    startsWith: 'title all "%{query.query}*"',
  },
  isbn: {
    exactPhrase: 'isbn=="%{query.query}"',
    containsAll: 'isbn="*%{query.query}*"',
    startsWith: 'isbn="%{query.query}*"',
  },
  issn: {
    exactPhrase: 'issn=="%{query.query}"',
    containsAll: 'issn="*%{query.query}*"',
    startsWith: 'issn="%{query.query}*"',
  },
  identifier: {
    exactPhrase: 'identifiers.value=="%{query.query}" or isbn=="%{query.query}"',
    containsAll: 'identifiers.value="*%{query.query}*" or isbn="*%{query.query}*"',
    startsWith: 'identifiers.value="%{query.query}*" or isbn="%{query.query}*"',
  },
  oclc: {
    exactPhrase: 'oclc=="%{query.query}"',
    containsAll: 'oclc="*%{query.query}*"',
    startsWith: 'oclc="%{query.query}*"',
  },
  instanceNotes: {
    exactPhrase: 'notes.note==/string "%{query.query}" or administrativeNotes==/string "%{query.query}"',
    containsAll: 'notes.note all "%{query.query}" or administrativeNotes all "%{query.query}"',
    startsWith: 'notes.note all "%{query.query}*" or administrativeNotes all "%{query.query}*"',
  },
  instanceAdministrativeNotes: {
    exactPhrase: 'administrativeNotes==/string "%{query.query}"',
    containsAll: 'administrativeNotes all "%{query.query}"',
    startsWith: 'administrativeNotes all "%{query.query}*"',
  },
  subject: {
    exactPhrase: 'subjects.value==/string "%{query.query}"',
    containsAll: 'subjects.value all "%{query.query}"',
    startsWith: 'subjects.value==/string "%{query.query}*"',
  },
  callNumber: {
    exactPhrase: 'itemEffectiveShelvingOrder==/string "%{query.query}"',
    containsAll: 'itemEffectiveShelvingOrder all "%{query.query}"',
    startsWith: 'itemEffectiveShelvingOrder==/string "%{query.query}*"',
  },
  hrid: {
    exactPhrase: 'hrid=="%{query.query}"',
    containsAll: 'hrid=="*%{query.query}*"',
    startsWith: 'hrid=="%{query.query}*"',
  },
  id: {
    exactPhrase: 'id=="%{query.query}"',
    containsAll: 'id="*%{query.query}*"',
    startsWith: 'id="%{query.query}*"',
  },
  authorityId: {
    exactPhrase: 'authorityId == %{query.query}',
    containsAll: 'authorityId=="*%{query.query}*"',
    startsWith: 'authorityId=="%{query.query}*"',
  },
  allFields: {
    exactPhrase: 'cql.all==/string "%{query.query}"',
    containsAll: 'cql.all all "%{query.query}"',
    startsWith: 'cql.all all "%{query.query}*"',
  },
  holdingsFullCallNumbers: {
    exactPhrase: 'holdingsFullCallNumbers=="%{query.query}"',
    containsAll: 'holdingsFullCallNumbers="*%{query.query}*"',
    startsWith: 'holdingsFullCallNumbers="%{query.query}*"',
  },
  holdingsNormalizedCallNumbers: {
    exactPhrase: 'holdingsNormalizedCallNumbers=="%{query.query}"',
    containsAll: 'holdingsNormalizedCallNumbers="*%{query.query}*"',
    startsWith: 'holdingsNormalizedCallNumbers="%{query.query}*"',
  },
  holdingsNotes: {
    exactPhrase: 'holdings.notes.note==/string "%{query.query}" or holdings.administrativeNotes==/string "%{query.query}"',
    containsAll: 'holdings.notes.note all "%{query.query}" or holdings.administrativeNotes all "%{query.query}"',
    startsWith: 'holdings.notes.note all "%{query.query}*" or holdings.administrativeNotes all "%{query.query}*"',
  },
  holdingsAdministrativeNotes: {
    exactPhrase: 'holdings.administrativeNotes==/string "%{query.query}"',
    containsAll: 'holdings.administrativeNotes all "%{query.query}"',
    startsWith: 'holdings.administrativeNotes all "%{query.query}*"',
  },
  holdingsHrid: {
    exactPhrase: 'holdings.hrid=="%{query.query}"',
    containsAll: 'holdings.hrid=="*%{query.query}*"',
    startsWith: 'holdings.hrid=="%{query.query}*"',
  },
  hid: {
    exactPhrase: 'holdings.id=="%{query.query}"',
    containsAll: 'holdings.id="*%{query.query}*"',
    startsWith: 'holdings.id="%{query.query}*"',
  },
  barcode: {
    exactPhrase: 'items.barcode=="%{query.query}"',
    containsAll: 'items.barcode="*%{query.query}*"',
    startsWith: 'items.barcode="%{query.query}*"',
  },
  itemFullCallNumbers: {
    exactPhrase: 'itemFullCallNumbers=="%{query.query}"',
    containsAll: 'itemFullCallNumbers="*%{query.query}*"',
    startsWith: 'itemFullCallNumbers="%{query.query}*"',
  },
  itemNormalizedCallNumbers: {
    exactPhrase: 'itemNormalizedCallNumbers=="%{query.query}"',
    containsAll: 'itemNormalizedCallNumbers="*%{query.query}*"',
    startsWith: 'itemNormalizedCallNumbers="%{query.query}*"',
  },
  itemNotes: {
    exactPhrase: 'item.notes.note==/string "%{query.query}" or item.administrativeNotes==/string "%{query.query}"',
    containsAll: 'item.notes.note all "%{query.query}" or item.administrativeNotes all "%{query.query}"',
    startsWith: 'item.notes.note all "%{query.query}*" or item.administrativeNotes all "%{query.query}*"',
  },
  itemAdministrativeNotes: {
    exactPhrase: 'item.administrativeNotes==/string "%{query.query}"',
    containsAll: 'item.administrativeNotes all "%{query.query}"',
    startsWith: 'item.administrativeNotes all "%{query.query}*"',
  },
  itemCirculationNotes: {
    exactPhrase: 'item.circulationNotes.note==/string "%{query.query}"',
    containsAll: 'item.circulationNotes.note all "%{query.query}"',
    startsWith: 'item.circulationNotes.note all "%{query.query}*"',
  },
  itemHrid: {
    exactPhrase: 'items.hrid=="%{query.query}"',
    containsAll: 'items.hrid="*%{query.query}*"',
    startsWith: 'items.hrid="%{query.query}*"',
  },
  iid: {
    exactPhrase: 'item.id=="%{query.query}"',
    containsAll: 'item.id="*%{query.query}*"',
    startsWith: 'item.id="%{query.query}*"',
  },
};

export const advancedSearchIndexes = {
  instances: [
    { label: 'ui-inventory.search.all', value: 'keyword' },
    { label: 'ui-inventory.contributor', value: 'contributor' },
    { label: 'ui-inventory.title', value: 'title' },
    { label: 'ui-inventory.identifierAll', value: 'identifier' },
    { label: 'ui-inventory.isbn', value: 'isbn' },
    { label: 'ui-inventory.issn', value: 'issn' },
    { label: 'ui-inventory.search.oclc', value: 'oclc' },
    { label: 'ui-inventory.search.instanceNotes', value: 'isntanceNotes' },
    { label: 'ui-inventory.search.instanceAdministrativeNotes', value: 'instanceAdministrativeNotes' },
    { label: 'ui-inventory.subject', value: 'subject' },
    { label: 'ui-inventory.effectiveCallNumberShelving', value: 'callNumber' },
    { label: 'ui-inventory.instanceHrid', value: 'hrid' },
    { label: 'ui-inventory.instanceId', value: 'id' },
    { label: 'ui-inventory.authorityId', value: 'authorityId' },
    { label: 'ui-inventory.search.allFields', value: 'allFields' },
  ],
  holdings: [
    { label: 'ui-inventory.search.all', value: 'keyword' },
    { label: 'ui-inventory.isbn', value: 'isbn' },
    { label: 'ui-inventory.issn', value: 'issn' },
    { label: 'ui-inventory.callNumberEyeReadable', value: 'holdingsFullCallNumbers' },
    { label: 'ui-inventory.callNumberNormalized', value: 'callNumberNormalized' },
    { label: 'ui-inventory.search.holdingsNotes', value: 'holdingsNotes' },
    { label: 'ui-inventory.search.holdingsAdministrativeNotes', value: 'holdingsAdministrativeNotes' },
    { label: 'ui-inventory.holdingsHrid', value: 'hrid' },
    { label: 'ui-inventory.search.holdings.uuid', value: 'hid' },
    { label: 'ui-inventory.search.allFields', value: 'allFields' },
  ],
  items: [
    { label: 'ui-inventory.search.all', value: 'keyword' },
    { label: 'ui-inventory.barcode', value: 'barcode' },
    { label: 'ui-inventory.isbn', value: 'isbn' },
    { label: 'ui-inventory.issn', value: 'issn' },
    { label: 'ui-inventory.itemEffectiveCallNumberEyeReadable', value: 'itemFullCallNumbers' },
    { label: 'ui-inventory.itemEffectiveCallNumberNormalized', value: 'itemNormalizedCallNumbers' },
    { label: 'ui-inventory.search.itemNotes', value: 'itemNotes' },
    { label: 'ui-inventory.search.itemAdministrativeNotes', value: 'itemAdministrativeNotes' },
    { label: 'ui-inventory.search.itemCirculationNotes', value: 'itemCirculationNotes' },
    { label: 'ui-inventory.itemHrid', value: 'itemHrid' },
    { label: 'ui-inventory.search.item.uuid', value: 'iid' },
    { label: 'ui-inventory.search.allFields', value: 'allFields' },
  ],
};

export const instanceIndexes = [
  // NOTE: the 'all' value was first used for a 'keyword all' query, but then
  // a *real* 'all' query option was added ('allInstances any'). That was given the value `allFields`
  // instead. It might make sense to rename the keyword option to something like `keywordAll`
  // but, without tracing the use of the value, I don't know what effects that would have in the code.
  { label: 'ui-inventory.search.all', value: 'all', queryTemplate: 'keyword all "%{query.query}" or isbn="%{query.query}" or hrid=="%{query.query}" or id=="%{query.query}"' },
  { label: 'ui-inventory.contributor', value: 'contributor', queryTemplate: 'contributors.name="%{query.query}"' },
  { label: 'ui-inventory.title', value: 'title', queryTemplate: 'title all "%{query.query}"' },
  { label: 'ui-inventory.identifierAll', value: 'identifier', queryTemplate: 'identifiers.value="%{query.query}" or isbn="%{query.query}"' },
  { label: 'ui-inventory.isbn', value: 'isbn', queryTemplate: 'isbn="%{query.query}"' },
  { label: 'ui-inventory.issn', value: 'issn', queryTemplate: 'issn="%{query.query}"' },
  { label: 'ui-inventory.search.oclc', value: 'oclc', queryTemplate: 'oclc="%{query.query}"' },
  { label: 'ui-inventory.search.instanceNotes', value: 'instanceNotes', queryTemplate: 'notes.note all "%{query.query}" or administrativeNotes all "%{query.query}"' },
  { label: 'ui-inventory.search.instanceAdministrativeNotes', value: 'instanceAdministrativeNotes', queryTemplate: 'administrativeNotes all "%{query.query}"' },
  { label: 'ui-inventory.subject', value: 'subject', queryTemplate: 'subjects.value==/string "%{query.query}"' },
  { label: 'ui-inventory.effectiveCallNumberShelving', value: 'callNumber', queryTemplate: 'itemEffectiveShelvingOrder==/string "%{query.query}"' },
  { label: 'ui-inventory.instanceHrid', value: 'hrid', queryTemplate: 'hrid=="%{query.query}"' },
  { label: 'ui-inventory.instanceId', value: 'id', queryTemplate: 'id="%{query.query}"' },
  { label: 'ui-inventory.authorityId', value: 'authorityId', queryTemplate: 'authorityId == %{query.query}' },
  { label: 'ui-inventory.search.allFields', value: 'allFields', queryTemplate: 'cql.all all "%{query.query}"' },
  { label: 'ui-inventory.querySearch', value: 'querySearch', queryTemplate: '%{query.query}' },
  { label: 'ui-inventory.advancedSearch', value: 'advancedSearch', queryTemplate: '%{query.query}' },
];

export const browseFiltersConfig = [
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

export const browseInstanceIndexes = [
  { label: 'ui-inventory.browse.callNumbers', value: `${browseModeOptions.CALL_NUMBERS}`, queryTemplate: '%{query.query}' },
  { label: 'ui-inventory.browse.contributors', value: `${browseModeOptions.CONTRIBUTORS}`, queryTemplate: '%{query.query}' },
  { label: 'ui-inventory.browse.subjects', value: `${browseModeOptions.SUBJECTS}`, queryTemplate: '%{query.query}' },
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
  { label: 'ui-inventory.search.all', value: 'all', queryTemplate: 'keyword all "%{query.query}" or isbn="%{query.query}" or holdings.hrid=="%{query.query}" or holdings.id=="%{query.query}"' },
  { label: 'ui-inventory.isbn', value: 'isbn', queryTemplate: 'isbn="%{query.query}"' },
  { label: 'ui-inventory.issn', value: 'issn', queryTemplate: 'issn="%{query.query}"' },
  { label: 'ui-inventory.callNumberEyeReadable',
    value: 'holdingsFullCallNumbers',
    queryTemplate: 'holdingsFullCallNumbers="%{query.query}"' },
  { label: 'ui-inventory.callNumberNormalized',
    value: 'callNumberNormalized',
    queryTemplate: 'holdingsNormalizedCallNumbers="%{query.query}"' },
  { label: 'ui-inventory.search.holdingsNotes', value: 'holdingsNotes', queryTemplate: 'holdings.notes.note all "%{query.query}" or holdings.administrativeNotes all "%{query.query}"' },
  { label: 'ui-inventory.search.holdingsAdministrativeNotes', value: 'holdingsAdministrativeNotes', queryTemplate: 'holdings.administrativeNotes all "%{query.query}"' },
  { label: 'ui-inventory.holdingsHrid', value: 'hrid', queryTemplate: 'holdings.hrid=="%{query.query}"' },
  { label: 'ui-inventory.search.holdings.uuid', value: 'hid', queryTemplate: 'holdings.id=="%{query.query}"' },
  { label: 'ui-inventory.search.allFields', value: 'allFields', queryTemplate: 'cql.all all "%{query.query}"' },
  { label: 'ui-inventory.querySearch', value: 'querySearch', queryTemplate: '%{query.query}' },
  { label: 'ui-inventory.advancedSearch', value: 'advancedSearch', queryTemplate: '%{query.query}' },
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
    name: FACETS.HOLDINGS_TYPE,
    cql: FACETS_CQL.HOLDINGS_TYPE,
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
  { label: 'ui-inventory.search.all', value: 'all', queryTemplate: 'keyword all "%{query.query}" or isbn="%{query.query}" or item.hrid=="%{query.query}" or item.id=="%{query.query}"' },
  { label: 'ui-inventory.barcode', value: 'items.barcode', queryTemplate: 'items.barcode=="%{query.query}"' },
  { label: 'ui-inventory.isbn', value: 'isbn', queryTemplate: 'isbn="%{query.query}"' },
  { label: 'ui-inventory.issn', value: 'issn', queryTemplate: 'issn="%{query.query}"' },
  { label: 'ui-inventory.itemEffectiveCallNumberEyeReadable',
    value: 'itemFullCallNumbers',
    queryTemplate: 'itemFullCallNumbers="%{query.query}"' },
  { label: 'ui-inventory.itemEffectiveCallNumberNormalized',
    value: 'itemNormalizedCallNumbers',
    queryTemplate: 'itemNormalizedCallNumbers="%{query.query}"' },
  { label: 'ui-inventory.search.itemNotes', value: 'holdingsNotes', queryTemplate: 'item.notes.note all "%{query.query}" or item.administrativeNotes all "%{query.query}"' },
  { label: 'ui-inventory.search.itemAdministrativeNotes', value: 'itemAdministrativeNotes', queryTemplate: 'item.administrativeNotes all "%{query.query}"' },
  { label: 'ui-inventory.search.itemCirculationNotes', value: 'itemCirculationNotes', queryTemplate: 'item.circulationNotes.note all "%{query.query}"' },
  { label: 'ui-inventory.itemHrid', value: 'itemHrid', queryTemplate: 'items.hrid=="%{query.query}"' },
  { label: 'ui-inventory.search.item.uuid', value: 'iid', queryTemplate: 'item.id=="%{query.query}"' },
  { label: 'ui-inventory.search.allFields', value: 'allFields', queryTemplate: 'cql.all all "%{query.query}"' },
  { label: 'ui-inventory.querySearch', value: 'querySearch', queryTemplate: '%{query.query}' },
  { label: 'ui-inventory.advancedSearch', value: 'advancedSearch', queryTemplate: '%{query.query}' },
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
    indexes: [...instanceIndexes],
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
};

export const browseConfig = {
  filters: browseFiltersConfig,
  indexes: browseInstanceIndexes,
  sortMap: instanceBrowseSortMap,
};

export const getFilterConfig = (segment = 'instances') => config[segment];
