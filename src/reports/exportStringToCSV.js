import moment from 'moment';

import { exportCsv } from '@folio/stripes/util';

const exportStringToCSV = str => {
  const record = [{ str }];

  exportCsv(record, {
    header: false,
    filename: 'SearchInstanceCQLQuery' + moment().format(),
  });
};

export default exportStringToCSV;
