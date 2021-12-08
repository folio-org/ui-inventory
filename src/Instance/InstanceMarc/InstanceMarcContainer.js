import PropTypes from 'prop-types';

import { stripesConnect } from '@folio/stripes/core';

import { ViewSource } from '../../components';

const InstanceMarcContainer = ({ mutator, instanceId }) => {
  return (
    <ViewSource
      mutator={mutator}
      instanceId={instanceId}
    />
  );
};

InstanceMarcContainer.manifest = Object.freeze({
  marcInstance: {
    type: 'okapi',
    records: 'instances',
    throwErrors: false,
    path: 'inventory/instances',
    accumulate: true,
  },
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
