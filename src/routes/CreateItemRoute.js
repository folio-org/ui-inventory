import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';

import { useStripes } from '@folio/stripes/core';

import { CreateItem } from '../Item';
import { DataContext } from '../contexts';
import { getItem } from '../storage';

const CreateItemRoute = () => {
  const { okapi } = useStripes();
  const referenceData = useContext(DataContext);
  const { id, holdingId } = useParams();
  const tenantIds = getItem('tenantIds');

  return (
    <CreateItem
      referenceData={referenceData || {}}
      instanceId={id}
      holdingId={holdingId}
      tenantTo={tenantIds ? tenantIds.tenantTo : okapi.tenant}
      tenantFrom={tenantIds ? tenantIds.tenantFrom : okapi.tenant}
    />
  );
};

export default CreateItemRoute;
