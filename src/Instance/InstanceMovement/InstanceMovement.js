import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  stripesConnect,
  CalloutContext,
} from '@folio/stripes/core';

import {
  Paneset,
  Callout,
} from '@folio/stripes/components';
import {
  MoveHoldingContext,
} from '../MoveHoldingContext';

import { InstanceMovementDetailsContainer } from './InstanceMovementDetails';

const InstanceMovement = ({
  instanceFrom,
  instanceTo,
  onClose,
  referenceData,
  mutator,
}) => {
  const callout = useContext(CalloutContext);
  const moveHoldings = (toInstanceId, items) => {
    return mutator.movableHoldings.POST({
      toInstanceId,
      holdingsRecordIds: items,
    })
      .then(() => {
        const message = (
          <FormattedMessage
            id="ui-inventory.moveItems.instance.success"
            values={{ count: items.length }}
          />
        );

        callout.sendCallout({ message });
      });
  };

  const moveItems = (toHoldingsRecordId, items) => {
    return mutator.movableItems.POST({
      toHoldingsRecordId,
      itemIds: items,
    })
      .then(() => {
        const message = (
          <FormattedMessage
            id="ui-inventory.moveItems.instance.success"
            values={{ count: items.length }}
          />
        );

        callout.sendCallout({ message });
      });
  };

  return (
    <Paneset data-test-movement>
      <MoveHoldingContext
        referenceData={referenceData}
        moveHoldings={moveHoldings}
        moveItems={moveItems}
        withConfirmationModal
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

InstanceMovement.manifest = Object.freeze({
  movableHoldings: {
    type: 'okapi',
    path: 'inventory/holdings/move',
    fetch: false,
    throwErrors: false,
  },
  movableItems: {
    type: 'okapi',
    path: 'inventory/items/move',
    fetch: false,
    throwErrors: false,
  },
});

InstanceMovement.propTypes = {
  instanceFrom: PropTypes.object,
  instanceTo: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  referenceData: PropTypes.object.isRequired,
  mutator: PropTypes.object.isRequired,
};

InstanceMovement.defaultProps = {
  instanceFrom: {},
  instanceTo: {},
};

export default stripesConnect(InstanceMovement);
