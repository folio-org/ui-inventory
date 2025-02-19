import React, {
  useCallback,
  useContext,
} from 'react';
import PropTypes from 'prop-types';

import { Droppable } from 'react-beautiful-dnd';
import { useStripes } from '@folio/stripes/core';

import DnDContext from '../../DnDContext';
import { InstanceDetails } from '../../InstanceDetails';
import { HoldingsListContainer } from '../../HoldingsList';

import InstanceMovementDetailsActions from './InstanceMovementDetailsActions';

const InstanceMovementDetails = ({
  onClose,
  hasMarc,
  instance = {},
  id = 'movement-instance-details',
}) => {
  const stripes = useStripes();

  const closeInstance = useCallback(() => {
    onClose(instance);
  }, [instance, onClose]);

  const {
    activeDropZone,
    isItemsDroppable,
  } = useContext(DnDContext);

  const getActionMenu = useCallback(({ onToggle }) => {
    if (
      instance.source !== 'MARC'
      && !stripes.hasPerm('inventory.instances.item.put')
    ) {
      return null;
    }

    return (
      <InstanceMovementDetailsActions
        onToggle={onToggle}
        instance={instance}
        hasMarc={hasMarc}
      />
    );
  }, [instance, hasMarc]);

  const canMoveHoldings = stripes.hasPerm('ui-inventory.holdings.move');
  const canMoveItems = stripes.hasPerm('ui-inventory.item.move');

  return (
    <InstanceDetails
      instance={instance}
      onClose={closeInstance}
      actionMenu={getActionMenu}
      data-test-instance-movement-details={instance.id}
      isShared={instance.shared}
      id={id}
    >
      <Droppable
        droppableId={`${instance.id}`}
        isDropDisabled={isItemsDroppable || activeDropZone === instance.id || !canMoveHoldings}
      >
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            data-test-holdings
          >
            <HoldingsListContainer
              instance={instance}
              isHoldingsMove={canMoveHoldings}
              draggable={canMoveItems}
              droppable={canMoveItems}
              tenantId={stripes.okapi.tenant}
            />

            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </InstanceDetails>
  );
};

InstanceMovementDetails.propTypes = {
  onClose: PropTypes.func.isRequired,
  hasMarc: PropTypes.bool,
  instance: PropTypes.object,
  id: PropTypes.string,
};

export default InstanceMovementDetails;
