import moment from 'moment';
import { noop } from 'lodash';

import { exportCsv } from '@folio/stripes/util';

import { isTestEnv } from '../utils';

class IdReportGenerator {
  constructor(fileNamePrefix) {
    this.fileNamePrefix = fileNamePrefix;
  }

  parse(records, recordFinder = record => record) {
    return records.map(record => ({ id: recordFinder(record) }));
  }

  getCSVFileName() {
    return `${this.fileNamePrefix}${moment().format()}`;
  }

  getMARCFileName(jobHRID) {
    return `quick-export-${jobHRID}`;
  }

  toCSV(records, recordFinder) {
    const parsedRecords = this.parse(records, recordFinder);
    const fileTitle = {
      header: false,
      filename: this.getCSVFileName(),
    };
    const generateReport = !isTestEnv() ? exportCsv : noop;

    generateReport(parsedRecords, fileTitle);
  }
}

export default IdReportGenerator;
