import React, {
  useCallback,
} from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';

import {
  stripesConnect,
} from '@folio/stripes/core';
import {
  LoadingView,
} from '@folio/stripes/components';

import {
  useInstance,
} from '../../common/hooks';
import DataContext from '../../contexts/DataContext';

import InstanceMovement from './InstanceMovement';

const InstanceMovementContainer = ({
  mutator,
  referenceData,
  idFrom,
  idTo,

  history,
  location,
}) => {
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

  if (isInstanceFromLoading || isInstanceToLoading) return <LoadingView />;

  return (
    <DataContext.Provider value={referenceData}>
      <InstanceMovement
        instanceFrom={instanceFrom}
        instanceTo={instanceTo}
        onClose={onClose}
      />
    </DataContext.Provider>
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
