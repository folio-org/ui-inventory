import PropTypes from 'prop-types';

import { LimitedHolding } from '../LimitedHolding';

const LimitedHoldingsList = ({
  instance,
  holdings,
  tenantId,
  userTenantPermissions,
  pathToAccordionsState,
}) => {
  return holdings.map(holding => (
    <LimitedHolding
      instance={instance}
      holding={holding}
      tenantId={tenantId}
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
