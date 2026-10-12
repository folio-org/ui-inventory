import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import { Button } from '@folio/stripes/components';
import { useStripes } from '@folio/stripes/core';

import { switchAffiliation } from '../../../../utils';

const AddItemButton = ({
  holding,
  tenantId,
  onAddItem,
  disabled,
}) => {
  const stripes = useStripes();

  return (
    <Button
      id={`clickable-new-item-${holding.id}`}
      onClick={async () => {
        await switchAffiliation(stripes, tenantId, onAddItem);
      }}
      buttonStyle="primary paneHeaderNewButton"
      disabled={disabled}
    >
      <FormattedMessage id="ui-inventory.addItem" />
    </Button>
  );
};

AddItemButton.propTypes = {
  holding: PropTypes.object.isRequired,
  tenantId: PropTypes.string.isRequired,
  onAddItem: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

export default AddItemButton;
