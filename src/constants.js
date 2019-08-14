import React from 'react';
import { FormattedMessage } from 'react-intl';

export const itemStatuses = {
  CHECKED_OUT: 'Checked out',
  ON_ORDER: 'On order',
  AVAILABLE: 'Available',
  IN_TRANSIT: 'In transit',
  IN_PROCESS: 'In process',
  AWAITING_PICKUP: 'Awaiting pickup',
  PAGED: 'Paged',
};

export const itemDamageStatuses = [
  {
    label: 'ui-inventory.items.damageStatus.damaged',
    value: 'Damaged',
  },
  {
    label: 'ui-inventory.items.damageStatus.notdamaged',
    value: 'Not damaged',
  },
];

export const languages = [
  { code: 'eng', name: 'English' },
  { code: 'spa', name: 'Spanish' },
  { code: 'fre', name: 'French' },
  { code: 'ger', name: 'German' },
  { code: 'chi', name: 'Mandarin' },
  { code: 'rus', name: 'Russian' },
  { code: 'ara', name: 'Arabic' },
];

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

export const searchableIndexes = [
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


export default {};
