import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';

import { InstanceMovementContainer } from '../Instance';

const InstanceMovementRoute = ({ match }) => {
  return (
    <InstanceMovementContainer
      idFrom={match.params.idFrom}
      idTo={match.params.idTo}
    />
  );
};

InstanceMovementRoute.propTypes = {
  match: PropTypes.object.isRequired,
};

export default withRouter(InstanceMovementRoute);
