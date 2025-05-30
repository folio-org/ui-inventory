import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import { callNumberLabel } from '../../../../utils';

const LinkedHoldingDetails = ({
  instance,
  holdingsRecord,
  holdingLocation,
}) => {
  const inactiveLabel = (
    <span>
      {' '}
      <em><FormattedMessage id="ui-inventory.inactive" /></em>
    </span>
  );
  const holdingsPermanentLocationLabel = ` ${holdingLocation.permanentLocation.name} > ${callNumberLabel(holdingsRecord)}`;

  return (
    <div>
      <FormattedMessage id="ui-inventory.holdingsLabelShort" />
      <Link to={`/inventory/view/${instance.id}/${holdingsRecord.id}`}>
        {!holdingLocation.permanentLocation.isActive && inactiveLabel}
        {holdingsPermanentLocationLabel}
      </Link>
    </div>
  );
};

LinkedHoldingDetails.propTypes = {
  instance: PropTypes.object,
  holdingsRecord: PropTypes.object,
  holdingLocation: PropTypes.object,
};

export default LinkedHoldingDetails;
