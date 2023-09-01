import PropTypes from 'prop-types';

import { stripesConnect } from '@folio/stripes/core';

import { ViewSource } from '../../components';
import MARC_TYPES from '../../components/ViewSource/marcTypes';
import { useInstance } from '../../common';

const InstanceMarcContainer = ({ mutator, instanceId }) => {
  const { instance, isLoading: isInstanceLoading } = useInstance(instanceId);
  const tenantId = instance?.tenantId;

  return (
    <ViewSource
      mutator={mutator}
      instance={instance}
      instanceId={instanceId}
      isInstanceLoading={isInstanceLoading}
      tenantId={tenantId}
      marcType={MARC_TYPES.BIB}
    />
  );
};

InstanceMarcContainer.manifest = Object.freeze({
  marcRecord: {
    type: 'okapi',
    path: 'source-storage/records/!{instanceId}/formatted?idType=INSTANCE',
    accumulate: true,
    throwErrors: false,
  },
});

InstanceMarcContainer.propTypes = {
  mutator: PropTypes.object.isRequired,
  instanceId: PropTypes.string.isRequired,
};

export default stripesConnect(InstanceMarcContainer);
