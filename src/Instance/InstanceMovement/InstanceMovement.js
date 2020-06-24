import React, {
  useCallback,
} from 'react';
import PropTypes from 'prop-types';

import {
  Paneset,
} from '@folio/stripes/components';

import {
  InstanceDetails,
} from '../InstanceDetails';
import {
  HoldingsListContainer,
} from '../HoldingsList';
import {
  MoveItemsContext,
} from '../MoveItemsContext';

const InstanceMovement = ({
  referenceData,
  instanceFrom,
  instanceTo,
  onClose,
}) => {
  const closeInstanceFrom = useCallback(() => {
    onClose(instanceFrom);
  }, [instanceFrom, onClose]);

  const closeInstanceTo = useCallback(() => {
    onClose(instanceTo);
  }, [instanceTo, onClose]);

  return (
    <Paneset data-test-movement>
      <InstanceDetails
        instance={instanceFrom}
        referenceData={referenceData}
        onClose={closeInstanceFrom}
        data-test-movement-from-instance-details
      >
        <MoveItemsContext>
          <HoldingsListContainer
            instance={instanceFrom}
            referenceData={referenceData}
            draggable={false}
            droppable={false}
          />
        </MoveItemsContext>
      </InstanceDetails>

      <InstanceDetails
        instance={instanceTo}
        referenceData={referenceData}
        onClose={closeInstanceTo}
        data-test-movement-to-instance-details
      >
        <MoveItemsContext>
          <HoldingsListContainer
            instance={instanceTo}
            referenceData={referenceData}
            draggable={false}
            droppable={false}
          />
        </MoveItemsContext>
      </InstanceDetails>
    </Paneset>
  );
};

InstanceMovement.propTypes = {
  referenceData: PropTypes.object,
  instanceFrom: PropTypes.object,
  instanceTo: PropTypes.object,
  onClose: PropTypes.func.isRequired,
};

InstanceMovement.defaultProps = {
  referenceData: {},
  instanceFrom: {},
  instanceTo: {},
};

export default InstanceMovement;
