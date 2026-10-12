import omit from 'lodash/omit';
import PropTypes from 'prop-types';
import {
  useMemo,
  useRef,
} from 'react';
import { FormattedMessage } from 'react-intl';

import {
  acqRowFormatter,
  useShowCallout,
  useToggle,
} from '@folio/stripes-acq-components';
import {
  ConfirmationModal,
  Loading,
  MultiColumnList,
} from '@folio/stripes/components';
import { useStripes } from '@folio/stripes/core';

import {
  useBoundPieces,
  usePiecesMutation,
} from '../../common/hooks';
import {
  PIECE_COLUMN_MAPPING,
  VISIBLE_COLUMNS,
} from './constants';
import { getColumnFormatter } from './utils';

const BoundPiecesList = ({ id, itemId, instanceId }) => {
  const stripes = useStripes();
  const showCallout = useShowCallout();
  const { updatePiece } = usePiecesMutation();
  const {
    boundPieces,
    isFetching,
    refetch,
  } = useBoundPieces(itemId);

  const [open, toggleOpen] = useToggle(false);
  const selectedPieceRef = useRef(null);

  const hasViewReceivingPermissions = stripes.hasPerm('ui-receiving.view');

  const onRemove = pieceData => {
    selectedPieceRef.current = {
      ...omit(pieceData, ['rowIndex']),
      isBound: false,
    };

    toggleOpen();
  };

  const handleRemove = () => {
    return updatePiece(selectedPieceRef.current)
      .then(() => {
        refetch();
        toggleOpen();
        showCallout({
          messageId: 'ui-inventory.boundPieces.remove.success',
        });
      })
      .catch(() => {
        toggleOpen();
        showCallout({
          messageId: 'ui-inventory.boundPieces.remove.error',
          type: 'error',
        });
      });
  };

  const formatter = useMemo(() => {
    return getColumnFormatter({ onRemove, hasViewReceivingPermissions, instanceId });
  }, [hasViewReceivingPermissions]);

  if (isFetching) return <Loading />;

  return (
    <>
      <MultiColumnList
        id={id}
        contentData={boundPieces}
        totalCount={boundPieces.length}
        columnMapping={PIECE_COLUMN_MAPPING}
        visibleColumns={VISIBLE_COLUMNS}
        formatter={formatter}
        interactive={false}
        rowFormatter={acqRowFormatter}
      />

      <ConfirmationModal
        id="delete-confirmation-modal"
        open={open}
        onConfirm={handleRemove}
        onCancel={toggleOpen}
        heading={<FormattedMessage id="ui-inventory.boundPieces.remove.heading" />}
        message={<FormattedMessage id="ui-inventory.boundPieces.remove.message" />}
        confirmLabel={<FormattedMessage id="ui-inventory.boundPieces.remove.button" />}
      />
    </>
  );
};

BoundPiecesList.propTypes = {
  id: PropTypes.string,
  itemId: PropTypes.string.isRequired,
  instanceId: PropTypes.string.isRequired,
};

export default BoundPiecesList;
