import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';

import {
  stripesConnect,
} from '@folio/stripes/core';

import { CreateItem } from '../Item';

import withData from './withData';

const CreateItemRoute = ({ match, isLoading, getData }) => {
  const isReferenceDataLoading = isLoading();
  const referenceData = useMemo(() => getData(), [isReferenceDataLoading]);

  return (
    <CreateItem
      referenceData={referenceData}
      instanceId={match.params.id}
      holdingId={match.params.holdingId}
    />
  );
};

CreateItemRoute.propTypes = {
  match: PropTypes.object.isRequired,
  isLoading: PropTypes.func,
  getData: PropTypes.func,
};

export default withRouter(stripesConnect(withData(CreateItemRoute)));
