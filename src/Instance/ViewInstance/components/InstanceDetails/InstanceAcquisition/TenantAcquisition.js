import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import {
  MultiColumnList,
  NoValue,
} from '@folio/stripes/components';

import { getDateWithTime } from '../../../../../utils';
import { ACQUISITION_COLUMN_NAMES } from '../../../../../constants';

const visibleColumns = [
  ACQUISITION_COLUMN_NAMES.poLineNumber,
  ACQUISITION_COLUMN_NAMES.orderStatus,
  ACQUISITION_COLUMN_NAMES.polReceiptStatus,
  ACQUISITION_COLUMN_NAMES.dateOrdered,
  ACQUISITION_COLUMN_NAMES.acqUnit,
  ACQUISITION_COLUMN_NAMES.orderType,
];

const columnMapping = {
  [ACQUISITION_COLUMN_NAMES.poLineNumber]: <FormattedMessage id="ui-inventory.acq.polNumber" />,
  [ACQUISITION_COLUMN_NAMES.orderStatus]: <FormattedMessage id="ui-inventory.acq.orderStatus" />,
  [ACQUISITION_COLUMN_NAMES.polReceiptStatus]: <FormattedMessage id="ui-inventory.acq.receiptStatus" />,
  [ACQUISITION_COLUMN_NAMES.dateOrdered]: <FormattedMessage id="ui-inventory.acq.dateOpened" />,
  [ACQUISITION_COLUMN_NAMES.acqUnit]: <FormattedMessage id="ui-inventory.acq.acqUnit" />,
  [ACQUISITION_COLUMN_NAMES.orderType]: <FormattedMessage id="ui-inventory.acq.orderType" />,
};

const TenantAcquisition = ({
  acquisitions,
  isLoading,
  tenantId,
  isActiveTenantAcquisition,
}) => {
  const formatter = {
    [ACQUISITION_COLUMN_NAMES.poLineNumber]: i => (
      isActiveTenantAcquisition
        ? <Link to={`/orders/lines/view/${i.id}`}>{i.poLineNumber}</Link>
        : <span>{i.poLineNumber}</span>
    ),
    [ACQUISITION_COLUMN_NAMES.orderStatus]: i => (
      <>
        {i.order?.workflowStatus ? <FormattedMessage id={`ui-inventory.acq.orderStatus.${i.order.workflowStatus}`} /> : <NoValue />}
        {i.order?.orderCloseReason?.reason && ` - ${i.order.orderCloseReason.reason}`}
      </>
    ),
    [ACQUISITION_COLUMN_NAMES.polReceiptStatus]: i => <FormattedMessage id={`ui-inventory.acq.receiptStatus.${i.receiptStatus}`} />,
    [ACQUISITION_COLUMN_NAMES.dateOrdered]: i => getDateWithTime(i.order?.dateOrdered),
    [ACQUISITION_COLUMN_NAMES.acqUnit]: i => i.order?.acqUnits?.map(u => u.name)?.join(', ') || <NoValue />,
    [ACQUISITION_COLUMN_NAMES.orderType]: i => (i.order?.orderType ? <FormattedMessage id={`ui-inventory.acq.orderType.${i.order.orderType}`} /> : <NoValue />),
  };

  return (
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
};

TenantAcquisition.propTypes = {
  acquisitions: PropTypes.arrayOf(PropTypes.object).isRequired,
  isLoading: PropTypes.bool.isRequired,
  tenantId: PropTypes.string.isRequired,
  isActiveTenantAcquisition: PropTypes.bool.isRequired,
};

export default TenantAcquisition;
