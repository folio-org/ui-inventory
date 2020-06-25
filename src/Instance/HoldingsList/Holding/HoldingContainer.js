import React, {
  useCallback,
} from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';

import Holding from './Holding';

const HoldingContainer = ({
  location,
  history,

  instance,
  holding,
  referenceData,
  ...rest
}) => {
  const onViewHolding = useCallback(() => {
    history.push({
      pathname: `/inventory/view/${instance.id}/${holding.id}`,
      search: location.search,
    });
  }, [location.search, instance.id, holding.id]);

  const onAddItem = useCallback(() => {
    history.push({
      pathname: `/inventory/create/${instance.id}/${holding.id}/item`,
      search: location.search,
    });
  }, [instance.id, holding.id]);

  return (
    <Holding
      {...rest}
      holding={holding}
      referenceData={referenceData}
      onViewHolding={onViewHolding}
      onAddItem={onAddItem}
    />
  );
};

HoldingContainer.propTypes = {
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,

  instance: PropTypes.object.isRequired,
  holding: PropTypes.object.isRequired,
  referenceData: PropTypes.object.isRequired,
};

export default withRouter(HoldingContainer);
