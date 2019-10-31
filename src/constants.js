import React from 'react';
import { FormattedMessage } from 'react-intl';

const AWAITING_DELIVERY = 'Awaiting delivery';
const AWAITING_PICKUP = 'Awaiting pickup';
const IN_TRANSIT = 'In transit';
export const itemStatuses = {
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
export const filterConfig = [
  {
    label: <FormattedMessage id="ui-inventory.instances.language" />,
    name: 'language',
    cql: 'languages',
    values: [],
  },
  {
    label: <FormattedMessage id="ui-inventory.instances.resourceType" />,
    name: 'resource',
    cql: 'instanceTypeId',
    values: [],
  },
  {
    label: <FormattedMessage id="ui-inventory.instances.location" />,
    name: 'location',
    cql: 'holdingsRecords.permanentLocationId',
    values: [],
  },
];

export const instanceIndexes = [
  { label: 'ui-inventory.search.all', value: 'all', queryTemplate: 'title="%{query.query}" or contributors =/@name "%{query.query}" or identifiers =/@value "%{query.query}"' },
  { label: 'ui-inventory.barcode', value: 'item.barcode', queryTemplate: 'item.barcode=="%{query.query}"' },
  { label: 'ui-inventory.instanceId', value: 'id', queryTemplate: 'id="%{query.query}"' },
  { label: 'ui-inventory.title', value: 'title', queryTemplate: 'title="%{query.query}"' },
  { label: 'ui-inventory.identifier', value: 'identifier', queryTemplate: 'identifiers =/@value "%{query.query}"' },
  { label: 'ui-inventory.isbn', prefix: '- ', value: 'isbn', queryTemplate: 'identifiers =/@value/@identifierTypeId="<%= identifierTypeId %>" "%{query.query}"' },
  { label: 'ui-inventory.issn', prefix: '- ', value: 'issn', queryTemplate: 'identifiers =/@value/@identifierTypeId="<%= identifierTypeId %>" "%{query.query}"' },
  { label: 'ui-inventory.contributor', value: 'contributor', queryTemplate: 'contributors =/@name "%{query.query}"' },
  { label: 'ui-inventory.subject', value: 'subject', queryTemplate: 'subjects="%{query.query}"' },
];

export const holdingIndexes = [
  // TODO: add holding indexes
];

export const itemIndexes = [
  // TODO: add item indexes
];

export const segments = {
  instances: 'instances',
  holdings: 'holdings',
  items: 'items',
};
