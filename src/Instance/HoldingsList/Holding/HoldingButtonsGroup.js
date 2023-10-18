import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  checkIfUserInCentralTenant,
  IfPermission,
  useStripes,
} from '@folio/stripes/core';
import {
  Button,
  Badge,
  Icon,
} from '@folio/stripes/components';

import { switchAffiliation } from '../../../utils';

import { MoveToDropdown } from './MoveToDropdown';

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
        <Button
          id={`clickable-view-holdings-${holding.id}`}
          data-test-view-holdings
          onClick={() => switchAffiliation(stripes, tenantId, onViewHolding)}
        >
          <FormattedMessage id="ui-inventory.viewHoldings" />
        </Button>
      }
      {!isUserInCentralTenant && showAddItemButton && (
        <IfPermission perm="ui-inventory.item.create">
          <Button
            id={`clickable-new-item-${holding.id}`}
            data-test-add-item
            onClick={() => switchAffiliation(stripes, tenantId, onAddItem)}
            buttonStyle="primary paneHeaderNewButton"
          >
            <FormattedMessage id="ui-inventory.addItem" />
          </Button>
        </IfPermission>
      )}
      {!isOpen && <Badge>{itemCount ?? <Icon icon="spinner-ellipsis" width="10px" />}</Badge>}
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
