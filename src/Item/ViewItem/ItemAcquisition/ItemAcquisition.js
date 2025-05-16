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
  NoValue,
  Row,
} from '@folio/stripes/components';

import { getDateWithTime } from '../../../utils';
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

  const { orderLine, order, piece, vendor, finance, orderSetting } = itemAcquisition;
  const receiptDate = getDateWithTime(piece?.receivedDate);

  const getAmountWithCurrency = (locale, currency, amount = 0) => (
    Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount)
  );

  const totalOrderLineLocationsQuantity = orderLine?.locations?.reduce(
    (sum, location) => sum + (location.quantity ?? 0), 0
  );

  const totalFinanceEncumbranceAmountExpended = finance?.transactions?.reduce(
    (sum, transaction) => sum + (transaction.encumbrance?.amountExpended ?? 0), 0
  );

  const allFundCodes = orderLine?.fundDistribution?.map(fd => fd.code).filter(code => !!code).join(', ') ?? '';
  const financeCurrency = finance?.transactions?.length ? finance?.transactions[0].currency : undefined;
  const averageCost = totalFinanceEncumbranceAmountExpended / totalOrderLineLocationsQuantity;
  const formattedAverageCost = financeCurrency ? getAmountWithCurrency(stripes.locale, financeCurrency, averageCost) : <NoValue />;

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
            label={<FormattedMessage id="ui-inventory.acq.acqMethod" />}
            value={orderSetting?.value ?? <NoValue />}
          />
        </Col>

        <Col xs={4}>
          <KeyValue
            label={<FormattedMessage id="ui-inventory.acq.vendorName" />}
            value={vendor?.name ?? <NoValue />}
          />
        </Col>
      </Row>

      <Row>
        <Col xs={4}>
          <KeyValue
            label={<FormattedMessage id="ui-inventory.acq.receiptStatus" />}
            value={orderLine && <FormattedMessage id={`ui-inventory.acq.receiptStatus.${orderLine.receiptStatus}`} />}
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
            label={<FormattedMessage id="ui-inventory.acq.vendorCode" />}
            value={vendor?.code ?? <NoValue />}
          />
        </Col>
      </Row>

      <Row>
        <Col xs={4}>
          <KeyValue
            label={<FormattedMessage id="ui-inventory.acq.dateOpened" />}
            value={getDateWithTime(order?.dateOrdered)}
          />
        </Col>

        <Col xs={4}>
          <KeyValue
            label={<FormattedMessage id="ui-inventory.acq.orderType" />}
            value={order && <FormattedMessage id={`ui-inventory.acq.orderType.${order.orderType}`} />}
          />
        </Col>

        <Col xs={4}>
          <KeyValue
            label={<FormattedMessage id="ui-inventory.acq.averageCost" />}
            value={formattedAverageCost}
          />
        </Col>
      </Row>

      <Row>
        <Col xs={8}>
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
            label={<FormattedMessage id="ui-inventory.acq.fundCode" />}
            value={allFundCodes ?? <NoValue />}
          />
        </Col>
      </Row>

      <Row>
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
