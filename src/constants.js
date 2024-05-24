import React from 'react';

import {
  ADVANCED_SEARCH_INDEX,
  browseModeOptions,
} from '@folio/stripes-inventory-components';

const AWAITING_DELIVERY = 'Awaiting delivery';
const AWAITING_PICKUP = 'Awaiting pickup';
const IN_TRANSIT = 'In transit';
const CHECKED_OUT = 'Checked out';
const AGED_TO_LOST = 'Aged to lost';
const CLAIMED_RETURNED = 'Claimed returned';
const DECLARED_LOST = 'Declared lost';

export const BROWSE_INVENTORY_ROUTE = '/inventory/browse';
export const INVENTORY_ROUTE = '/inventory';
export const DATA_IMPORT_JOB_PROFILES_ROUTE = 'data-import-profiles/jobProfiles';

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
  CLAIMED_RETURNED,
  DECLARED_LOST,
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
  CLAIMED_RETURNED,
  AWAITING_DELIVERY,
  DECLARED_LOST,
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

export const INDEXES_WITH_CALL_NUMBER_TYPE_PARAM = [
  browseModeOptions.DEWEY,
  browseModeOptions.LIBRARY_OF_CONGRESS,
  browseModeOptions.LOCAL,
  browseModeOptions.NATIONAL_LIBRARY_OF_MEDICINE,
  browseModeOptions.OTHER,
  browseModeOptions.SUPERINTENDENT,
];

export const undefinedAsString = 'undefined';

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

export const SORTABLE_SEARCH_RESULT_LIST_COLUMNS = {
  TITLE: 'title',
  CONTRIBUTORS: 'contributors',
  RELEVANCE: 'relevance',
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
export const NOTE_CHARS_MAX_LENGTH = 32000;

export const ORDERS_API = 'orders/composite-orders';

export const SYSTEM_USER_ID = '00000000-0000-0000-0000-000000000000';
export const SYSTEM_USER_NAME = 'System';

export const SINGLE_ITEM_QUERY_TEMPLATES = {
  'items.barcode': 'barcode=="%{query}"',
  isbn: 'isbn=="%{query}"',
  issn: 'issn=="%{query}"',
  itemHrid: 'hrid=="%{query}"',
  iid: 'id=="%{query}"',
};

export const RECORD_SOURCE = {
  CONSORTIUM: 'consortium',
  FOLIO: 'folio',
  INN_REACH: 'inn-reach',
  LOCAL: 'local',
  MARC_RELATOR: 'marcrelator',
  RDA_CARRIER: 'rdacarrier',
  RDA_CONTENT: 'rdacontent',
  RDA_MODE_ISSUE: 'rdamodeissue',
  SYSTEM: 'system',
  UC: 'UC',
};

export const SOURCE_VALUES = {
  MARC: 'MARC',
  FOLIO: 'FOLIO',
  'CONSORTIUM-MARC': 'MARC-shared',
  'CONSORTIUM-FOLIO': 'FOLIO-shared',
};

export const CONSORTIUM_PREFIX = 'CONSORTIUM-';
export const OKAPI_TENANT_HEADER = 'X-Okapi-Tenant';
export const OKAPI_TOKEN_HEADER = 'X-Okapi-Token';
export const CONTENT_TYPE_HEADER = 'Content-Type';

export const DEFAULT_ITEM_TABLE_SORTBY_FIELD = 'barcode';
export const ITEM_TABLE_PAGE_AMOUNT = 200;

export const AUTHORITY_LINKED_FIELDS = [
  'alternativeTitles',
  'contributors',
  'subjects',
  'series',
];

export const INSTANCE_SHARING_STATUSES = {
  COMPLETE: 'COMPLETE',
  ERROR: 'ERROR',
  IN_PROGRESS: 'IN_PROGRESS',
};

export const HTTP_RESPONSE_STATUS_CODES = {
  FORBIDDEN: 403,
};

export const EVENTS = {
  SWITCH_ACTIVE_AFFILIATION: 'SWITCH_ACTIVE_AFFILIATION',
};

export const LEADER_RECORD_STATUSES = {
  DELETED: 'd',
};

export const USER_TOUCHED_STAFF_SUPPRESS_STORAGE_KEY = 'folio_user_touched_staff_suppress';

export const ACQUISITION_COLUMN_NAMES = {
  poLineNumber: 'poLineNumber',
  orderStatus: 'orderStatus',
  polReceiptStatus: 'polReceiptStatus',
  dateOrdered: 'dateOrdered',
  acqUnit: 'acqUnit',
  orderType: 'orderType',
};
