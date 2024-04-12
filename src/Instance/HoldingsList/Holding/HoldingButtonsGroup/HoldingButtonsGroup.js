import React, { memo } from 'react';
import PropTypes from 'prop-types';

import {
  checkIfUserInCentralTenant,
  IfPermission,
  useStripes,
} from '@folio/stripes/core';

import { MoveToDropdown } from '../MoveToDropdown';
import ViewHoldingsButton from './ViewHoldingsButton';
import AddItemButton from './AddItemButton';
import ItemsCountBadge from './ItemsCountBadge';

const HoldingButtonsGroup = ({
  withMoveDropdown,
  holding,
  holdings,
  locationsById,
  onViewHolding,
  onAddItem,
  itemCount,
  isOpen,
  tenantId,
  showViewHoldingsButton,
  showAddItemButton,
}) => {
  const stripes = useStripes();
  const isUserInCentralTenant = checkIfUserInCentralTenant(stripes);

  return (
    <>
      {
        withMoveDropdown && (
          <MoveToDropdown
            holding={holding}
            holdings={holdings}
            locationsById={locationsById}
          />
        )
      }
      {showViewHoldingsButton &&
        <ViewHoldingsButton
          holding={holding}
          tenantId={tenantId}
          onViewHolding={onViewHolding}
        />
      }
      {!isUserInCentralTenant && showAddItemButton && (
        <IfPermission perm="ui-inventory.item.create">
          <AddItemButton
            holding={holding}
            tenantId={tenantId}
            onAddItem={onAddItem}
          />
        </IfPermission>
      )}
      {!isOpen && <ItemsCountBadge itemCount={itemCount} />}
    </>
  );
};

HoldingButtonsGroup.propTypes = {
  holding: PropTypes.object.isRequired,
  holdings: PropTypes.arrayOf(PropTypes.object).isRequired,
  isOpen: PropTypes.bool.isRequired,
  itemCount: PropTypes.number,
  locationsById: PropTypes.object.isRequired,
  onAddItem: PropTypes.func.isRequired,
  onViewHolding: PropTypes.func.isRequired,
  withMoveDropdown: PropTypes.bool,
  showViewHoldingsButton: PropTypes.bool,
  showAddItemButton: PropTypes.bool,
  tenantId: PropTypes.string,
};

export default memo(HoldingButtonsGroup);
