import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  stripesConnect,
} from '@folio/stripes/core';

import {
  Paneset,
  Callout,
} from '@folio/stripes/components';
import {
  MoveItemsContext,
} from '../MoveItemsContext';

import { InstanceMovementDetailsContainer } from './InstanceMovementDetails';

const InstanceMovement = ({
  instanceFrom,
  instanceTo,
  onClose,
  referenceData,
  mutator,
}) => {
  const calloutRef = useRef();
  const moveHoldings = (toInstanceId, items) => {
    return mutator.movableItems.POST({
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

        calloutRef.current.sendCallout({ message });
      });
  };

  return (
    <Paneset data-test-movement>
      <MoveItemsContext
        referenceData={referenceData}
        moveItems={moveHoldings}
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
      </MoveItemsContext>
      <Callout ref={calloutRef} />
    </Paneset>
  );
};

InstanceMovement.manifest = Object.freeze({
  movableItems: {
    type: 'okapi',
    path: 'inventory/holdings/move',
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
