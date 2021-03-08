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
  idFrom,
  idTo,
  history,
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
    const instanceId = closedInstance.id === instanceFrom?.id
      ? instanceTo?.id
      : instanceFrom?.id;

    history.push({
      pathname: `/inventory/view/${instanceId}`,
      search: history.location.search,
    });
  }, [history, instanceFrom, instanceTo]);

  const moveHoldings = (toInstanceId, holdings) => {
    return mutator.movableHoldings.POST({
      toInstanceId,
      holdingsRecordIds: holdings,
    })
      .then(({ nonUpdatedIds }) => {
        const hasErrors = Boolean(nonUpdatedIds?.length);

        const message = hasErrors ? (
          <FormattedMessage
            id="ui-inventory.moveItems.instance.holdings.error"
            values={{ holdings: nonUpdatedIds.join(', ') }}
          />
        ) : (
          <FormattedMessage
            id="ui-inventory.moveItems.instance.holdings.success"
            values={{ count: holdings.length }}
          />
        );
        const type = hasErrors ? 'error' : 'success';

        callout.sendCallout({ type, message });
      })
      .catch(() => {
        callout.sendCallout({
          type: 'error',
          message: (
            <FormattedMessage
              id="ui-inventory.moveItems.instance.holdings.error.server"
              values={{ holdings: holdings.join(', ') }}
            />
          ),
        });
      });
  };

  if (isInstanceFromLoading || isInstanceToLoading) return <LoadingView />;

  return (
    <InstanceMovement
      instanceFrom={instanceFrom}
      instanceTo={instanceTo}
      onClose={onClose}
      moveHoldings={moveHoldings}
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
  instanceHoldings: {
    type: 'okapi',
    records: 'holdingsRecords',
    path: 'holdings-storage/holdings',
    params: {
      limit: '1000',
    },
    accumulate: true,
  },
});

InstanceMovementContainer.propTypes = {
  history:  PropTypes.object.isRequired,
  mutator:  PropTypes.object.isRequired,
  idFrom: PropTypes.string.isRequired,
  idTo: PropTypes.string.isRequired,
};

export default withRouter(stripesConnect(InstanceMovementContainer));
