import { noop } from 'lodash';

import {
  dayjs,
  exportToCsv,
} from '@folio/stripes/components';

import { isTestEnv } from '../utils';

class IdReportGenerator {
  constructor(fileNamePrefix, jobHrId) {
    this.fileNamePrefix = fileNamePrefix;
    this.jobHrId = jobHrId;
  }

  parse(records, recordFinder = record => record) {
    return records.map(record => ({ id: recordFinder(record) }));
  }

  getCSVFileName() {
    return `${this.fileNamePrefix}${dayjs().format()}`;
  }

  getMARCFileName() {
    return `quick-export-${this.jobHrId}`;
  }

  toCSV(records, recordFinder) {
    const parsedRecords = this.parse(records, recordFinder);
    const fileTitle = {
      header: false,
      filename: this.getCSVFileName(),
    };
    const generateReport = !isTestEnv() ? exportToCsv : noop;

    generateReport(parsedRecords, fileTitle);
  }
}

export default IdReportGenerator;
