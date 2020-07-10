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
  const moveHoldings = (fromHolding, toHolding, items) => {
    // TODO: replace temporary solution with correct one when implemented

    return mutator.movableItems.GET({
      params: {
        query: items.map(item => `id==${item}`).join(' or '),
      },
    })
      .then(({ items: fetchedItems }) => {
        const updatedPromises = fetchedItems.map((item) => mutator.movableItems.PUT({
          ...item,
          holdingsRecordId: toHolding,
        }));

        return Promise.all(updatedPromises);
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
    path: 'inventory/items',
    fetch: false,
    throwErrors: false,
    accumulate: true,
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
