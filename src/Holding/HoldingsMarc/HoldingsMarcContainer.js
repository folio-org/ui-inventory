import PropTypes from 'prop-types';

import { stripesConnect } from '@folio/stripes/core';

import { ViewSource } from '../../components';

const HoldingsMarcContainer = ({
  mutator,
  instanceId,
  holdingsrecordid,
}) => {
  return (
    <ViewSource
      mutator={mutator}
      instanceId={instanceId}
      holdingsRecordId={holdingsrecordid}
      isHoldingsRecord
    />
  );
};

HoldingsMarcContainer.manifest = Object.freeze({
  marcInstance: {
    type: 'okapi',
    records: 'instances',
    throwErrors: false,
    path: 'inventory/instances',
    accumulate: true,
  },
  marcRecord: {
    type: 'okapi',
    path: 'source-storage/records/!{holdingsrecordid}/formatted?idType=HOLDINGS',
    accumulate: true,
    throwErrors: false,
  },
});

HoldingsMarcContainer.propTypes = {
  holdingsrecordid: PropTypes.string.isRequired,
  instanceId: PropTypes.string.isRequired,
  mutator: PropTypes.object.isRequired,
};

export default stripesConnect(HoldingsMarcContainer);
