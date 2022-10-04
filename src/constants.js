import React from 'react';

const AWAITING_DELIVERY = 'Awaiting delivery';
const AWAITING_PICKUP = 'Awaiting pickup';
const IN_TRANSIT = 'In transit';
const CHECKED_OUT = 'Checked out';
const AGED_TO_LOST = 'Aged to lost';

export const BROWSE_INVENTORY_ROUTE = '/inventory/browse';
export const INVENTORY_ROUTE = '/inventory';

export const searchModeSegments = {
  search: 'search',
  browse: 'browse',
};

export const searchModeRoutesMap = {
  [searchModeSegments.browse]: BROWSE_INVENTORY_ROUTE,
  [searchModeSegments.search]: INVENTORY_ROUTE,
};

export const itemStatusesMap = {
  AGED_TO_LOST,
  AVAILABLE: 'Available',
  AWAITING_PICKUP,
  AWAITING_DELIVERY,
  CHECKED_OUT,
  CLAIMED_RETURNED: 'Claimed returned',
  DECLARED_LOST: 'Declared lost',
  IN_PROCESS: 'In process',
  IN_PROCESS_NON_REQUESTABLE: 'In process (non-requestable)',
  IN_TRANSIT,
  INTELLECTUAL_ITEM: 'Intellectual item',
  LONG_MISSING: 'Long missing',
  LOST_AND_PAID: 'Lost and paid',
  MISSING: 'Missing',
  ON_ORDER: 'On order',
  ORDER_CLOSED: 'Order closed',
  PAGED: 'Paged',
  RESTRICTED: 'Restricted',
  UNAVAILABLE: 'Unavailable',
  UNKNOWN: 'Unknown',
  WITHDRAWN: 'Withdrawn',
};

// Matching mutator names to the corresponding item statuses
export const itemStatusMutators = {
  IN_PROCESS: 'markAsInProcess',
  IN_PROCESS_NON_REQUESTABLE: 'markAsInProcessNonRequestable',
  INTELLECTUAL_ITEM: 'markAsIntellectualItem',
  LONG_MISSING: 'markAsLongMissing',
  RESTRICTED: 'markAsRestricted',
  UNAVAILABLE: 'markAsUnavailable',
  UNKNOWN: 'markAsUnknown',
};

export const REQUEST_OPEN_STATUSES = {
  OPEN_AWAITING_PICKUP: `Open - ${AWAITING_PICKUP}`,
  OPEN_NOT_YET_FILLED: 'Open - Not yet filled',
  OPEN_IN_TRANSIT: `Open - ${IN_TRANSIT}`,
  OPEN_AWAITING_DELIVERY: `Open - ${AWAITING_DELIVERY}`,
};

// when item has one of these statutes it can't be deleted
// until it becomes available again.
export const NOT_REMOVABLE_ITEM_STATUSES = [
  CHECKED_OUT,
  AWAITING_PICKUP,
  AGED_TO_LOST,
];

export const itemStatuses = [
  { label: 'ui-inventory.item.status.agedToLost', value: 'Aged to lost' },
  { label: 'ui-inventory.item.status.available', value: 'Available' },
  { label: 'ui-inventory.item.status.awaitingPickup', value: 'Awaiting pickup' },
  { label: 'ui-inventory.item.status.awaitingDelivery', value: 'Awaiting delivery' },
  { label: 'ui-inventory.item.status.checkedOut', value: 'Checked out' },
  { label: 'ui-inventory.item.status.claimedReturned', value: 'Claimed returned' },
  { label: 'ui-inventory.item.status.declaredLost', value: 'Declared lost' },
  { label: 'ui-inventory.item.status.inProcess', value: 'In process' },
  { label: 'ui-inventory.item.status.inProcessNonRequestable', value: 'In process (non-requestable)' },
  { label: 'ui-inventory.item.status.inTransit', value: 'In transit' },
  { label: 'ui-inventory.item.status.intellectualItem', value: 'Intellectual item' },
  { label: 'ui-inventory.item.status.longMissing', value: 'Long missing' },
  { label: 'ui-inventory.item.status.lostAndPaid', value: 'Lost and paid' },
  { label: 'ui-inventory.item.status.missing', value: 'Missing' },
  { label: 'ui-inventory.item.status.onOrder', value: 'On order' },
  { label: 'ui-inventory.item.status.orderClosed', value: 'Order closed' },
  { label: 'ui-inventory.item.status.paged', value: 'Paged' },
  { label: 'ui-inventory.item.status.restricted', value: 'Restricted' },
  { label: 'ui-inventory.item.status.unavailable', value: 'Unavailable' },
  { label: 'ui-inventory.item.status.unknown', value: 'Unknown' },
  { label: 'ui-inventory.item.status.withdrawn', value: 'Withdrawn' },
];

export const segments = {
  instances: 'instances',
  holdings: 'holdings',
  items: 'items',
};

export const browseModeOptions = {
  CALL_NUMBERS: 'callNumbers',
  CONTRIBUTORS: 'contributors',
  SUBJECTS: 'browseSubjects',
};

export const browseModeMap = {
  callNumbers: 'callNumbers',
  contributors: 'contributors',
  browseSubjects: 'browseSubjects',
};

export const undefinedAsString = 'undefined';

export const CQL_FIND_ALL = 'cql.allRecords=1';

// this constant is used for reading the given dash character as "no value set" by a screenreader
export const noValue = (
  <span
    /* eslint-disable-next-line jsx-a11y/aria-role */
    role="text"
    aria-label="no value set"
  >
    -
  </span>
);

export const emptyList = [{}];

export const wrappingCell = { wordBreak: 'break-word' };

export const hridSettingsSections = [
  {
    type: 'instances',
    title: 'ui-inventory.hridHandling.sectionHeader1',
  },
  {
    type: 'holdings',
    title: 'ui-inventory.hridHandling.sectionHeader2',
  },
  {
    type: 'items',
    title: 'ui-inventory.hridHandling.sectionHeader3',
  },
];

export const holdingsStatementTypes = [
  {
    type: 'holdingsStatement',
    title: 'Holdings statement',
  },
  {
    type: 'holdingsStatementForSupplements',
    title: 'Holdings statement for supplements',
  },
  {
    type: 'holdingsStatementForIndexes',
    title: 'Holdings statement for indexes',
  },
];

export const queryIndexes = {
  SUBJECT: 'subject',
  QUERY_SEARCH: 'querySearch',
  CALL_NUMBER: 'callNumber',
  CONTRIBUTOR: 'contributor',
};

export const indentifierTypeNames = {
  ISBN: 'ISBN',
  ISSN: 'ISSN',
};

export const actionMenuDisplayPerms = [
  'ui-inventory.item.create',
  'ui-inventory.item.edit',
  'ui-inventory.item.delete',
  'ui-requests.create',
  'ui-inventory.items.mark-items-withdrawn',
  'ui-inventory.items.mark-intellectual-item',
  'ui-inventory.items.mark-restricted',
  'ui-inventory.items.mark-unknown',
  'ui-inventory.items.mark-unavailable',
  'ui-inventory.items.mark-long-missing',
  'ui-inventory.items.mark-in-process-non-requestable',
];

export const DATE_FORMAT = 'YYYY-MM-DD';
export const DATE_TIME_RANGE_FILTER_FORMAT = 'YYYY-MM-DDTHH:mm:ss.SSS';

export const layers = {
  CREATE: 'create',
};

export const INSTANCES_ID_REPORT_TIMEOUT = 2000;

export const QUICK_EXPORT_LIMIT = process.env.NODE_ENV !== 'test' ? 100 : 2;

export const LIMIT_MAX = 5000;

export const SORT_DIRECTION = {
  ASCENDING: 'ascending',
  DESCENDING: 'descending',
};

export const DEFAULT_FILTERS_NUMBER = 6;

export const FACETS = {
  EFFECTIVE_LOCATION: 'effectiveLocation',
  LANGUAGE: 'language',
  RESOURCE: 'resource',
  FORMAT: 'format',
  MODE: 'mode',
  NATURE_OF_CONTENT: 'natureOfContent',
  STAFF_SUPPRESS: 'staffSuppress',
  INSTANCES_DISCOVERY_SUPPRESS: 'instancesDiscoverySuppress',
  STATISTICAL_CODE_IDS: 'statisticalCodeIds',
  HOLDINGS_STATISTICAL_CODE_IDS: 'holdingsStatisticalCodeIds',
  ITEMS_STATISTICAL_CODE_IDS: 'itemsStatisticalCodeIds',
  ITEMS_DISCOVERY_SUPPRESS: 'itemsDiscoverySuppress',
  HOLDINGS_DISCOVERY_SUPPRESS: 'holdingsDiscoverySuppress',
  CREATED_DATE: 'createdDate',
  UPDATED_DATE: 'updatedDate',
  HOLDINGS_CREATED_DATE: 'holdingsCreatedDate',
  HOLDINGS_UPDATED_DATE: 'holdingsUpdatedDate',
  ITEMS_CREATED_DATE: 'itemsCreatedDate',
  ITEMS_UPDATED_DATE: 'itemsUpdatedDate',
  SOURCE: 'source',
  STATUS: 'instanceStatus',
  INSTANCES_TAGS: 'instancesTags',
  HOLDINGS_TAGS: 'holdingsTags',
  ITEMS_TAGS: 'itemsTags',
  MATERIAL_TYPE: 'materialType',
  ITEM_STATUS: 'itemStatus',
  HOLDINGS_PERMANENT_LOCATION: 'holdingsPermanentLocation',
  HOLDINGS_SOURCE: 'holdingsSource',
  NAME_TYPE: 'nameType',
  SEARCH_CONTRIBUTORS: 'searchContributors',
  HOLDINGS_TYPE: 'holdingsType',
};

export const FACETS_CQL = {
  EFFECTIVE_LOCATION: 'items.effectiveLocationId',
  LANGUAGES: 'languages',
  INSTANCE_TYPE: 'instanceTypeId',
  INSTANCE_FORMAT: 'instanceFormatIds',
  MODE_OF_ISSUANCE: 'modeOfIssuanceId',
  NATURE_OF_CONTENT: 'natureOfContentTermIds',
  STAFF_SUPPRESS: 'staffSuppress',
  STATISTICAL_CODE_IDS: 'statisticalCodeIds',
  HOLDINGS_STATISTICAL_CODE_IDS: 'holdings.statisticalCodeIds',
  ITEMS_STATISTICAL_CODE_IDS: 'items.statisticalCodeIds',
  INSTANCES_DISCOVERY_SUPPRESS: 'discoverySuppress',
  HOLDINGS_DISCOVERY_SUPPRESS: 'holdings.discoverySuppress',
  ITEMS_DISCOVERY_SUPPRESS: 'items.discoverySuppress',
  CREATED_DATE: 'metadata.createdDate',
  UPDATED_DATE: 'metadata.updatedDate',
  HOLDINGS_CREATED_DATE: 'holdings.metadata.createdDate',
  HOLDINGS_UPDATED_DATE: 'holdings.metadata.updatedDate',
  ITEMS_CREATED_DATE: 'items.metadata.createdDate',
  ITEMS_UPDATED_DATE: 'items.metadata.updatedDate',
  SOURCE: 'source',
  STATUS: 'statusId',
  INSTANCES_TAGS: 'instanceTags',
  HOLDINGS_TAGS: 'holdingsTags',
  ITEMS_TAGS: 'itemTags',
  MATERIAL_TYPES: 'items.materialTypeId',
  ITEMS_STATUSES: 'items.status.name',
  HOLDINGS_PERMANENT_LOCATION: 'holdings.permanentLocationId',
  HOLDINGS_SOURCE: 'holdings.sourceId',
  NAME_TYPE: 'contributorNameTypeId',
  SEARCH_CONTRIBUTORS: 'contributors.contributorNameTypeId',
  HOLDINGS_TYPE: 'holdings.holdingsTypeId',
};

export const FACETS_TO_REQUEST = {
  [FACETS.EFFECTIVE_LOCATION]: FACETS_CQL.EFFECTIVE_LOCATION,
  [FACETS.LANGUAGE]: FACETS_CQL.LANGUAGES,
  [FACETS.RESOURCE]: FACETS_CQL.INSTANCE_TYPE,
  [FACETS.FORMAT]: FACETS_CQL.INSTANCE_FORMAT,
  [FACETS.MODE]: FACETS_CQL.MODE_OF_ISSUANCE,
  [FACETS.NATURE_OF_CONTENT]: FACETS_CQL.NATURE_OF_CONTENT,
  [FACETS.STAFF_SUPPRESS]: FACETS_CQL.STAFF_SUPPRESS,
  [FACETS.INSTANCES_DISCOVERY_SUPPRESS]: FACETS_CQL.INSTANCES_DISCOVERY_SUPPRESS,
  [FACETS.HOLDINGS_DISCOVERY_SUPPRESS]: FACETS_CQL.HOLDINGS_DISCOVERY_SUPPRESS,
  [FACETS.ITEMS_DISCOVERY_SUPPRESS]: FACETS_CQL.ITEMS_DISCOVERY_SUPPRESS,
  [FACETS.SOURCE]: FACETS_CQL.SOURCE,
  [FACETS.STATUS]: FACETS_CQL.STATUS,
  [FACETS.INSTANCES_TAGS]: FACETS_CQL.INSTANCES_TAGS,
  [FACETS.ITEMS_TAGS]: FACETS_CQL.ITEMS_TAGS,
  [FACETS.HOLDINGS_TAGS]: FACETS_CQL.HOLDINGS_TAGS,
  [FACETS.MATERIAL_TYPE]: FACETS_CQL.MATERIAL_TYPES,
  [FACETS.ITEM_STATUS]: FACETS_CQL.ITEMS_STATUSES,
  [FACETS.HOLDINGS_PERMANENT_LOCATION]: FACETS_CQL.HOLDINGS_PERMANENT_LOCATION,
  [FACETS.CREATED_DATE]: FACETS_CQL.CREATED_DATE,
  [FACETS.UPDATED_DATE]: FACETS_CQL.UPDATED_DATE,
  [FACETS.HOLDINGS_CREATED_DATE]: FACETS_CQL.HOLDINGS_CREATED_DATE,
  [FACETS.HOLDINGS_UPDATED_DATE]: FACETS_CQL.HOLDINGS_UPDATED_DATE,
  [FACETS.HOLDINGS_SOURCE]: FACETS_CQL.HOLDINGS_SOURCE,
  [FACETS.ITEMS_CREATED_DATE]: FACETS_CQL.ITEMS_CREATED_DATE,
  [FACETS.ITEMS_UPDATED_DATE]: FACETS_CQL.ITEMS_UPDATED_DATE,
  [FACETS.STATISTICAL_CODE_IDS]: FACETS_CQL.STATISTICAL_CODE_IDS,
  [FACETS.HOLDINGS_STATISTICAL_CODE_IDS]: FACETS_CQL.HOLDINGS_STATISTICAL_CODE_IDS,
  [FACETS.ITEMS_STATISTICAL_CODE_IDS]: FACETS_CQL.ITEMS_STATISTICAL_CODE_IDS,
  [FACETS.NAME_TYPE]: FACETS_CQL.NAME_TYPE,
  [FACETS.HOLDINGS_TYPE]: FACETS_CQL.HOLDINGS_TYPE,
};

const INSTANCES_FACET_ENDPOINT = 'search/instances/facets';
const CONTRIBUTORS_FACET_ENDPOINT = 'search/contributors/facets';

export const FACETS_ENDPOINTS = {
  [FACETS.EFFECTIVE_LOCATION]: INSTANCES_FACET_ENDPOINT,
  [FACETS.LANGUAGE]: INSTANCES_FACET_ENDPOINT,
  [FACETS.RESOURCE]: INSTANCES_FACET_ENDPOINT,
  [FACETS.FORMAT]: INSTANCES_FACET_ENDPOINT,
  [FACETS.MODE]: INSTANCES_FACET_ENDPOINT,
  [FACETS.NATURE_OF_CONTENT]: INSTANCES_FACET_ENDPOINT,
  [FACETS.STAFF_SUPPRESS]: INSTANCES_FACET_ENDPOINT,
  [FACETS.INSTANCES_DISCOVERY_SUPPRESS]: INSTANCES_FACET_ENDPOINT,
  [FACETS.HOLDINGS_DISCOVERY_SUPPRESS]: INSTANCES_FACET_ENDPOINT,
  [FACETS.ITEMS_DISCOVERY_SUPPRESS]: INSTANCES_FACET_ENDPOINT,
  [FACETS.SOURCE]: INSTANCES_FACET_ENDPOINT,
  [FACETS.STATUS]: INSTANCES_FACET_ENDPOINT,
  [FACETS.INSTANCES_TAGS]: INSTANCES_FACET_ENDPOINT,
  [FACETS.ITEMS_TAGS]: INSTANCES_FACET_ENDPOINT,
  [FACETS.HOLDINGS_TAGS]: INSTANCES_FACET_ENDPOINT,
  [FACETS.MATERIAL_TYPE]: INSTANCES_FACET_ENDPOINT,
  [FACETS.ITEM_STATUS]: INSTANCES_FACET_ENDPOINT,
  [FACETS.HOLDINGS_PERMANENT_LOCATION]: INSTANCES_FACET_ENDPOINT,
  [FACETS.CREATED_DATE]: INSTANCES_FACET_ENDPOINT,
  [FACETS.UPDATED_DATE]: INSTANCES_FACET_ENDPOINT,
  [FACETS.HOLDINGS_CREATED_DATE]: INSTANCES_FACET_ENDPOINT,
  [FACETS.HOLDINGS_UPDATED_DATE]: INSTANCES_FACET_ENDPOINT,
  [FACETS.HOLDINGS_SOURCE]: INSTANCES_FACET_ENDPOINT,
  [FACETS.ITEMS_CREATED_DATE]: INSTANCES_FACET_ENDPOINT,
  [FACETS.ITEMS_UPDATED_DATE]: INSTANCES_FACET_ENDPOINT,
  [FACETS.STATISTICAL_CODE_IDS]: INSTANCES_FACET_ENDPOINT,
  [FACETS.HOLDINGS_STATISTICAL_CODE_IDS]: INSTANCES_FACET_ENDPOINT,
  [FACETS.ITEMS_STATISTICAL_CODE_IDS]: INSTANCES_FACET_ENDPOINT,
  [FACETS.NAME_TYPE]: CONTRIBUTORS_FACET_ENDPOINT,
  [FACETS.HOLDINGS_TYPE]: INSTANCES_FACET_ENDPOINT,
};

export const FACETS_OPTIONS = {
  EFFECTIVE_LOCATION_OPTIONS: 'effectiveLocationOptions',
  LANG_OPTIONS: 'langOptions',
  RESOURCE_TYPE_OPTIONS: 'resourceTypeOptions',
  FORMAT_OPTIONS: 'instanceFormatOptions',
  MODE_OF_ISSUANCE_OPTIONS: 'modeOfIssuanceOptions',
  NATURE_OF_CONTENT_OPTIONS: 'natureOfContentOptions',
  SUPPRESSED_OPTIONS: 'suppressedOptions',
  INSTANCES_DISCOVERY_SUPPRESS_OPTIONS: 'discoverySuppressOptions',
  HOLDINGS_DISCOVERY_SUPPRESS_OPTIONS: 'discoverySuppressOptions',
  ITEMS_DISCOVERY_SUPPRESS_OPTIONS: 'discoverySuppressOptions',
  SOURCE_OPTIONS: 'sourceOptions',
  STATUS_OPTIONS: 'statusOptions',
  INSTANCES_TAGS_OPTIONS: 'tagsRecords',
  HOLDINGS_TAGS_OPTIONS: 'tagsRecords',
  ITEMS_TAGS_OPTIONS: 'tagsRecords',
  MATERIAL_TYPES_OPTIONS: 'materialTypesOptions',
  ITEMS_STATUSES_OPTIONS: 'itemStatusesOptions',
  HOLDINGS_PERMANENT_LOCATION_OPTIONS: 'holdingsPermanentLocationOptions',
  STATISTICAL_CODES_OPTIONS: 'statisticalCodesOptions',
  HOLDINGS_SOURCE_OPTIONS: 'holdingsSourceOptions',
  STATUSES_OPTIONS: 'instanceStatusesOptions',
  NAME_TYPE_OPTIONS: 'nameTypeOptions',
  HOLDINGS_TYPE_OPTIONS: 'holdingsTypeOptions',
};

export const FACETS_SETTINGS = {
  [FACETS_CQL.EFFECTIVE_LOCATION]: FACETS_OPTIONS.EFFECTIVE_LOCATION_OPTIONS,
  [FACETS_CQL.LANGUAGES]: FACETS_OPTIONS.LANG_OPTIONS,
  [FACETS_CQL.INSTANCE_TYPE]: FACETS_OPTIONS.RESOURCE_TYPE_OPTIONS,
  [FACETS_CQL.INSTANCE_FORMAT]: FACETS_OPTIONS.FORMAT_OPTIONS,
  [FACETS_CQL.MODE_OF_ISSUANCE]: FACETS_OPTIONS.MODE_OF_ISSUANCE_OPTIONS,
  [FACETS_CQL.NATURE_OF_CONTENT]: FACETS_OPTIONS.NATURE_OF_CONTENT_OPTIONS,
  [FACETS_CQL.STAFF_SUPPRESS]: FACETS_OPTIONS.SUPPRESSED_OPTIONS,
  [FACETS_CQL.INSTANCES_DISCOVERY_SUPPRESS]: FACETS_OPTIONS.INSTANCES_DISCOVERY_SUPPRESS_OPTIONS,
  [FACETS_CQL.HOLDINGS_DISCOVERY_SUPPRESS]: FACETS_OPTIONS.HOLDINGS_DISCOVERY_SUPPRESS_OPTIONS,
  [FACETS_CQL.ITEMS_DISCOVERY_SUPPRESS]: FACETS_OPTIONS.ITEMS_DISCOVERY_SUPPRESS_OPTIONS,
  [FACETS_CQL.SOURCE]: FACETS_OPTIONS.SOURCE_OPTIONS,
  [FACETS_CQL.STATUS]: FACETS_OPTIONS.STATUSES_OPTIONS,
  [FACETS_CQL.INSTANCES_TAGS]: FACETS_OPTIONS.INSTANCES_TAGS_OPTIONS,
  [FACETS_CQL.HOLDINGS_TAGS]: FACETS_OPTIONS.HOLDINGS_TAGS_OPTIONS,
  [FACETS_CQL.ITEMS_TAGS]: FACETS_OPTIONS.ITEMS_TAGS_OPTIONS,
  [FACETS_CQL.MATERIAL_TYPES]: FACETS_OPTIONS.MATERIAL_TYPES_OPTIONS,
  [FACETS_CQL.ITEMS_STATUSES]: FACETS_OPTIONS.ITEMS_STATUSES_OPTIONS,
  [FACETS_CQL.HOLDINGS_PERMANENT_LOCATION]: FACETS_OPTIONS.HOLDINGS_PERMANENT_LOCATION_OPTIONS,
  [FACETS_CQL.STATISTICAL_CODE_IDS]: FACETS_OPTIONS.STATISTICAL_CODES_OPTIONS,
  [FACETS_CQL.HOLDINGS_STATISTICAL_CODE_IDS]: FACETS_OPTIONS.STATISTICAL_CODES_OPTIONS,
  [FACETS_CQL.ITEMS_STATISTICAL_CODE_IDS]: FACETS_OPTIONS.STATISTICAL_CODES_OPTIONS,
  [FACETS_CQL.HOLDINGS_SOURCE]: FACETS_OPTIONS.HOLDINGS_SOURCE_OPTIONS,
  [FACETS_CQL.NAME_TYPE]: FACETS_OPTIONS.NAME_TYPE_OPTIONS,
  [FACETS_CQL.HOLDINGS_TYPE]: FACETS_OPTIONS.HOLDINGS_TYPE_OPTIONS,
};

export const ERROR_TYPES = {
  OPTIMISTIC_LOCKING: 'optimisticLocking',
};

export const QUERY_INDEXES = {
  INSTANCE_HRID: 'hrid',
  BARCODE: 'items.barcode',
};

export const PAGE_DIRECTIONS = {
  prev: 'prev',
  next: 'next',
};

export const BROWSE_RESULTS_COUNT = 100;

export const ORDERS_API = 'orders/composite-orders';
