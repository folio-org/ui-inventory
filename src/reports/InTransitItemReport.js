import { exportCsv } from '@folio/stripes/util';

const columns = [
  'barcode',
  'title',
  'contributors',
  'location.name',
  'location.libraryName',
  'location.code',
  'status.name',
];

class InTransitItemReport {
  constructor({ formatMessage }) {
    this.columnsMap = columns.map(value => ({
      label: formatMessage({ id: `ui-inventory.reports.inTransitItem.${value}` }),
      value
    }));
  }

  parse(records) {
    return records.map(record => {
      const { contributors = [] } = record;

      return {
        ...record,
        contributors: contributors.map(({ name }) => name).join(';')
      };
    });
  }

  toCSV(records) {
    const onlyFields = this.columnsMap;
    const parsedRecords = this.parse(records);
    exportCsv(parsedRecords, { onlyFields, fileName: 'inTransit' });
  }
}

export default InTransitItemReport;
