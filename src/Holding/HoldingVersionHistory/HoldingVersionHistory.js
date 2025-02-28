import { useContext } from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';

import { AuditLogPane } from '@folio/stripes-acq-components';

import { useHoldingAuditDataQuery } from '../../hooks';
import { DataContext } from '../../contexts';
import { createVersionHistoryFieldFormatter } from '../../utils';

const HoldingVersionHistory = ({ onClose, holdingId }) => {
  const { formatMessage } = useIntl();
  const referenceData = useContext(DataContext);

  const { data, isLoading } = useHoldingAuditDataQuery(holdingId);

  const fieldLabelsMap = {
    discoverySuppress: formatMessage({ id: 'ui-inventory.discoverySuppressed' }),
    hrid: formatMessage({ id: 'ui-inventory.holdingsHrid' }),
    sourceId: formatMessage({ id: 'ui-inventory.holdingsSourceLabel' }),
    formerIds: formatMessage({ id: 'ui-inventory.formerHoldingsId' }),
    holdingsTypeId: formatMessage({ id: 'ui-inventory.holdingsType' }),
    statisticalCodeIds: formatMessage({ id: 'ui-inventory.statisticalCodes' }),
    administrativeNotes: formatMessage({ id: 'ui-inventory.administrativeNotes' }),
    permanentLocationId: formatMessage({ id: 'ui-inventory.permanentLocation' }),
    temporaryLocationId: formatMessage({ id: 'ui-inventory.temporaryLocation' }),
    effectiveLocationId: formatMessage({ id: 'ui-inventory.effectiveLocationHoldings' }),
    shelvingOrder: formatMessage({ id: 'ui-inventory.shelvingOrder' }),
    shelvingTitle: formatMessage({ id: 'ui-inventory.shelvingTitle' }),
    copyNumber: formatMessage({ id: 'ui-inventory.copyNumber' }),
    callNumberTypeId: formatMessage({ id: 'ui-inventory.callNumberType' }),
    callNumberPrefix: formatMessage({ id: 'ui-inventory.callNumberPrefix' }),
    callNumber: formatMessage({ id: 'ui-inventory.callNumber' }),
    callNumberSuffix: formatMessage({ id: 'ui-inventory.callNumberSuffix' }),
    numberOfItems: formatMessage({ id: 'ui-inventory.numberOfItems' }),
    holdingsStatements: formatMessage({ id: 'ui-inventory.holdingsStatements' }),
    holdingsStatementsForIndexes: formatMessage({ id: 'ui-inventory.holdingsStatementForIndexes' }),
    holdingsStatementsForSupplements: formatMessage({ id: 'ui-inventory.holdingsStatementForSupplements' }),
    digitizationPolicy: formatMessage({ id: 'ui-inventory.digitizationPolicy' }),
    illPolicyId: formatMessage({ id: 'ui-inventory.illPolicy' }),
    retentionPolicy: formatMessage({ id: 'ui-inventory.retentionPolicy' }),
    notes: formatMessage({ id: 'ui-inventory.notes' }),
    electronicAccess: formatMessage({ id: 'ui-inventory.electronicAccess' }),
    acquisitionFormat: formatMessage({ id: 'ui-inventory.acquisitionFormat' }),
    acquisitionMethod: formatMessage({ id: 'ui-inventory.acquisitionMethod' }),
    receiptStatus: formatMessage({ id: 'ui-inventory.receiptStatus' }),
    entries: formatMessage({ id: 'ui-inventory.receivingHistory' }),
  };

  const fieldFormatter = createVersionHistoryFieldFormatter(referenceData);

  return (
    <AuditLogPane
      versions={data}
      isLoading={isLoading}
      onClose={onClose}
      fieldLabelsMap={fieldLabelsMap}
      fieldFormatter={fieldFormatter}
    />
  );
};

HoldingVersionHistory.propTypes = {
  holdingId: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default HoldingVersionHistory;
