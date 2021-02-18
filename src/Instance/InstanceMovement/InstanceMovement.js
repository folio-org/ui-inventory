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
  instanceFrom,
  instanceTo,
  onClose,
  moveHoldings,
  moveItems,
}) => {
  return (
    <Paneset data-test-movement>
      <MoveHoldingContext
        moveHoldings={moveHoldings}
        moveItems={moveItems}
        leftInstance={instanceFrom}
        rightInstance={instanceTo}
      >
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
      </MoveHoldingContext>
    </Paneset>
  );
};

InstanceMovement.propTypes = {
  instanceFrom: PropTypes.object,
  instanceTo: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  moveHoldings: PropTypes.func.isRequired,
  moveItems: PropTypes.func.isRequired,
};

InstanceMovement.defaultProps = {
  instanceFrom: {},
  instanceTo: {},
};

export default InstanceMovement;
