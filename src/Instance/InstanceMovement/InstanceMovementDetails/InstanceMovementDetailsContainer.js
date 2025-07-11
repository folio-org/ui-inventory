import React, {
  useState,
  useEffect,
} from 'react';
import PropTypes from 'prop-types';

import { stripesConnect } from '@folio/stripes/core';

import InstanceMovementDetails from './InstanceMovementDetails';

const InstanceMovementDetailsContainer = ({
  onClose,
  mutator,
  instance = {},
  refetch,
  id = 'movement-instance-details',
}) => {
  const [marc, setMarc] = useState();

  useEffect(() => {
    if (instance.source === 'MARC') {
      mutator.marcRecord.GET().then(setMarc);
    }
  }, []);

  return (
    <InstanceMovementDetails
      instance={instance}
      onClose={onClose}
      refetch={refetch}
      hasMarc={Boolean(marc)}
      id={id}
    />
  );
};

InstanceMovementDetailsContainer.propTypes = {
  onClose: PropTypes.func.isRequired,
  mutator: PropTypes.object.isRequired,
  instance: PropTypes.object,
  id: PropTypes.string,
  refetch: PropTypes.func,
};

InstanceMovementDetailsContainer.manifest = Object.freeze({
  marcRecord: {
    type: 'okapi',
    path: 'source-storage/records/!{instance.id}/formatted?idType=INSTANCE',
    accumulate: true,
    throwErrors: false,
  },
});

export default stripesConnect(InstanceMovementDetailsContainer);
