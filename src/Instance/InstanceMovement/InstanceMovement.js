import React from 'react';
import PropTypes from 'prop-types';

import {
  Paneset,
} from '@folio/stripes/components';

import { InstanceMovementDetailsContainer } from './InstanceMovementDetails';

const InstanceMovement = ({
  instanceFrom,
  instanceTo,
  onClose,
}) => {
  return (
    <Paneset data-test-movement>
      <InstanceMovementDetailsContainer
        instance={instanceFrom}
        onClose={onClose}
        data-test-movement-from-instance-details
      />

      <InstanceMovementDetailsContainer
        instance={instanceTo}
        onClose={onClose}
        data-test-movement-to-instance-details
      />
    </Paneset>
  );
};

InstanceMovement.propTypes = {
  instanceFrom: PropTypes.object,
  instanceTo: PropTypes.object,
  onClose: PropTypes.func.isRequired,
};

InstanceMovement.defaultProps = {
  instanceFrom: {},
  instanceTo: {},
};

export default InstanceMovement;
