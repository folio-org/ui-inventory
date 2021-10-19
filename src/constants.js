import React from 'react';
import { FormattedMessage } from 'react-intl';

const AWAITING_DELIVERY = 'Awaiting delivery';
const AWAITING_PICKUP = 'Awaiting pickup';
const IN_TRANSIT = 'In transit';

export const itemStatusesMap = {
  AGED_TO_LOST: 'Aged to lost',
  AVAILABLE: 'Available',
  AWAITING_PICKUP,
  AWAITING_DELIVERY,
  CHECKED_OUT: 'Checked out',
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

export const requestStatuses = {
  OPEN_AWAITING_PICKUP: `Open - ${AWAITING_PICKUP}`,
  OPEN_NOT_YET_FILLED: 'Open - Not yet filled',
  OPEN_IN_TRANSIT: `Open - ${IN_TRANSIT}`,
  OPEN_AWAITING_DELIVERY: `Open - ${AWAITING_DELIVERY}`,
};

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

export const layers = {
  CREATE: 'create',
};

export const INSTANCES_ID_REPORT_TIMEOUT = 2000;

export const QUICK_EXPORT_LIMIT = process.env.NODE_ENV !== 'test' ? 100 : 2;

export const LIMIT_MAX = 5000;

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
  ITEMS_DISCOVERY_SUPPRESS: 'itemsDiscoverySuppress',
  HOLDINGS_DISCOVERY_SUPPRESS: 'holdingsDiscoverySuppress',
  CREATED_DATE: 'createdDate',
  UPDATED_DATE: 'updatedDate',
  SOURCE: 'source',
  INSTANCES_TAGS: 'instancesTags',
  HOLDINGS_TAGS: 'holdingsTags',
  ITEMS_TAGS: 'itemsTags',
  MATERIAL_TYPE: 'materialType',
  ITEM_STATUS: 'itemStatus',
  HOLDINGS_PERMANENT_LOCATION: 'holdingsPermanentLocation',
};

export const FACETS_CQL = {
  EFFECTIVE_LOCATION: 'items.effectiveLocationId',
  LANGUAGES: 'languages',
  INSTANCE_TYPE: 'instanceTypeId',
  INSTANCE_FORMAT: 'instanceFormatId',
  MODE_OF_ISSUANCE: 'modeOfIssuanceId',
  NATURE_OF_CONTENT: 'natureOfContentTermIds',
  STAFF_SUPPRESS: 'staffSuppress',
  INSTANCES_DISCOVERY_SUPPRESS: 'discoverySuppress',
  HOLDINGS_DISCOVERY_SUPPRESS: 'holdings.discoverySuppress',
  ITEMS_DISCOVERY_SUPPRESS: 'items.discoverySuppress',
  CREATED_DATE: 'metadata.createdDate',
  UPDATED_DATE: 'metadata.updatedDate',
  SOURCE: 'source',
  INSTANCES_TAGS: 'instanceTags',
  HOLDINGS_TAGS: 'holdingTags',
  ITEMS_TAGS: 'itemTags',
  MATERIAL_TYPES: 'items.materialTypeId',
  ITEMS_STATUSES: 'items.status.name',
  HOLDINGS_PERMANENT_LOCATION: 'holdings.permanentLocationId'
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
  [FACETS.INSTANCES_TAGS]: FACETS_CQL.INSTANCES_TAGS,
  [FACETS.ITEMS_TAGS]: FACETS_CQL.ITEMS_TAGS,
  [FACETS.HOLDINGS_TAGS]: FACETS_CQL.HOLDINGS_TAGS,
  [FACETS.MATERIAL_TYPE]: FACETS_CQL.MATERIAL_TYPES,
  [FACETS.ITEM_STATUS]: FACETS_CQL.ITEMS_STATUSES,
  [FACETS.HOLDINGS_PERMANENT_LOCATION]: FACETS_CQL.HOLDINGS_PERMANENT_LOCATION,
  [FACETS.CREATED_DATE]: FACETS_CQL.CREATED_DATE,
  [FACETS.UPDATED_DATE]: FACETS_CQL.UPDATED_DATE,
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
  INSTANCES_TAGS_OPTIONS: 'tagsRecords',
  HOLDINGS_TAGS_OPTIONS: 'tagsRecords',
  ITEMS_TAGS_OPTIONS: 'tagsRecords',
  MATERIAL_TYPES_OPTIONS: 'materialTypesOptions',
  ITEMS_STATUSES_OPTIONS: 'itemStatusesOptions',
  HOLDINGS_PERMANENT_LOCATION_OPTIONS: 'holdingsPermanentLocationOptions',
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
  [FACETS_CQL.INSTANCES_TAGS]: FACETS_OPTIONS.INSTANCES_TAGS_OPTIONS,
  [FACETS_CQL.HOLDINGS_TAGS]: FACETS_OPTIONS.HOLDINGS_TAGS_OPTIONS,
  [FACETS_CQL.ITEMS_TAGS]: FACETS_OPTIONS.ITEMS_TAGS_OPTIONS,
  [FACETS_CQL.MATERIAL_TYPES]: FACETS_OPTIONS.MATERIAL_TYPES_OPTIONS,
  [FACETS_CQL.ITEMS_STATUSES]: FACETS_OPTIONS.ITEMS_STATUSES_OPTIONS,
  [FACETS_CQL.HOLDINGS_PERMANENT_LOCATION]: FACETS_OPTIONS.HOLDINGS_PERMANENT_LOCATION_OPTIONS,
};

const commandsMap = {
  expandCollapse: 'spacebar',
  close: 'esc',
  copy: 'mod+c',
  cut: 'mod+x',
  paste: 'mod+v',
  find: 'mod+f',
};

export const commands = Object.entries(commandsMap).map(([name, shortcut]) => ({
  name,
  label: <FormattedMessage id={`ui-inventory.shortcut.${name}`} />,
  shortcut,
}));
