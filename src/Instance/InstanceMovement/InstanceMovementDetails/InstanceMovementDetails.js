import React, {
  useCallback,
  useContext,
} from 'react';
import PropTypes from 'prop-types';

import { Droppable } from 'react-beautiful-dnd';
import { useStripes } from '@folio/stripes/core';

import DnDContext from '../../DnDContext';
import { HoldingsListContainer } from '../../HoldingsList';

import InstanceMovementDetailsActions from './InstanceMovementDetailsActions';
import ViewInstancePane from '../../ViewInstance/ViewInstancePane/ViewInstancePane';
import { useInstanceMutation } from '../../hooks';

const InstanceMovementDetails = ({
  onClose,
  hasMarc,
  instance = {},
  id = 'movement-instance-details',
  refetch,
}) => {
  const stripes = useStripes();
  const tenantId = instance.tenantId ?? stripes.okapi.tenant;

  const closeInstance = useCallback(() => {
    onClose(instance);
  }, [instance, onClose]);

  const {
    activeDropZone,
    isItemsDroppable,
  } = useContext(DnDContext);

  const { mutateInstance: mutateEntity } = useInstanceMutation({ tenantId });

  const mutateInstance = async (entity, { onError }) => {
    await mutateEntity(entity, { onSuccess: refetch, onError });
  };

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

  const holdingsSection = (
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
  );

  return (
    <ViewInstancePane
      id={id}
      instance={instance}
      isShared={instance.shared}
      tenantId={stripes.okapi.tenant}
      mutateInstance={mutateInstance}
      onClose={closeInstance}
      actionMenu={getActionMenu}
      holdingsSection={holdingsSection}
    />
  );
};

InstanceMovementDetails.propTypes = {
  onClose: PropTypes.func.isRequired,
  hasMarc: PropTypes.bool,
  instance: PropTypes.object,
  id: PropTypes.string,
  refetch: PropTypes.func,
};

export default InstanceMovementDetails;
