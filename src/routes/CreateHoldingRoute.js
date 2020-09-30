import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';

import { CreateHolding } from '../Holding';
import { DataContext } from '../contexts';

const CreateHoldingRoute = ({ match }) => {
  const referenceData = useContext(DataContext);

  return (
    <CreateHolding
      referenceData={referenceData}
      instanceId={match.params.id}
    />
  );
};

CreateHoldingRoute.propTypes = {
  match: PropTypes.object.isRequired,
};

export default withRouter(CreateHoldingRoute);
