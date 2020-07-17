import React, {
  useCallback,
  useContext,
} from 'react';
import PropTypes from 'prop-types';

import { Droppable } from 'react-beautiful-dnd';
import DataContext from '../../../contexts/DataContext';
import {
  InstanceDetails,
} from '../../InstanceDetails';
import {
  HoldingsListContainer,
} from '../../HoldingsList';

import InstanceMovementDetailsActions from './InstanceMovementDetailsActions';

const InstanceMovementDetails = ({ instance, onClose, hasMarc }) => {
  const closeInstance = useCallback(() => {
    onClose(instance);
  }, [instance, onClose]);

  const {
    referenceData,
    activeDropZone
  } = useContext(DataContext);

  const getActionMenu = useCallback(({ onToggle }) => {
    if (instance.source !== 'MARC') {
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
        isDropDisabled={activeDropZone === instance.id}
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
              draggable={false}
              droppable={false}
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
