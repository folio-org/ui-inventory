import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import {
  Accordion,
  Col,
  KeyValue,
  MultiColumnList,
  Row,
} from '@folio/stripes/components';

import { useControlledAccordion } from '../../../common/hooks';
import {
  getDateWithTime,
} from '../../../utils';
import useHoldingOrderLines from './useHoldingOrderLines';

const visibleColumns = ['poLineNumber', 'orderStatus', 'polReceiptStatus', 'orderSentDate', 'orderType'];
const columnMapping = {
  poLineNumber: <FormattedMessage id="ui-inventory.acq.polNumber" />,
  orderStatus: <FormattedMessage id="ui-inventory.acq.orderStatus" />,
  polReceiptStatus: <FormattedMessage id="ui-inventory.acq.receiptStatus" />,
  orderSentDate: <FormattedMessage id="ui-inventory.acq.orderSentDate" />,
  orderType: <FormattedMessage id="ui-inventory.acq.orderType" />,
};
const formatter = {
  poLineNumber: i => <Link to={`/orders/lines/view/${i.poLineId}`}>{i.poLineNumber}</Link>,
  orderStatus: i => (
    <>
      <FormattedMessage id={`ui-inventory.acq.orderStatus.${i.orderStatus}`} />
      {i.orderCloseReason?.reason && ` - ${i.orderCloseReason.reason}`}
    </>
  ),
  polReceiptStatus: i => <FormattedMessage id={`ui-inventory.acq.receiptStatus.${i.polReceiptStatus}`} />,
  orderSentDate: i => getDateWithTime(i.orderSentDate),
  orderType: i => <FormattedMessage id={`ui-inventory.acq.orderType.${i.orderType}`} />,
};

const HoldingAquisitions = ({ holding, withSummary }) => {
  const { isLoading, holdingOrderLines } = useHoldingOrderLines(holding.id, { enabled: withSummary });
  const controlledAccorion = useControlledAccordion(
    Boolean(
      holdingOrderLines.length
      || holding.acquisitionMethod
      || holding.acquisitionFormat
      || holding.receiptStatus
    )
  );

  if (isLoading) {
    return (
      <Accordion
        id="acc06"
        label={<FormattedMessage id="ui-inventory.acquisition" />}
      />
    );
  }

  return (
    <Accordion
      id="acc06"
      label={<FormattedMessage id="ui-inventory.acquisition" />}
      {...controlledAccorion}
    >
      <Row>
        <Col sm={2}>
          <KeyValue
            label={<FormattedMessage id="ui-inventory.acquisitionMethod" />}
            value={holding.acquisitionMethod}
          />
        </Col>

        <Col sm={2}>
          <KeyValue
            label={<FormattedMessage id="ui-inventory.acquisitionFormat" />}
            value={holding.acquisitionFormat}
          />
        </Col>

        <Col sm={2}>
          <KeyValue
            label={<FormattedMessage id="ui-inventory.receiptStatus" />}
            value={holding.receiptStatus}
          />
        </Col>
      </Row>

      {
        withSummary && (
          <MultiColumnList
            id="list-holding-order-lines"
            loading={isLoading}
            contentData={holdingOrderLines}
            visibleColumns={visibleColumns}
            columnMapping={columnMapping}
            formatter={formatter}
            interactive={false}
          />
        )
      }
    </Accordion>
  );
};

HoldingAquisitions.propTypes = {
  holding: PropTypes.object.isRequired,
  withSummary: PropTypes.bool,
};

export default HoldingAquisitions;
