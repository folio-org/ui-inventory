import React from 'react';
import PropTypes from 'prop-types';

import { Loading } from '@folio/stripes/components';

import FieldRow from '../../components/RepeatableField/FieldRow';
import useHoldingsQueryByHrids from '../../hooks/useHoldingsQueryByHrids';
import useInstancesQuery from '../../hooks/useInstancesQuery';

// Fetches holdings and instances info given in the input holdings HRID
const BoundWithFieldRow = ({ fields, ...rest }) => {
  const data = fields.value ? fields.value : [];

  // Load the holdings records matching the input HRIDs
  const holdingsRecordHrids = data.map(boundWithTitle => boundWithTitle.briefHoldingsRecord.hrid);
  const { isLoading: isHoldingsLoading, holdingsRecords } = useHoldingsQueryByHrids(holdingsRecordHrids);

  // Load the instance records matching the holdings' instanceIds.
  const instanceIds = holdingsRecords.map(record => record.instanceId);
  const instances = useInstancesQuery(instanceIds);
  if (isHoldingsLoading || !instances.isSuccess) return <Loading size="large" />;

  // Enrich the data render in the FieldRow
  data.map(boundWithTitle => {
    if (!boundWithTitle.briefHoldingsRecord?.id) {
      const holdingsRecord = holdingsRecords.find(
        record => record.hrid === boundWithTitle.briefHoldingsRecord.hrid
      );
      boundWithTitle.briefHoldingsRecord.id = holdingsRecord.id;

      const instance = instances.data?.instances?.find(x => x.id === holdingsRecord.instanceId);
      boundWithTitle.briefInstance = {
        id: instance?.id,
        hrid: instance?.hrid,
        title: instance?.title,
      };
    }
    return boundWithTitle;
  });

  return (
    <FieldRow
      fields={fields}
      {...rest}
    />
  );
};

BoundWithFieldRow.propTypes = {
  fields: PropTypes.object,
};

export default BoundWithFieldRow;
