import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import { useStripes } from '@folio/stripes/core';
import {
  Accordion,
  Col,
  KeyValue,
  Loading,
  Row,
} from '@folio/stripes/components';

import { getDateWithTime } from '../../../../utils';
import useItemAcquisition from './useItemAcquisition';

const ItemAcquisition = ({ accordionId, itemId }) => {
  const stripes = useStripes();
  const {
    isLoading,
    itemAcquisition = {},
    isCentralTenantAcquisition,
  } = useItemAcquisition(itemId);

  if (!(stripes.hasInterface('pieces') &&
    stripes.hasInterface('order-lines') &&
    stripes.hasInterface('orders') &&
    stripes.hasInterface('organizations.organizations'))) return null;


  if (isLoading) {
    return (
      <Accordion
        id={accordionId}
        label={<FormattedMessage id="ui-inventory.acquisition" />}
      >
        <Loading />
      </Accordion>
    );
  }

  const { orderLine, order, piece, vendor } = itemAcquisition;
  const receiptDate = getDateWithTime(piece?.receivedDate);

  return (
    <Accordion
      id={accordionId}
      label={<FormattedMessage id="ui-inventory.acquisition" />}
    >
      <Row>
        <Col xs={4}>
          <KeyValue
            label={<FormattedMessage id="ui-inventory.acq.polNumber" />}
            value={orderLine && (
              isCentralTenantAcquisition
                ? <span>{orderLine.poLineNumber}</span>
                : <Link to={`/orders/lines/view/${orderLine.id}`}>{orderLine.poLineNumber}</Link>
            )}
          />
        </Col>

        <Col xs={4}>
          <KeyValue
            label={<FormattedMessage id="ui-inventory.acq.orderStatus" />}
            value={order && <FormattedMessage id={`ui-inventory.acq.orderStatus.${order.workflowStatus}`} />}
          />
        </Col>

        <Col xs={4}>
          <KeyValue
            label={<FormattedMessage id="ui-inventory.acq.dateOpened" />}
            value={getDateWithTime(order?.dateOrdered)}
          />
        </Col>

        <Col xs={4}>
          <KeyValue
            label={<FormattedMessage id="ui-inventory.acq.receiptStatus" />}
            value={orderLine && <FormattedMessage id={`ui-inventory.acq.receiptStatus.${orderLine.receiptStatus}`} />}
          />
        </Col>

        <Col xs={4}>
          <KeyValue
            label={<FormattedMessage id="ui-inventory.acq.receiptDate" />}
            value={piece?.receivedDate && (
              isCentralTenantAcquisition
                ? <span>{receiptDate}</span>
                : <Link to={`/receiving/${piece.titleId}/view`}>{receiptDate}</Link>
            )}
          />
        </Col>

        <Col xs={4}>
          <KeyValue
            label={<FormattedMessage id="ui-inventory.acq.vendorCode" />}
            value={vendor?.code}
          />
        </Col>

        <Col xs={4}>
          <KeyValue
            label={<FormattedMessage id="ui-inventory.acq.orderType" />}
            value={order && <FormattedMessage id={`ui-inventory.acq.orderType.${order.orderType}`} />}
          />
        </Col>

        {
          order?.orderType === 'Ongoing' && (
            <KeyValue
              label={<FormattedMessage id="ui-inventory.acq.orderSubscription" />}
              value={<FormattedMessage id={`ui-inventory.${order.ongoing?.isSubscription ? 'yes' : 'no'}`} />}
            />
          )
        }
      </Row>
    </Accordion>
  );
};

ItemAcquisition.propTypes = {
  accordionId: PropTypes.string.isRequired,
  itemId: PropTypes.string.isRequired,
};

export default ItemAcquisition;
