import { get } from 'lodash';
import moment from 'moment';

import { exportCsv } from '@folio/stripes/util';

class InstancesIdReport {
  parse(records) {
    return records.map(record => {
      const toCSV = {
        id: get(record, 'id'),
      };

      return toCSV;
    });
  }

  toCSV(records = []) {
    const parsedRecords = this.parse(records);

    exportCsv(parsedRecords, {
      header: false,
      filename: 'SearchInstanceUUIDs' + moment().format(),
    });
  }
}

export default InstancesIdReport;
