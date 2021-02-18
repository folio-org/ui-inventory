import React, {
  useCallback,
  useContext,
} from 'react';
import PropTypes from 'prop-types';

import { Droppable } from 'react-beautiful-dnd';
import {
  useStripes,
} from '@folio/stripes/core';

import DnDContext from '../../DnDContext';
import {
  InstanceDetails,
} from '../../InstanceDetails';
import {
  HoldingsListContainer,
} from '../../HoldingsList';

import InstanceMovementDetailsActions from './InstanceMovementDetailsActions';

const InstanceMovementDetails = ({
  instance,
  onClose,
  hasMarc,
  referenceData,
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
      referenceData={referenceData}
      onClose={closeInstance}
      actionMenu={getActionMenu}
      data-test-instance-movement-details={instance.id}
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
              referenceData={referenceData}
              isHoldingsMove={canMoveHoldings}
              draggable={canMoveItems}
              droppable={canMoveItems}
            />

            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </InstanceDetails>
  );
};

InstanceMovementDetails.propTypes = {
  instance: PropTypes.object,
  hasMarc: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  referenceData: PropTypes.object.isRequired,
};

InstanceMovementDetails.defaultProps = {
  instance: {},
};

export default InstanceMovementDetails;
