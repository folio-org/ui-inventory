import React from 'react';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';
import PropTypes from 'prop-types';

import {
  Col,
  Row,
} from '@folio/stripes/components';
import { AppIcon } from '@folio/stripes/core';

import LinkedInstanceDetails from './LinkedInstanceDetails';
import LinkedHoldingDetails from './LinkedHoldingDetails';

import {
  ITEM_MATERIAL_TYPES,
  itemStatusesMap,
} from '../../constants';

const ITEM_STATUS_TRANSLATIONS_ID_MAP = {
  [itemStatusesMap.AGED_TO_LOST]: 'ui-inventory.item.status.agedToLost.lowercase',
  [itemStatusesMap.AVAILABLE]: 'ui-inventory.item.status.available.lowercase',
  [itemStatusesMap.AWAITING_PICKUP]: 'ui-inventory.item.status.awaitingPickup.lowercase',
  [itemStatusesMap.AWAITING_DELIVERY]: 'ui-inventory.item.status.awaitingDelivery.lowercase',
  [itemStatusesMap.CHECKED_OUT]: 'ui-inventory.item.status.checkedOut.lowercase',
  [itemStatusesMap.CLAIMED_RETURNED]: 'ui-inventory.item.status.claimedReturned.lowercase',
  [itemStatusesMap.DECLARED_LOST]: 'ui-inventory.item.status.declaredLost.lowercase',
  [itemStatusesMap.IN_PROCESS]: 'ui-inventory.item.status.inProcess.lowercase',
  [itemStatusesMap.IN_PROCESS_NON_REQUESTABLE]: 'ui-inventory.item.status.inProcessNonRequestable.lowercase',
  [itemStatusesMap.IN_TRANSIT]: 'ui-inventory.item.status.inTransit.lowercase',
  [itemStatusesMap.INTELLECTUAL_ITEM]: 'ui-inventory.item.status.intellectualItem.lowercase',
  [itemStatusesMap.LONG_MISSING]: 'ui-inventory.item.status.longMissing.lowercase',
  [itemStatusesMap.LOST_AND_PAID]: 'ui-inventory.item.status.lostAndPaid.lowercase',
  [itemStatusesMap.MISSING]: 'ui-inventory.item.status.missing.lowercase',
  [itemStatusesMap.ON_ORDER]: 'ui-inventory.item.status.onOrder.lowercase',
  [itemStatusesMap.ORDER_CLOSED]: 'ui-inventory.item.status.paged.lowercase',
  [itemStatusesMap.PAGED]: 'ui-inventory.item.status.restricted.lowercase',
  [itemStatusesMap.RESTRICTED]: 'ui-inventory.item.status.orderClosed.lowercase',
  [itemStatusesMap.UNAVAILABLE]: 'ui-inventory.item.status.unavailable.lowercase',
  [itemStatusesMap.UNKNOWN]: 'ui-inventory.item.status.unknown.lowercase',
  [itemStatusesMap.WITHDRAWN]: 'ui-inventory.item.status.withdrawn.lowercase',
};
const MATERIAL_TYPE_TRANSLATIONS_ID_MAP = {
  [ITEM_MATERIAL_TYPES.BOOK]: 'ui-inventory.item.materialType.book',
  [ITEM_MATERIAL_TYPES.DVD]: 'ui-inventory.item.materialType.dvd',
  [ITEM_MATERIAL_TYPES.ELECTRONIC_RESOURCE]: 'ui-inventory.item.materialType.electronicResource',
  [ITEM_MATERIAL_TYPES.MICROFORM]: 'ui-inventory.item.materialType.microform',
  [ITEM_MATERIAL_TYPES.SOUND_RECORDING]: 'ui-inventory.item.materialType.soundRecording',
  [ITEM_MATERIAL_TYPES.TEXT]: 'ui-inventory.item.materialType.text',
  [ITEM_MATERIAL_TYPES.UNSPECIFIED]: 'ui-inventory.item.materialType.unspecified',
  [ITEM_MATERIAL_TYPES.VIDEO_RECORDING]: 'ui-inventory.item.materialType.videoRecording',
};

const ItemViewSubheader = ({
  item,
  instance,
  holdingsRecord,
  holdingLocation,
}) => {
  const { formatMessage } = useIntl();

  const itemMaterialType = item?.materialType?.name || '';
  const itemStatus = item?.status?.name || '';

  const materialTypeValue = itemMaterialType in MATERIAL_TYPE_TRANSLATIONS_ID_MAP
    ? formatMessage({ id: MATERIAL_TYPE_TRANSLATIONS_ID_MAP[itemMaterialType] })
    : itemMaterialType;
  const itemStatusValue = itemStatus in ITEM_STATUS_TRANSLATIONS_ID_MAP
    ? formatMessage({ id: ITEM_STATUS_TRANSLATIONS_ID_MAP[itemStatus] })
    : itemStatus;

  return (
    <>
      <Row center="xs">
        <Col sm={6}>
          <LinkedInstanceDetails
            item={item}
            instance={instance}
          />
          <LinkedHoldingDetails
            instance={instance}
            holdingsRecord={holdingsRecord}
            holdingLocation={holdingLocation}
          />
        </Col>
      </Row>
      <hr />
      <Row>
        <Col sm={12}>
          <AppIcon
            app="inventory"
            iconKey="item"
            size="small"
          />
          {' '}
          <FormattedMessage
            id={
              item?.isBoundWith
                ? 'ui-inventory.itemRecordWithDescriptionBW'
                : 'ui-inventory.itemRecordWithDescription'
            }
            values={{
              materialType: materialTypeValue,
              status: itemStatusValue,
            }}
          />
        </Col>
      </Row>
    </>
  );
};

ItemViewSubheader.propTypes = {
  item: PropTypes.object,
  instance: PropTypes.object,
  holdingsRecord: PropTypes.object,
  holdingLocation: PropTypes.object,
};

export default ItemViewSubheader;
