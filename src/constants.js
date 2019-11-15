import React from 'react';

const AWAITING_DELIVERY = 'Awaiting delivery';
const AWAITING_PICKUP = 'Awaiting pickup';
const IN_TRANSIT = 'In transit';

export const itemStatusesMap = {
  CHECKED_OUT: 'Checked out',
  ON_ORDER: 'On order',
  AVAILABLE: 'Available',
  IN_TRANSIT,
  IN_PROCESS: 'In process',
  AWAITING_PICKUP,
  PAGED: 'Paged',
};

export const requestStatuses = {
  OPEN_AWAITING_PICKUP: `Open - ${AWAITING_PICKUP}`,
  OPEN_NOT_YET_FILLED: 'Open - Not yet filled',
  OPEN_IN_TRANSIT: `Open - ${IN_TRANSIT}`,
  OPEN_AWAITING_DELIVERY: `Open - ${AWAITING_DELIVERY}`,
};

// the empty 'values' properties will be filled in by componentWillUpdate
// as those are pulled from the backend
export const instanceFilterConfig = [
  {
    name: 'language',
    cql: 'languages',
    values: [],
  },
  {
    name: 'resource',
    cql: 'instanceTypeId',
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
  },
  {
    name: 'discoverySuppress',
    cql: 'discoverySuppress',
    values: [],
  },
];

export const instanceIndexes = [
  { label: 'ui-inventory.search.all', value: 'all', queryTemplate: 'title all "%{query.query}" or contributors =/@name "%{query.query}" or identifiers =/@value "%{query.query}"' },
  { label: 'ui-inventory.barcode', value: 'item.barcode', queryTemplate: 'item.barcode=="%{query.query}"' },
  { label: 'ui-inventory.instanceId', value: 'id', queryTemplate: 'id="%{query.query}"' },
  { label: 'ui-inventory.title', value: 'title', queryTemplate: 'title all "%{query.query}"' },
  { label: 'ui-inventory.identifier', value: 'identifier', queryTemplate: 'identifiers =/@value "%{query.query}"' },
  { label: 'ui-inventory.isbn', prefix: '- ', value: 'isbn', queryTemplate: 'identifiers =/@value/@identifierTypeId="<%= identifierTypeId %>" "%{query.query}"' },
  { label: 'ui-inventory.issn', prefix: '- ', value: 'issn', queryTemplate: 'identifiers =/@value/@identifierTypeId="<%= identifierTypeId %>" "%{query.query}"' },
  { label: 'ui-inventory.contributor', value: 'contributor', queryTemplate: 'contributors =/@name "%{query.query}"' },
  { label: 'ui-inventory.subject', value: 'subject', queryTemplate: 'subjects="%{query.query}"' },
  { label: 'ui-inventory.querySearch', value: 'querySearch', queryTemplate: '%{query.query}' },
];

export const instanceSortMap = {
  Title: 'title',
  publishers: 'publication',
  Contributors: 'contributors',
};

export const holdingIndexes = [
  { label: 'ui-inventory.querySearch', value: 'querySearch', queryTemplate: '%{query.query}' },
];

export const holdingSortMap = {};

export const holdingFilterConfig = [
  {
    name: 'holdingsPermanentLocation',
    cql: 'holdingsRecords.permanentLocationId',
    values: [],
  },
  {
    name: 'discoverySuppress',
    cql: 'holdingsRecords.discoverySuppress',
    values: [],
  },
];

export const itemIndexes = [
  { label: 'ui-inventory.contributor', value: 'contributor', queryTemplate: 'contributors =/@name "%{query.query}"' },
  { label: 'ui-inventory.title', value: 'title', queryTemplate: 'title all "%{query.query}"' },
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
  }
];

export const itemSortMap = {
  Title: 'title',
  publishers: 'publication',
  Contributors: 'contributors',
};

export const itemStatuses = [
  { label: 'ui-inventory.item.status.available', value: 'Available' },
  { label: 'ui-inventory.item.status.awaitingPickup', value: 'Awaiting pickup' },
  { label: 'ui-inventory.item.status.checkedOut', value: 'Checked out' },
  { label: 'ui-inventory.item.status.inProcess', value: 'In process' },
  { label: 'ui-inventory.item.status.inTransit', value: 'In transit' },
  { label: 'ui-inventory.item.status.missing', value: 'Missing' },
  { label: 'ui-inventory.item.status.onOrder', value: 'On order' },
  { label: 'ui-inventory.item.status.paged', value: 'Paged' },
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

export const wrappingCell = { 'word-break': 'break-word' };
