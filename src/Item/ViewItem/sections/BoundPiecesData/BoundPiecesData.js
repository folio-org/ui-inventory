import { Accordion } from '@folio/stripes/components';
import PropTypes from 'prop-types';

import { BoundPiecesList } from '../../../../components';

import {
  ITEM_ACCORDION_LABELS,
  ITEM_ACCORDIONS,
} from '../../../../constants';

const BoundPiecesData = ({
  itemId,
  instanceId,
}) => {
  return (
    <Accordion
      id={ITEM_ACCORDIONS.boundItems}
      label={ITEM_ACCORDION_LABELS.boundItems}
    >
      <BoundPiecesList
        id="bound-pieces-list"
        itemId={itemId}
        instanceId={instanceId}
      />
    </Accordion>
  );
};

BoundPiecesData.propTypes = {
  itemId: PropTypes.string.isRequired,
  instanceId: PropTypes.string.isRequired,
};

export default BoundPiecesData;
