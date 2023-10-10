import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';

import { useStripes } from '@folio/stripes/core';

import { CreateHolding } from '../Holding';
import { DataContext } from '../contexts';
import { getItem } from '../storage';

const CreateHoldingRoute = ({ match }) => {
  const { okapi } = useStripes();
  const referenceData = useContext(DataContext);
  const tenantIds = getItem('tenantIds');

  return (
    <CreateHolding
      referenceData={referenceData || {}}
      instanceId={match.params.id}
      tenantFrom={tenantIds ? tenantIds.tenantFrom : okapi.tenant}
    />
  );
};

CreateHoldingRoute.propTypes = {
  match: PropTypes.object.isRequired,
};

export default withRouter(CreateHoldingRoute);
