import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';

import { InstanceMovementContainer } from '../Instance';
import { DataContext } from '../contexts';

const InstanceMovementRoute = ({ match }) => {
  const referenceData = useContext(DataContext);

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
};

export default withRouter(InstanceMovementRoute);
