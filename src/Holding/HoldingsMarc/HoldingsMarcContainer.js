import PropTypes from 'prop-types';

import { stripesConnect } from '@folio/stripes/core';

import { ViewSource } from '../../components';
import MARC_TYPES from '../../components/ViewSource/marcTypes';
import { useInstance } from '../../common';

const HoldingsMarcContainer = ({
  mutator,
  instanceId,
  holdingsrecordid,
}) => {
  const { instance, isLoading: isInstanceLoading } = useInstance(instanceId);
  const tenantId = instance?.tenantId;

  return (
    <ViewSource
      mutator={mutator}
      instance={instance}
      instanceId={instanceId}
      isInstanceLoading={isInstanceLoading}
      holdingsRecordId={holdingsrecordid}
      marcType={MARC_TYPES.HOLDINGS}
      tenantId={tenantId}
    />
  );
};

HoldingsMarcContainer.manifest = Object.freeze({
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
