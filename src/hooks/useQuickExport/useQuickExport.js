import { useRef } from 'react';
import { useMutation } from 'react-query';
import { FormattedMessage } from 'react-intl';

import {
  useOkapiKy,
  useCallout,
} from '@folio/stripes/core';

import { IdReportGenerator } from '../../reports';

const useQuickExport = () => {
  const ky = useOkapiKy();
  const callout = useCallout();

  const isExporting = useRef(false);

  const mutation = useMutation({
    mutationFn: async ({ uuids, recordType }) => {
      if (isExporting.current) return;

      isExporting.current = true;

      try {
        const { jobExecutionHrId } = await ky.post(
          'data-export/quick-export',
          {
            json: {
              uuids,
              type: 'uuid',
              recordType,
            },
          },
        ).json();
        const generator = new IdReportGenerator('QuickInstanceExport', jobExecutionHrId);
        const csvFileName = generator.getCSVFileName();
        const marcFileName = generator.getMARCFileName();

        generator.toCSV(uuids);

        callout.sendCallout({
          type: 'success',
          message: <FormattedMessage
            id="ui-inventory.exportInstancesInMARC.complete"
            values={{ csvFileName, marcFileName }}
          />,
        });
      } catch {
        callout.sendCallout({
          type: 'error',
          message: <FormattedMessage id="ui-inventory.communicationProblem" />,
        });
      } finally {
        isExporting.current = false;
      }
    }
  });

  return {
    exportRecords: mutation.mutateAsync,
  };
};

export default useQuickExport;
