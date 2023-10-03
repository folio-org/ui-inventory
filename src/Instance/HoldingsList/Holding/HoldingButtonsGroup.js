import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  IfPermission,
  useStripes,
} from '@folio/stripes/core';
import {
  Button,
  Badge,
  Icon,
} from '@folio/stripes/components';

import { updateAffiliation } from '../../../utils';

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
  isViewHoldingsDisabled,
  isAddItemDisabled,
}) => {
  const { okapi } = useStripes();

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
      <Button
        id={`clickable-view-holdings-${holding.id}`}
        data-test-view-holdings
        onClick={() => updateAffiliation(okapi, tenantId, onViewHolding)}
        disabled={isViewHoldingsDisabled}
      >
        <FormattedMessage id="ui-inventory.viewHoldings" />
      </Button>

      <IfPermission perm="ui-inventory.item.create">
        <Button
          id={`clickable-new-item-${holding.id}`}
          data-test-add-item
          onClick={() => updateAffiliation(okapi, tenantId, onAddItem)}
          buttonStyle="primary paneHeaderNewButton"
          disabled={isAddItemDisabled}
        >
          <FormattedMessage id="ui-inventory.addItem" />
        </Button>
      </IfPermission>
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
  isViewHoldingsDisabled: PropTypes.bool,
  isAddItemDisabled: PropTypes.bool,
  tenantId: PropTypes.string,
};


export default memo(HoldingButtonsGroup);
