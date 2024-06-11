import {
  browseModeOptions,
  filterConfigMap,
  queryIndexesMap,
  queryIndexes,
  FACETS,
  FACETS_CQL,
  instanceSortMap,
  itemSortMap,
  holdingSortMap,
  segments,
} from '@folio/stripes-inventory-components';

import itemFilterRenderer from './components/ItemFilters/itemFilterRenderer';
import holdingsRecordFilterRenderer from './components/HoldingsRecordFilters/holdingsRecordFilterRenderer';
import instanceFilterRenderer from './components/InstanceFilters/instanceFilterRenderer';

export const instanceFilterConfig = Object.values(filterConfigMap);

export const instanceIndexes = [
  queryIndexesMap[queryIndexes.INSTANCE_KEYWORD],
  queryIndexesMap[queryIndexes.CONTRIBUTOR],
  queryIndexesMap[queryIndexes.TITLE],
  queryIndexesMap[queryIndexes.IDENTIFIER],
  queryIndexesMap[queryIndexes.NORMALIZED_CLASSIFICATION_NUMBER],
  queryIndexesMap[queryIndexes.ISBN],
  queryIndexesMap[queryIndexes.ISSN],
  queryIndexesMap[queryIndexes.LCCN],
  queryIndexesMap[queryIndexes.OCLC],
  queryIndexesMap[queryIndexes.INSTANCE_NOTES],
  queryIndexesMap[queryIndexes.INSTANCE_ADMINISTRATIVE_NOTES],
  queryIndexesMap[queryIndexes.SUBJECT],
  queryIndexesMap[queryIndexes.CALL_NUMBER],
  queryIndexesMap[queryIndexes.INSTANCE_HRID],
  queryIndexesMap[queryIndexes.INSTANCE_ID],
  queryIndexesMap[queryIndexes.AUTHORITY_ID],
  queryIndexesMap[queryIndexes.ALL_FIELDS],
  queryIndexesMap[queryIndexes.QUERY_SEARCH],
  queryIndexesMap[queryIndexes.ADVANCED_SEARCH],
];

export const browseFiltersConfig = [
  filterConfigMap[FACETS.SHARED],
  filterConfigMap[FACETS.EFFECTIVE_LOCATION],
  filterConfigMap[FACETS.NAME_TYPE],
  {
    name: FACETS.CONTRIBUTORS_SHARED,
    cql: FACETS_CQL.INSTANCES_SHARED,
    values: [],
  },
  {
    name: FACETS.CONTRIBUTORS_HELD_BY,
    cql: FACETS_CQL.INSTANCES_HELD_BY,
    values: [],
  },
  {
    name: FACETS.SUBJECTS_SHARED,
    cql: FACETS_CQL.INSTANCES_SHARED,
    values: [],
  },
  {
    name: FACETS.SUBJECTS_HELD_BY,
    cql: FACETS_CQL.INSTANCES_HELD_BY,
    values: [],
  },
  {
    name: FACETS.CALL_NUMBERS_HELD_BY,
    cql: FACETS_CQL.HELD_BY,
    values: [],
  },
  {
    name: FACETS.CLASSIFICATION_SHARED,
    cql: FACETS_CQL.INSTANCES_SHARED,
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
  {
    label: 'ui-inventory.browse.classification',
    queryTemplate: '%{query.query}',
    subIndexes: [
      { label: 'ui-inventory.browse.classification.all', value: browseModeOptions.CLASSIFICATION_ALL },
      { label: 'ui-inventory.browse.classification.dewey', value: browseModeOptions.DEWEY_CLASSIFICATION },
      { label: 'ui-inventory.browse.classification.lc', value: browseModeOptions.LC_CLASSIFICATION },
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

export const holdingIndexes = [
  queryIndexesMap[queryIndexes.HOLDINGS_KEYWORD],
  queryIndexesMap[queryIndexes.ISBN],
  queryIndexesMap[queryIndexes.ISSN],
  queryIndexesMap[queryIndexes.HOLDINGS_FULL_CALL_NUMBERS],
  queryIndexesMap[queryIndexes.CALL_NUMBER_NORMALIZED],
  queryIndexesMap[queryIndexes.HOLDINGS_NOTES],
  queryIndexesMap[queryIndexes.HOLDINGS_ADMINISTRATIVE_NOTES],
  queryIndexesMap[queryIndexes.HOLDINGS_HRID],
  queryIndexesMap[queryIndexes.ALL_FIELDS],
  queryIndexesMap[queryIndexes.QUERY_SEARCH],
  queryIndexesMap[queryIndexes.ADVANCED_SEARCH],
];

export const holdingFilterConfig = Object.values(filterConfigMap);

export const itemIndexes = [
  queryIndexesMap[queryIndexes.ITEMS_KEYWORD],
  queryIndexesMap[queryIndexes.ITEMS_BARCODE],
  queryIndexesMap[queryIndexes.ISBN],
  queryIndexesMap[queryIndexes.ISSN],
  queryIndexesMap[queryIndexes.ITEM_FULL_CALL_NUMBERS],
  queryIndexesMap[queryIndexes.ITEM_NORMALIZED_CALL_NUMBERS],
  queryIndexesMap[queryIndexes.ITEM_NOTES],
  queryIndexesMap[queryIndexes.ITEM_ADMINISTRATIVE_NOTES],
  queryIndexesMap[queryIndexes.ITEM_CIRCULATION_NOTES],
  queryIndexesMap[queryIndexes.ITEM_HRID],
  queryIndexesMap[queryIndexes.ITEM_ID],
  queryIndexesMap[queryIndexes.ALL_FIELDS],
  queryIndexesMap[queryIndexes.QUERY_SEARCH],
  queryIndexesMap[queryIndexes.ADVANCED_SEARCH],
];

export const itemFilterConfig = Object.values(filterConfigMap);

const config = {
  [segments.instances]: {
    filters: instanceFilterConfig,
    indexes: [...instanceIndexes],
    sortMap: instanceSortMap,
    renderer: instanceFilterRenderer,
  },
  [segments.holdings]: {
    filters: holdingFilterConfig,
    indexes: holdingIndexes,
    sortMap: holdingSortMap,
    renderer: holdingsRecordFilterRenderer,
  },
  [segments.items]: {
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

export const getFilterConfig = (segment = segments.instances) => config[segment];
