import React from 'react';
import PropTypes from 'prop-types';

import { Loading } from '@folio/stripes/components';

import { keyBy } from 'lodash';

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

  // Enrich the data displayed in the FieldRow
  const holdingsRecordsByHrid = keyBy(holdingsRecords, 'hrid');
  const instancesById = keyBy(instances.data?.instances, 'id');
  data.forEach(boundWithTitle => {
    if (!boundWithTitle.briefHoldingsRecord?.id) {
      const holdingsRecord = holdingsRecordsByHrid[boundWithTitle.briefHoldingsRecord?.hrid];
      boundWithTitle.briefHoldingsRecord.id = holdingsRecord.id;

      const instance = instancesById[holdingsRecord.instanceId];
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
