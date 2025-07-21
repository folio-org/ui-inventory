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
import { DataContext } from '../../contexts';
import { useHoldings } from '../../providers';

const InstanceMovementContainer = ({
  mutator,
  idFrom,
  idTo,
  history,
}) => {
  const callout = useContext(CalloutContext);
  const { holdingsSourcesByName } = useContext(DataContext);
  const { holdingsById } = useHoldings();

  const {
    instance: instanceFrom,
    isLoading: isInstanceFromLoading,
    refetch: refetchFrom,
  } = useInstance(idFrom);
  const {
    instance: instanceTo,
    isLoading: isInstanceToLoading,
    refetch: refetchTo,
  } = useInstance(idTo);

  const onClose = useCallback((closedInstance) => {
    const instanceId = closedInstance.id === instanceFrom?.id
      ? instanceTo?.id
      : instanceFrom?.id;

    history.push({
      pathname: `/inventory/view/${instanceId}`,
    });
  }, [history, instanceFrom, instanceTo]);

  const changeHridForMarcHoldings = (fields, hrid) => {
    return fields.map(field => {
      if (field.tag === '004') {
        return { ...field, content: hrid };
      }

      return field;
    });
  };

  const moveHoldings = (toInstanceId, holdings) => {
    const marcHoldingsIds = holdings.filter((holdingsId) => {
      return holdingsById[holdingsId].sourceId === holdingsSourcesByName.MARC.id;
    });

    marcHoldingsIds.forEach((marcHoldingsId) => {
      mutator.recordsEditorId.update({ externalId: marcHoldingsId });
      mutator.recordsEditor.GET()
        .then(({ fields, parsedRecordId, ...data }) => {
          mutator.recordsEditorId.update({ id: parsedRecordId });

          return mutator.recordsEditor.PUT({
            ...data,
            parsedRecordId,
            fields: changeHridForMarcHoldings(fields, instanceTo.hrid),
            relatedRecordVersion: ++holdingsById[marcHoldingsId]._version,
            _actionType: 'edit',
          });
        });
    });

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
      refetchFrom={refetchFrom}
      refetchTo={refetchTo}
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
  recordsEditor: {
    type: 'okapi',
    path: 'records-editor/records',
    fetch: false,
    accumulate: true,
    GET: {
      params: {
        externalId: '%{recordsEditorId.externalId}',
      },
    },
    PUT: {
      path: 'records-editor/records/%{recordsEditorId.id}',
    },
    headers: {
      accept: 'application/json',
    },
  },
  recordsEditorId: {},
});

InstanceMovementContainer.propTypes = {
  history:  PropTypes.object.isRequired,
  mutator:  PropTypes.object.isRequired,
  idFrom: PropTypes.string.isRequired,
  idTo: PropTypes.string.isRequired,
};

export default withRouter(stripesConnect(InstanceMovementContainer));
