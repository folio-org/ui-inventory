import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import { useStripes } from '@folio/stripes/core';
import {
  Accordion,
  MultiColumnList,
  NoValue,
} from '@folio/stripes/components';

import { getDateWithTime } from '../../../utils';
import { useControlledAccordion } from '../../../common';
import useInstanceAcquisition from './useInstanceAcquisition';

const visibleColumns = ['poLineNumber', 'orderStatus', 'polReceiptStatus', 'dateOrdered', 'acqUnit', 'orderType'];
const columnMapping = {
  poLineNumber: <FormattedMessage id="ui-inventory.acq.polNumber" />,
  orderStatus: <FormattedMessage id="ui-inventory.acq.orderStatus" />,
  polReceiptStatus: <FormattedMessage id="ui-inventory.acq.receiptStatus" />,
  dateOrdered: <FormattedMessage id="ui-inventory.acq.dateOpened" />,
  acqUnit: <FormattedMessage id="ui-inventory.acq.acqUnit" />,
  orderType: <FormattedMessage id="ui-inventory.acq.orderType" />,
};
const formatter = {
  poLineNumber: i => <Link to={`/orders/lines/view/${i.id}`}>{i.poLineNumber}</Link>,
  orderStatus: i => (
    <>
      {i.order?.workflowStatus ? <FormattedMessage id={`ui-inventory.acq.orderStatus.${i.order.workflowStatus}`} /> : <NoValue />}
      {i.order?.orderCloseReason?.reason && ` - ${i.order.orderCloseReason.reason}`}
    </>
  ),
  polReceiptStatus: i => <FormattedMessage id={`ui-inventory.acq.receiptStatus.${i.receiptStatus}`} />,
  dateOrdered: i => getDateWithTime(i.order?.dateOrdered),
  acqUnit: i => i.order?.acqUnits?.map(u => u.name)?.join(', ') || <NoValue />,
  orderType: i => (i.order?.orderType ? <FormattedMessage id={`ui-inventory.acq.orderType.${i.order.orderType}`} /> : <NoValue />),
};

const InstanceAcquisition = ({ accordionId, instanceId }) => {
  const stripes = useStripes();
  const { isLoading, instanceAcquisition } = useInstanceAcquisition(instanceId);
  const controlledAccorion = useControlledAccordion(Boolean(instanceAcquisition?.length));

  if (!(stripes.hasInterface('order-lines') &&
    stripes.hasInterface('orders') &&
    stripes.hasInterface('acquisitions-units'))) return null;

  return (
    <Accordion
      id={accordionId}
      label={<FormattedMessage id="ui-inventory.acquisition" />}
      {...controlledAccorion}
    >
      <MultiColumnList
        id="list-instance-acquisitions"
        loading={isLoading}
        contentData={instanceAcquisition}
        visibleColumns={visibleColumns}
        columnMapping={columnMapping}
        formatter={formatter}
        interactive={false}
      />
    </Accordion>
  );
};

InstanceAcquisition.propTypes = {
  accordionId: PropTypes.string.isRequired,
  instanceId: PropTypes.string.isRequired,
};

export default InstanceAcquisition;
