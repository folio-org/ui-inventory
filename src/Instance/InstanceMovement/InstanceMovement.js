import React from 'react';
import PropTypes from 'prop-types';

import {
  Paneset,
} from '@folio/stripes/components';
import {
  MoveHoldingContext,
} from '../MoveHoldingContext';

import { InstanceMovementDetailsContainer } from './InstanceMovementDetails';

const InstanceMovement = ({
  onClose,
  moveHoldings,
  instanceFrom = {},
  instanceTo = {},
}) => {
  return (
    <Paneset data-test-movement>
      <MoveHoldingContext
        moveHoldings={moveHoldings}
        leftInstance={instanceFrom}
        rightInstance={instanceTo}
      >
        <InstanceMovementDetailsContainer
          instance={instanceFrom}
          onClose={onClose}
          data-test-movement-from-instance-details
          id="movement-from-instance-details"
        />

        <InstanceMovementDetailsContainer
          instance={instanceTo}
          onClose={onClose}
          data-test-movement-to-instance-details
          id="movement-to-instance-details"
        />
      </MoveHoldingContext>
    </Paneset>
  );
};

InstanceMovement.propTypes = {
  onClose: PropTypes.func.isRequired,
  moveHoldings: PropTypes.func.isRequired,
  instanceFrom: PropTypes.object,
  instanceTo: PropTypes.object,
};

export default InstanceMovement;
