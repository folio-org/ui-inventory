import React, {
  useCallback,
  useContext,
} from 'react';
import PropTypes from 'prop-types';

import { Droppable } from 'react-beautiful-dnd';
import {
  useStripes,
} from '@folio/stripes/core';

import DataContext from '../../../contexts/DataContext';
import {
  InstanceDetails,
} from '../../InstanceDetails';
import {
  HoldingsListContainer,
} from '../../HoldingsList';

import InstanceMovementDetailsActions from './InstanceMovementDetailsActions';

const InstanceMovementDetails = ({ instance, onClose, hasMarc }) => {
  const stripes = useStripes();

  const closeInstance = useCallback(() => {
    onClose(instance);
  }, [instance, onClose]);

  const {
    referenceData,
    activeDropZone,
    isItemsDropable,
  } = useContext(DataContext);

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
        isDropDisabled={isItemsDropable || activeDropZone === instance.id}
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
              isHoldingsMove
              draggable
              droppable
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
};

InstanceMovementDetails.defaultProps = {
  instance: {},
};

export default InstanceMovementDetails;
