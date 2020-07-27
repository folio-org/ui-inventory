import React, {
  useState,
  useEffect,
} from 'react';
import PropTypes from 'prop-types';

import { stripesConnect } from '@folio/stripes/core';

import InstanceMovementDetails from './InstanceMovementDetails';

const InstanceMovementDetailsContainer = ({
  instance,
  onClose,
  mutator,
  referenceData,
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
      hasMarc={Boolean(marc)}
      referenceData={referenceData}
    />
  );
};

InstanceMovementDetailsContainer.propTypes = {
  instance: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  mutator: PropTypes.object.isRequired,
  referenceData: PropTypes.object.isRequired,
};

InstanceMovementDetailsContainer.defaultProps = {
  instance: {},
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
