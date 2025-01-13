import { useContext } from 'react';
import PropTypes from 'prop-types';

import { DataContext } from '../../../../contexts';
import { LimitedHolding } from '../LimitedHolding';

const LimitedHoldingsList = ({
  instance,
  holdings,
  tenantId,
  userTenantPermissions,
  pathToAccordionsState,
}) => {
  const { locationsById } = useContext(DataContext);

  return holdings.map((holding, i) => (
    <LimitedHolding
      key={`${holding.id}_${i}`}
      instance={instance}
      holding={holding}
      tenantId={tenantId}
      locationName={locationsById[holding.permanentLocationId]?.name}
      userTenantPermissions={userTenantPermissions}
      pathToAccordionsState={pathToAccordionsState}
    />
  ));
};

LimitedHoldingsList.propTypes = {
  instance: PropTypes.object.isRequired,
  holdings: PropTypes.arrayOf(PropTypes.object).isRequired,
  tenantId: PropTypes.string.isRequired,
  userTenantPermissions: PropTypes.arrayOf(PropTypes.object).isRequired,
  pathToAccordionsState: PropTypes.arrayOf(PropTypes.string),
};

export default LimitedHoldingsList;
