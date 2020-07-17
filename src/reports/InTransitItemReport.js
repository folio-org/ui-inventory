import { get } from 'lodash';

import { exportCsv } from '@folio/stripes/util';

const columns = [
  'barcode',
  'title',
  'contributors',
  'library',
  'shelvingLocation',
  'shelvingLocationCode',
  'callNumberPrefix',
  'callNumber',
  'callNumberSuffix',
  'enumeration',
  'volume',
  'yearCaption',
  'copyNumber',
  'itemStatus',
  'checkInServicePoint',
  'checkInDateTime',
  'destinationServicePoint',
  'requestType',
  'requesterPatronGroup',
  'requestCreationDate',
  'requestExpirationDate',
  'requestPickupServicePoint',
  'tags',
];

class InTransitItemsReport {
  constructor({ formatMessage }) {
    this.columnsMap = columns.map(value => ({
      label: formatMessage({ id: `ui-inventory.reports.inTransitItem.${value}` }),
      value,
    }));
  }

  parse(records) {
    return records.map(record => {
      return {
        barcode: get(record, 'barcode'),
        title: get(record, 'title'),
        contributors: get(record, 'contributors', []).map(({ name }) => name).join(';'),
        library: get(record, 'location.libraryName'),
        shelvingLocation: get(record, 'location.name'),
        shelvingLocationCode: get(record, 'location.code'),
        callNumberPrefix: get(record, 'effectiveCallNumberComponents.prefix'),
        callNumber: get(record, 'callNumber'),
        callNumberSuffix: get(record, 'effectiveCallNumberComponents.suffix'),
        enumeration: get(record, 'enumeration'),
        volume: get(record, 'volume'),
        yearCaption: get(record, 'yearCaption', []).join(';'),
        copyNumber: get(record, 'copyNumber'),
        itemStatus: get(record, 'status.name'),
        checkInServicePoint: get(record, 'lastCheckIn.servicePoint.name'),
        checkInDateTime: get(record, 'lastCheckIn.dateTime'),
        destinationServicePoint: get(record, 'inTransitDestinationServicePoint.name'),
        requestType: get(record, 'request.requestType'),
        requesterPatronGroup: get(record, 'request.requestPatronGroup'),
        requestCreationDate: get(record, 'request.requestDate'),
        requestExpirationDate: get(record, 'request.requestExpirationDate'),
        requestPickupServicePoint: get(record, 'request.requestPickupServicePointName'),
        tags: get(record, 'request.tags', []).join(';'),
      };
    });
  }

  toCSV(records = []) {
    const onlyFields = this.columnsMap;
    const parsedRecords = this.parse(records);
    exportCsv(parsedRecords, { onlyFields, filename: 'InTransit' });
  }
}

export default InTransitItemsReport;
