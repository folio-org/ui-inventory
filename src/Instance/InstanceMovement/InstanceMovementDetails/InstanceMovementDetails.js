import { useCallback } from 'react';
import PropTypes from 'prop-types';

import { useStripes } from '@folio/stripes/core';

import InstanceMovementDetailsActions from './InstanceMovementDetailsActions';
import ViewInstancePane from '../../ViewInstance/ViewInstancePane/ViewInstancePane';
import HoldingsList from '../../HoldingsList/HoldingsList';

import { useInstanceMutation } from '../../hooks';
import useMarcRecordQuery from '../../../hooks/useMarcRecordQuery';

import { INSTANCE_RECORD_TYPE } from '../../../constants';

const InstanceMovementDetails = ({
  instance = {},
  onClose,
  refetch,
  id = 'movement-instance-details',
}) => {
  const stripes = useStripes();
  const tenantId = instance.tenantId ?? stripes.okapi.tenant;

  const { data: marcRecord } = useMarcRecordQuery(instance.id, INSTANCE_RECORD_TYPE, stripes.okapi.tenant,
    { enabled: instance.source === 'MARC' });

  const { mutateInstance: mutateEntity } = useInstanceMutation({ tenantId });
  const mutateInstance = async (entity, { onError }) => {
    await mutateEntity(entity, { onSuccess: refetch, onError });
  };

  const closeInstance = useCallback(() => {
    onClose(instance);
  }, [instance, onClose]);

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
        hasMarc={Boolean(marcRecord)}
      />
    );
  }, [instance, marcRecord]);

  const holdingsSection = (
    <HoldingsList
      instanceId={instance.id}
      tenantId={stripes.okapi.tenant}
      pathToAccordionsState={['holdings']}
      isItemsMovement
      isHoldingsMovement
    />
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
  instance: PropTypes.object,
  id: PropTypes.string,
  refetch: PropTypes.func,
};

export default InstanceMovementDetails;
