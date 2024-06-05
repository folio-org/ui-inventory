import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import { MultiColumnList } from '@folio/stripes/components';

import { getDateWithTime } from '../../../utils';
import { ACQUISITION_COLUMN_NAMES } from '../../../constants';

const visibleColumns = [
  ACQUISITION_COLUMN_NAMES.poLineNumber,
  ACQUISITION_COLUMN_NAMES.orderStatus,
  ACQUISITION_COLUMN_NAMES.polReceiptStatus,
  ACQUISITION_COLUMN_NAMES.orderSentDate,
  ACQUISITION_COLUMN_NAMES.orderType,
];

const columnMapping = {
  [ACQUISITION_COLUMN_NAMES.poLineNumber]: <FormattedMessage id="ui-inventory.acq.polNumber" />,
  [ACQUISITION_COLUMN_NAMES.orderStatus]: <FormattedMessage id="ui-inventory.acq.orderStatus" />,
  [ACQUISITION_COLUMN_NAMES.polReceiptStatus]: <FormattedMessage id="ui-inventory.acq.receiptStatus" />,
  [ACQUISITION_COLUMN_NAMES.orderSentDate]: <FormattedMessage id="ui-inventory.acq.orderSentDate" />,
  [ACQUISITION_COLUMN_NAMES.orderType]: <FormattedMessage id="ui-inventory.acq.orderType" />,
};

const formatter = {
  [ACQUISITION_COLUMN_NAMES.poLineNumber]: i => <Link to={`/orders/lines/view/${i.poLineId}`}>{i.poLineNumber}</Link>,
  [ACQUISITION_COLUMN_NAMES.orderStatus]: i => (
    <>
      <FormattedMessage id={`ui-inventory.acq.orderStatus.${i.orderStatus}`} />
      {i.orderCloseReason?.reason && ` - ${i.orderCloseReason.reason}`}
    </>
  ),
  [ACQUISITION_COLUMN_NAMES.polReceiptStatus]: i => <FormattedMessage id={`ui-inventory.acq.receiptStatus.${i.polReceiptStatus}`} />,
  [ACQUISITION_COLUMN_NAMES.orderSentDate]: i => getDateWithTime(i.orderSentDate),
  [ACQUISITION_COLUMN_NAMES.orderType]: i => <FormattedMessage id={`ui-inventory.acq.orderType.${i.orderType}`} />,
};

const HoldingAcquisitionList = ({
  isLoading,
  holdingOrderLines,
  tenantId,
}) => {
  return (
    <MultiColumnList
      id={`${tenantId}-list-holding-order-lines`}
      loading={isLoading}
      contentData={holdingOrderLines}
      visibleColumns={visibleColumns}
      columnMapping={columnMapping}
      formatter={formatter}
      interactive={false}
    />
  );
};

HoldingAcquisitionList.propTypes = {
  holdingOrderLines: PropTypes.arrayOf(PropTypes.object).isRequired,
  isLoading: PropTypes.bool.isRequired,
  tenantId: PropTypes.string.isRequired,
};

export default HoldingAcquisitionList;
