import { get } from 'lodash';

import { exportCsv } from '@folio/stripes/util';

const columns = [
  'barcode',
  'title',
  'contributors',
  'callNumber',
  'enumeration',
  'volume',
  'yearCaption',
  'library',
  'shelvingLocation',
  'shelvingLocationCode',
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
      const toCSV = {
        barcode: get(record, 'barcode'),
        title: get(record, 'title'),
        contributors: get(record, 'contributors', []).map(({ name }) => name).join(';'),
        callNumber: get(record, 'callNumber'),
        enumeration: get(record, 'enumeration'),
        volume: get(record, 'volume'),
        yearCaption: get(record, 'yearCaption', []).join(';'),
        library: get(record, 'location.name'),
        shelvingLocation: get(record, 'location.libraryName'),
        shelvingLocationCode: get(record, 'location.code'),
        itemStatus: get(record, 'status.name'),
        checkInServicePoint: get(record, 'loan.checkInServicePoint.name'),
        checkInDateTime: get(record, 'loan.checkInDateTime'),
        destinationServicePoint: get(record, 'inTransitDestinationServicePoint.name'),
        requestType: get(record, 'request.requestType'),
        requesterPatronGroup: get(record, 'request.requestPatronGroup'),
        requestCreationDate: get(record, 'request.requestDate'),
        requestExpirationDate: get(record, 'request.requestExpirationDate'),
        requestPickupServicePoint: get(record, 'request.requestPickupServicePointName'),
        tags: get(record, 'request.tags', []).join(';'),
      };

      return toCSV;
    });
  }

  toCSV(records = []) {
    const onlyFields = this.columnsMap;
    const parsedRecords = this.parse(records);
    exportCsv(parsedRecords, { onlyFields, filename: 'InTransit' });
  }
}

export default InTransitItemsReport;
