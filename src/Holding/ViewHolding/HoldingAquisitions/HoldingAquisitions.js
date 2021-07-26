import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import {
  MultiColumnList,
} from '@folio/stripes/components';

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

const HoldingAquisitions = ({ holding }) => {
  const { isLoading, holdingOrderLines } = useHoldingOrderLines(holding.id);

  return (
    <MultiColumnList
      id="list-holding-order-lines"
      loading={isLoading}
      contentData={holdingOrderLines}
      visibleColumns={visibleColumns}
      columnMapping={columnMapping}
      formatter={formatter}
      interactive={false}
    />
  );
};

HoldingAquisitions.propTypes = {
  holding: PropTypes.object.isRequired,
};

export default HoldingAquisitions;
