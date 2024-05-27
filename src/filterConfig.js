import {
  ADVANCED_SEARCH_INDEX,
  browseModeOptions,
  filterConfigMap,
} from '@folio/stripes-inventory-components';

import itemFilterRenderer from './components/ItemFilters/itemFilterRenderer';
import holdingsRecordFilterRenderer from './components/HoldingsRecordFilters/holdingsRecordFilterRenderer';
import instanceFilterRenderer from './components/InstanceFilters/instanceFilterRenderer';

export const instanceFilterConfig = Object.values(filterConfigMap);

export const instanceIndexes = [
  // NOTE: the 'all' value was first used for a 'keyword all' query, but then
  // a *real* 'all' query option was added ('allInstances any'). That was given the value `allFields`
  // instead. It might make sense to rename the keyword option to something like `keywordAll`
  // but, without tracing the use of the value, I don't know what effects that would have in the code.
  { label: 'ui-inventory.search.all', value: 'all', queryTemplate: 'keyword all "%{query.query}" or isbn="%{query.query}" or hrid=="%{query.query}" or id=="%{query.query}"' },
  { label: 'ui-inventory.contributor', value: 'contributor', queryTemplate: 'contributors.name="%{query.query}"' },
  { label: 'ui-inventory.title', value: 'title', queryTemplate: 'title all "%{query.query}"' },
  { label: 'ui-inventory.identifierAll', value: 'identifier', queryTemplate: 'identifiers.value="%{query.query}" or isbn="%{query.query}"' },
  { label: 'ui-inventory.normalizedClassificationNumber', value: 'normalizedClassificationNumber', queryTemplate: 'normalizedClassificationNumber=="%{query.query}"' },
  { label: 'ui-inventory.isbn', value: 'isbn', queryTemplate: 'isbn="%{query.query}"' },
  { label: 'ui-inventory.issn', value: 'issn', queryTemplate: 'issn="%{query.query}"' },
  { label: 'ui-inventory.lccn', value: 'lccn', queryTemplate: 'lccn="%{query.query}"' },
  { label: 'ui-inventory.search.oclc', value: 'oclc', queryTemplate: 'oclc="%{query.query}"' },
  { label: 'ui-inventory.search.instanceNotes', value: 'instanceNotes', queryTemplate: 'notes.note all "%{query.query}" or administrativeNotes all "%{query.query}"' },
  { label: 'ui-inventory.search.instanceAdministrativeNotes', value: 'instanceAdministrativeNotes', queryTemplate: 'administrativeNotes all "%{query.query}"' },
  { label: 'ui-inventory.subject', value: 'subject', queryTemplate: 'subjects.value==/string "%{query.query}"' },
  { label: 'ui-inventory.effectiveCallNumberShelving', value: 'callNumber', queryTemplate: 'itemEffectiveShelvingOrder==/string "%{query.query}"' },
  { label: 'ui-inventory.instanceHrid', value: 'hrid', queryTemplate: 'hrid=="%{query.query}"' },
  { label: 'ui-inventory.instanceId', value: 'id', queryTemplate: 'id="%{query.query}"' },
  { label: 'ui-inventory.authorityId', value: 'authorityId', queryTemplate: 'authorityId == %{query.query}' },
  { label: 'ui-inventory.search.allFields', value: 'allFields', queryTemplate: 'cql.all="%{query.query}"' },
  { label: 'ui-inventory.querySearch', value: 'querySearch', queryTemplate: '%{query.query}' },
  { label: 'ui-inventory.advancedSearch', value: ADVANCED_SEARCH_INDEX, queryTemplate: '%{query.query}' },
];

export const browseFiltersConfig = Object.values(filterConfigMap);

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
  { label: 'ui-inventory.search.allFields', value: 'allFields', queryTemplate: 'cql.all="%{query.query}"' },
  { label: 'ui-inventory.querySearch', value: 'querySearch', queryTemplate: '%{query.query}' },
  { label: 'ui-inventory.advancedSearch', value: ADVANCED_SEARCH_INDEX, queryTemplate: '%{query.query}' },
];

export const holdingSortMap = {};

export const holdingFilterConfig = Object.values(filterConfigMap);

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
  { label: 'ui-inventory.search.allFields', value: 'allFields', queryTemplate: 'cql.all="%{query.query}"' },
  { label: 'ui-inventory.querySearch', value: 'querySearch', queryTemplate: '%{query.query}' },
  { label: 'ui-inventory.advancedSearch', value: ADVANCED_SEARCH_INDEX, queryTemplate: '%{query.query}' },
];

export const itemFilterConfig = Object.values(filterConfigMap);

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
