import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import {
  MultiColumnList,
  NoValue,
} from '@folio/stripes/components';

import { getDateWithTime } from '../../../utils';
import { ACQISITION_COLUMN_NAMES } from '../../../constants';

const visibleColumns = [
  ACQISITION_COLUMN_NAMES.poLineNumber,
  ACQISITION_COLUMN_NAMES.orderStatus,
  ACQISITION_COLUMN_NAMES.polReceiptStatus,
  ACQISITION_COLUMN_NAMES.dateOrdered,
  ACQISITION_COLUMN_NAMES.acqUnit,
  ACQISITION_COLUMN_NAMES.orderType,
];

const columnMapping = {
  [ACQISITION_COLUMN_NAMES.poLineNumber]: <FormattedMessage id="ui-inventory.acq.polNumber" />,
  [ACQISITION_COLUMN_NAMES.orderStatus]: <FormattedMessage id="ui-inventory.acq.orderStatus" />,
  [ACQISITION_COLUMN_NAMES.polReceiptStatus]: <FormattedMessage id="ui-inventory.acq.receiptStatus" />,
  [ACQISITION_COLUMN_NAMES.dateOrdered]: <FormattedMessage id="ui-inventory.acq.dateOpened" />,
  [ACQISITION_COLUMN_NAMES.acqUnit]: <FormattedMessage id="ui-inventory.acq.acqUnit" />,
  [ACQISITION_COLUMN_NAMES.orderType]: <FormattedMessage id="ui-inventory.acq.orderType" />,
};

const formatter = {
  [ACQISITION_COLUMN_NAMES.poLineNumber]: i => <Link to={`/orders/lines/view/${i.id}`}>{i.poLineNumber}</Link>,
  [ACQISITION_COLUMN_NAMES.orderStatus]: i => (
    <>
      {i.order?.workflowStatus ? <FormattedMessage id={`ui-inventory.acq.orderStatus.${i.order.workflowStatus}`} /> : <NoValue />}
      {i.order?.orderCloseReason?.reason && ` - ${i.order.orderCloseReason.reason}`}
    </>
  ),
  [ACQISITION_COLUMN_NAMES.polReceiptStatus]: i => <FormattedMessage id={`ui-inventory.acq.receiptStatus.${i.receiptStatus}`} />,
  [ACQISITION_COLUMN_NAMES.dateOrdered]: i => getDateWithTime(i.order?.dateOrdered),
  [ACQISITION_COLUMN_NAMES.acqUnit]: i => i.order?.acqUnits?.map(u => u.name)?.join(', ') || <NoValue />,
  [ACQISITION_COLUMN_NAMES.orderType]: i => (i.order?.orderType ? <FormattedMessage id={`ui-inventory.acq.orderType.${i.order.orderType}`} /> : <NoValue />),
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
