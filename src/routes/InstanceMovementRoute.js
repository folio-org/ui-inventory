import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';

import {
  stripesConnect,
} from '@folio/stripes/core';

import { InstanceMovementContainer } from '../Instance';

import withData from './withData';

const InstanceMovementRoute = ({ match, isLoading, getData }) => {
  const isReferenceDataLoading = isLoading();
  const referenceData = useMemo(() => getData(), [isReferenceDataLoading]);

  return (
    <InstanceMovementContainer
      referenceData={referenceData}
      idFrom={match.params.idFrom}
      idTo={match.params.idTo}
    />
  );
};

InstanceMovementRoute.propTypes = {
  match: PropTypes.object.isRequired,
  isLoading: PropTypes.func.isRequired,
  getData: PropTypes.func.isRequired,
};

export default withRouter(stripesConnect(withData(InstanceMovementRoute)));
