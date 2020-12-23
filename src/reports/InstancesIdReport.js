import moment from 'moment';
import { noop } from 'lodash';

import { exportCsv } from '@folio/stripes/util';

import { isTestEnv } from '../utils';

class InstancesIdReport {
  constructor(fileNamePrefix) {
    this.fileNamePrefix = fileNamePrefix;
  }

  parse(records, recordFinder = record => record) {
    return records.map(record => ({ id: recordFinder(record) }));
  }

  toCSV(records, recordFinder) {
    const parsedRecords = this.parse(records, recordFinder);
    const fileTitle = {
      header: false,
      filename: `${this.fileNamePrefix}${moment().format()}`,
    };
    const generateReport = !isTestEnv() ? exportCsv : noop;

    generateReport(parsedRecords, fileTitle);
  }
}

export default InstancesIdReport;
