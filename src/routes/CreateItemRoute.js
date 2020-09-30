import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';

import { CreateItem } from '../Item';
import { DataContext } from '../contexts';

const CreateItemRoute = ({ match }) => {
  const referenceData = useContext(DataContext);

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
};

export default withRouter(CreateItemRoute);
