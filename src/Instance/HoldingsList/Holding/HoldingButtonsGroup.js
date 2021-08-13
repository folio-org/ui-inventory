import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { IfPermission } from '@folio/stripes/core';
import {
  Button,
  Badge,
  Icon,
} from '@folio/stripes/components';

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
}) => (
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
      onClick={onViewHolding}
    >
      <FormattedMessage id="ui-inventory.viewHoldings" />
    </Button>

    <IfPermission perm="ui-inventory.item.create">
      <Button
        id={`clickable-new-item-${holding.id}`}
        data-test-add-item
        onClick={onAddItem}
        buttonStyle="primary paneHeaderNewButton"
      >
        <FormattedMessage id="ui-inventory.addItem" />
      </Button>
    </IfPermission>
    {!isOpen && <Badge>{itemCount !== undefined ? itemCount : <Icon icon="spinner-ellipsis" width="10px" />}</Badge>}
  </>
);

HoldingButtonsGroup.propTypes = {
  holding: PropTypes.object.isRequired,
  holdings: PropTypes.arrayOf(PropTypes.object).isRequired,
  isOpen: PropTypes.bool.isRequired,
  itemCount: PropTypes.number.isRequired,
  locationsById: PropTypes.object.isRequired,
  onAddItem: PropTypes.func.isRequired,
  onViewHolding: PropTypes.func.isRequired,
  withMoveDropdown: PropTypes.bool,
};


export default memo(HoldingButtonsGroup);
