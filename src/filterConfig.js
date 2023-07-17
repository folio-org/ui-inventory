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
    { label: 'ui-inventory.callNumberNormalized', value: 'holdingsNormalizedCallNumbers' },
    { label: 'ui-inventory.search.holdingsNotes', value: 'holdingsNotes' },
    { label: 'ui-inventory.search.holdingsAdministrativeNotes', value: 'holdingsAdministrativeNotes' },
    { label: 'ui-inventory.holdingsHrid', value: 'holdingsHrid' },
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
  {
    label: 'ui-inventory.browse.callNumbers',
    queryTemplate: '%{query.query}',
    subIndexes: [
      { label: 'ui-inventory.browse.callNumbersAll', value: browseModeOptions.CALL_NUMBERS },
      { label: 'ui-inventory.browse.dewey', value: browseModeOptions.DEWEY },
      { label: 'ui-inventory.browse.libOfCongress', value: browseModeOptions.LIBRARY_OF_CONGRESS },
      { label: 'ui-inventory.browse.local', value: browseModeOptions.LOCAL },
      { label: 'ui-inventory.browse.natLibOfMed', value: browseModeOptions.NATIONAL_LIBRARY_OF_MEDICINE },
      { label: 'ui-inventory.browse.other', value: browseModeOptions.OTHER },
      { label: 'ui-inventory.browse.superintendent', value: browseModeOptions.SUPERINTENDENT },
    ],
  },
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
