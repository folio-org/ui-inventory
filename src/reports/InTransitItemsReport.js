import { exportCsv } from '@folio/stripes/util';

const columns = [
  'barcode',
  'title',
  'contributors',
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
  'requestCreationDate',
  'requestExpirationDate',
  'requestPickupServicePoint',
  'tags',
];

class InTransitItemsReport {
  constructor(mutators, formatMessage) {
    this.mutators = mutators;
    this.columnsMap = columns.map(value => ({
      label: formatMessage({ id: `ui-inventory.reports.inTransitItem.${value}` }),
      value,
    }));
  }

  parse(records) {
    return records.map(record => ({
      barcode: record?.barcode,
      title: record?.title,
      contributors: (record?.contributors ?? []).map(({ name }) => name).join('; '),
      shelvingLocation: record?.location?.name,
      shelvingLocationCode: record?.location?.code,
      callNumberPrefix: record?.effectiveCallNumberComponents?.prefix,
      callNumber: record?.effectiveCallNumberComponents?.callNumber,
      callNumberSuffix: record?.effectiveCallNumberComponents?.suffix,
      enumeration: record?.enumeration,
      volume: record?.volume,
      yearCaption: (record?.yearCaption ?? []).join(';'),
      copyNumber: record?.copyNumber,
      itemStatus: record?.status?.name,
      checkInServicePoint: record?.lastCheckIn?.servicePoint?.name,
      checkInDateTime: record?.lastCheckIn?.dateTime,
      destinationServicePoint: record?.inTransitDestinationServicePoint?.name,
      requestType: record?.request?.requestType,
      requestCreationDate: record?.request?.requestDate,
      requestExpirationDate: record?.request?.requestExpirationDate,
      requestPickupServicePoint: record?.request?.requestPickupServicePointName,
      tags: (record?.request?.tags ?? []).join('; '),
    }));
  }

  fetch(mutator, options = {}) {
    const {
      GET,
      reset,
    } = mutator;
    const {
      query,
      limit = 10000,
      offset = 0,
    } = options;

    reset();

    return GET({ params: { query, limit, offset } });
  }

  async fetchData() {
    let data = [];

    try {
      data = await this.fetch(this.mutators.itemsInTransitReport);
    } catch (err) {
      return data;
    }

    return data;
  }

  async toCSV() {
    const onlyFields = this.columnsMap;
    const records = await this.fetchData();
    const parsedRecords = this.parse(records);

    exportCsv(parsedRecords, { onlyFields, filename: 'InTransit' });

    return parsedRecords;
  }
}

export default InTransitItemsReport;
