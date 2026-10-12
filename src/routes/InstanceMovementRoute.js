import PropTypes from 'prop-types';
import { withRouter } from 'react-router';

import { OrderManagementProvider } from '../providers';
import { InstanceMovementContainer } from '../Instance';

const InstanceMovementRoute = ({ match }) => {
  return (
    <OrderManagementProvider>
      <InstanceMovementContainer
        idFrom={match.params.idFrom}
        idTo={match.params.idTo}
      />
    </OrderManagementProvider>
  );
};

InstanceMovementRoute.propTypes = {
  match: PropTypes.object.isRequired,
};

export default withRouter(InstanceMovementRoute);
