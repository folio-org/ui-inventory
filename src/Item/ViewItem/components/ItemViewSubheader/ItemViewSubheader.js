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

import { ITEM_STATUS_LOWERCASE_TRANSLATIONS_ID_MAP } from '../../../constants';

const ItemViewSubheader = ({
  item,
  instance,
  holdingsRecord,
  holdingLocation,
}) => {
  const { formatMessage } = useIntl();

  const itemMaterialType = item?.materialType?.name || '';
  const itemStatus = item?.status?.name || '';

  const itemStatusValue = itemStatus in ITEM_STATUS_LOWERCASE_TRANSLATIONS_ID_MAP
    ? formatMessage({ id: ITEM_STATUS_LOWERCASE_TRANSLATIONS_ID_MAP[itemStatus] })
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
              materialType: itemMaterialType,
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
