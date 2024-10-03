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

const HoldingAcquisitionList = ({
  isLoading,
  holdingOrderLines,
  tenantId,
  isActiveTenantAcquisition,
}) => {
  const formatter = {
    [ACQUISITION_COLUMN_NAMES.poLineNumber]: acq => (
      isActiveTenantAcquisition
        ? <Link to={`/orders/lines/view/${acq.poLineId}`}>{acq.poLineNumber}</Link>
        : <span>{acq.poLineNumber}</span>
    ),
    [ACQUISITION_COLUMN_NAMES.orderStatus]: acq => (
      <>
        <FormattedMessage id={`ui-inventory.acq.orderStatus.${acq.orderStatus}`} />
        {acq.orderCloseReason?.reason && ` - ${acq.orderCloseReason.reason}`}
      </>
    ),
    [ACQUISITION_COLUMN_NAMES.polReceiptStatus]: acq => <FormattedMessage id={`ui-inventory.acq.receiptStatus.${acq.polReceiptStatus}`} />,
    [ACQUISITION_COLUMN_NAMES.orderSentDate]: acq => getDateWithTime(acq.orderSentDate),
    [ACQUISITION_COLUMN_NAMES.orderType]: acq => <FormattedMessage id={`ui-inventory.acq.orderType.${acq.orderType}`} />,
  };

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
  isActiveTenantAcquisition: PropTypes.bool.isRequired,
};

export default HoldingAcquisitionList;
