import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';

import {
  stripesConnect,
} from '@folio/stripes/core';

import { InstanceEdit } from '../Instance';

import withData from './withData';

const InstanceEditRoute = ({ isLoading, getData }) => {
  const { id: instanceId } = useParams();

  const isReferenceDataLoading = isLoading();
  const referenceData = useMemo(() => getData(), [isReferenceDataLoading]);

  return (
    <InstanceEdit
      referenceData={referenceData}
      instanceId={instanceId}
    />
  );
};

InstanceEditRoute.propTypes = {
  isLoading: PropTypes.func.isRequired,
  getData: PropTypes.func.isRequired,
};

export default stripesConnect(withData(InstanceEditRoute));
