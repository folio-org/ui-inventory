import React, {
  useCallback,
  useContext,
} from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { FormattedMessage } from 'react-intl';

import {
  stripesConnect,
  CalloutContext,
} from '@folio/stripes/core';
import {
  LoadingView,
} from '@folio/stripes/components';

import {
  useInstance,
} from '../../common/hooks';

import InstanceMovement from './InstanceMovement';

const InstanceMovementContainer = ({
  mutator,
  referenceData,
  idFrom,
  idTo,

  history,
  location,
}) => {
  const callout = useContext(CalloutContext);
  const {
    instance: instanceFrom,
    isLoading: isInstanceFromLoading,
  } = useInstance(idFrom, mutator.movableInstance);
  const {
    instance: instanceTo,
    isLoading: isInstanceToLoading,
  } = useInstance(idTo, mutator.movableInstance);

  const onClose = useCallback((closedInstance) => {
    const instanceId = closedInstance.id === instanceFrom.id
      ? instanceTo.id
      : instanceFrom.id;

    history.push({
      pathname: `/inventory/view/${instanceId}`,
      search: location.search,
    });
  });

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

  if (isInstanceFromLoading || isInstanceToLoading) return <LoadingView />;

  return (
    <InstanceMovement
      referenceData={referenceData}
      instanceFrom={instanceFrom}
      instanceTo={instanceTo}
      onClose={onClose}
      moveHoldings={moveHoldings}
      moveItems={moveItems}
    />
  );
};

InstanceMovementContainer.manifest = Object.freeze({
  movableInstance: {
    type: 'okapi',
    records: 'instances',
    throwErrors: false,
    path: 'inventory/instances',
    accumulate: true,
  },
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

InstanceMovementContainer.propTypes = {
  history:  PropTypes.object.isRequired,
  location:  PropTypes.object.isRequired,

  mutator:  PropTypes.object.isRequired,
  idFrom: PropTypes.string.isRequired,
  idTo: PropTypes.string.isRequired,
  referenceData: PropTypes.object,
};

InstanceMovementContainer.defaultProps = {
  referenceData: {},
};

export default withRouter(stripesConnect(InstanceMovementContainer));
