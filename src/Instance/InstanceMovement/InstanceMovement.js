import PropTypes from 'prop-types';

import { Paneset } from '@folio/stripes/components';

import DragAndDropProvider from '../../dnd/DragAndDropProvider';
import InstanceMovementDetails from './InstanceMovementDetails/InstanceMovementDetails';

const InstanceMovement = ({
  onClose,
  instanceFrom = {},
  instanceTo = {},
  refetchFrom,
  refetchTo,
}) => {
  return (
    <Paneset data-test-movement isRoot>
      <DragAndDropProvider
        leftInstance={instanceFrom}
        rightInstance={instanceTo}
      >
        <InstanceMovementDetails
          instance={instanceFrom}
          onClose={onClose}
          refetch={refetchFrom}
          data-test-movement-from-instance-details
          id="movement-from-instance-details"
        />

        <InstanceMovementDetails
          instance={instanceTo}
          onClose={onClose}
          refetch={refetchTo}
          data-test-movement-to-instance-details
          id="movement-to-instance-details"
        />
      </DragAndDropProvider>
    </Paneset>
  );
};

InstanceMovement.propTypes = {
  onClose: PropTypes.func.isRequired,
  instanceFrom: PropTypes.object,
  instanceTo: PropTypes.object,
  refetchFrom: PropTypes.func,
  refetchTo: PropTypes.func,
};

export default InstanceMovement;
