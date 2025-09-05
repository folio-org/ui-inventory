import { useCallback } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { useHistory } from 'react-router-dom';

import { stripesConnect } from '@folio/stripes/core';

import { LoadingView } from '@folio/stripes/components';

import InstanceMovement from './InstanceMovement';
import { useInstance } from '../../common/hooks';

const InstanceMovementContainer = ({
  idFrom,
  idTo,
}) => {
  const history = useHistory();

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

  if (isInstanceFromLoading || isInstanceToLoading) return <LoadingView />;

  return (
    <InstanceMovement
      instanceFrom={instanceFrom}
      instanceTo={instanceTo}
      refetchFrom={refetchFrom}
      refetchTo={refetchTo}
      onClose={onClose}
    />
  );
};

InstanceMovementContainer.propTypes = {
  idFrom: PropTypes.string.isRequired,
  idTo: PropTypes.string.isRequired,
};

export default withRouter(stripesConnect(InstanceMovementContainer));
