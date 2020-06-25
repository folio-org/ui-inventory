import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';

import {
  stripesConnect,
} from '@folio/stripes/core';

import { CreateHolding } from '../Holding';

import withData from './withData';

const CreateHoldingRoute = ({ match, isLoading, getData }) => {
  const isReferenceDataLoading = isLoading();
  const referenceData = useMemo(() => getData(), [isReferenceDataLoading]);

  return (
    <CreateHolding
      referenceData={referenceData}
      instanceId={match.params.id}
    />
  );
};

CreateHoldingRoute.propTypes = {
  match: PropTypes.object.isRequired,
  isLoading: PropTypes.func.isRequired,
  getData: PropTypes.func.isRequired,
};

export default withRouter(stripesConnect(withData(CreateHoldingRoute)));
