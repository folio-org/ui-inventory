import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import { Button } from '@folio/stripes/components';
import { useStripes } from '@folio/stripes/core';

import { switchAffiliation } from '../../../../utils';

const ViewHoldingsButton = ({
  holding,
  tenantId,
  onViewHolding,
  disabled,
}) => {
  const stripes = useStripes();

  return (
    <Button
      id={`clickable-view-holdings-${holding.id}`}
      onClick={async () => {
        await switchAffiliation(stripes, tenantId, onViewHolding);
      }}
      disabled={disabled}
    >
      <FormattedMessage id="ui-inventory.viewHoldings" />
    </Button>
  );
};

ViewHoldingsButton.propTypes = {
  holding: PropTypes.object.isRequired,
  tenantId: PropTypes.string.isRequired,
  onViewHolding: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

export default ViewHoldingsButton;
