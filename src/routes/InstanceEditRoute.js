import React, { useContext } from 'react';
import { useParams, useLocation } from 'react-router-dom';

import { AuthenticatedError } from '@folio/stripes/core';
import { isValidUUID } from '@folio/stripes-util';

import { InstanceEdit } from '../Instance';
import { DataContext } from '../contexts';

const InstanceEditRoute = () => {
  const location = useLocation();
  const { id: instanceId } = useParams();

  const referenceData = useContext(DataContext);

  const hasValidParams = isValidUUID(instanceId);

  if (!hasValidParams) {
    return <AuthenticatedError location={location} />;
  }

  return (
    <InstanceEdit
      referenceData={referenceData}
      instanceId={instanceId}
    />
  );
};

export default InstanceEditRoute;
