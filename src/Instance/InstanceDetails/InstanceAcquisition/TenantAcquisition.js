import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import {
  MultiColumnList,
  NoValue,
} from '@folio/stripes/components';

import { getDateWithTime } from '../../../utils';
import { COLUMN_NAMES } from '../../../constants';

const visibleColumns = [
  COLUMN_NAMES.poLineNumber,
  COLUMN_NAMES.orderStatus,
  COLUMN_NAMES.polReceiptStatus,
  COLUMN_NAMES.dateOrdered,
  COLUMN_NAMES.acqUnit,
  COLUMN_NAMES.orderType,
];

const columnMapping = {
  [COLUMN_NAMES.poLineNumber]: <FormattedMessage id="ui-inventory.acq.polNumber" />,
  [COLUMN_NAMES.orderStatus]: <FormattedMessage id="ui-inventory.acq.orderStatus" />,
  [COLUMN_NAMES.polReceiptStatus]: <FormattedMessage id="ui-inventory.acq.receiptStatus" />,
  [COLUMN_NAMES.dateOrdered]: <FormattedMessage id="ui-inventory.acq.dateOpened" />,
  [COLUMN_NAMES.acqUnit]: <FormattedMessage id="ui-inventory.acq.acqUnit" />,
  [COLUMN_NAMES.orderType]: <FormattedMessage id="ui-inventory.acq.orderType" />,
};

const formatter = {
  [COLUMN_NAMES.poLineNumber]: i => <Link to={`/orders/lines/view/${i.id}`}>{i.poLineNumber}</Link>,
  [COLUMN_NAMES.orderStatus]: i => (
    <>
      {i.order?.workflowStatus ? <FormattedMessage id={`ui-inventory.acq.orderStatus.${i.order.workflowStatus}`} /> : <NoValue />}
      {i.order?.orderCloseReason?.reason && ` - ${i.order.orderCloseReason.reason}`}
    </>
  ),
  [COLUMN_NAMES.polReceiptStatus]: i => <FormattedMessage id={`ui-inventory.acq.receiptStatus.${i.receiptStatus}`} />,
  [COLUMN_NAMES.dateOrdered]: i => getDateWithTime(i.order?.dateOrdered),
  [COLUMN_NAMES.acqUnit]: i => i.order?.acqUnits?.map(u => u.name)?.join(', ') || <NoValue />,
  [COLUMN_NAMES.orderType]: i => (i.order?.orderType ? <FormattedMessage id={`ui-inventory.acq.orderType.${i.order.orderType}`} /> : <NoValue />),
};

const TenantAcquisition = ({
  acquisitions,
  isLoading,
  tenantId,
}) => (
  <MultiColumnList
    id={`${tenantId}list-instance-acquisitions`}
    loading={isLoading}
    contentData={acquisitions}
    visibleColumns={visibleColumns}
    columnMapping={columnMapping}
    formatter={formatter}
    interactive={false}
  />
);

TenantAcquisition.propTypes = {
  acquisitions: PropTypes.arrayOf(PropTypes.object).isRequired,
  isLoading: PropTypes.bool.isRequired,
  tenantId: PropTypes.string.isRequired,
};

export default TenantAcquisition;
