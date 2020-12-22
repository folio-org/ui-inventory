import moment from 'moment';

import { exportCsv } from '@folio/stripes/util';

class InstancesIdReport {
  constructor(fileNamePrefix) {
    this.fileNamePrefix = fileNamePrefix;
  }

  parse(records, recordFinder = record => record) {
    return records.map(record => ({ id: recordFinder(record) }));
  }

  toCSV(records, recordFinder) {
    const parsedRecords = this.parse(records, recordFinder);

    exportCsv(parsedRecords, {
      header: false,
      filename: `${this.fileNamePrefix}${moment().format()}`,
    });
  }
}

export default InstancesIdReport;
