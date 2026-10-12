import React, { useContext } from 'react';
import { useParams, useLocation } from 'react-router-dom';

import { AuthenticatedError } from '@folio/stripes/core';
import { isValidUUID } from '@folio/stripes/util';

import { EditItem } from '../Item';
import { DataContext } from '../contexts';

const EditItemRoute = () => {
  const location = useLocation();
  const { id, holdingId, itemId } = useParams();

  const referenceData = useContext(DataContext);

  const hasValidParams = [id, holdingId, itemId].every(isValidUUID);

  if (!hasValidParams) {
    return <AuthenticatedError location={location} />;
  }

  return (
    <EditItem
      referenceData={referenceData || {}}
      instanceId={id}
      holdingId={holdingId}
      itemId={itemId}
    />
  );
};

export default EditItemRoute;
