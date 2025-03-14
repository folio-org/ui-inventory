import {
  useContext,
  useState,
} from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';

import { AuditLogPane } from '@folio/stripes/components';

import {
  useHoldingAuditDataQuery,
  useInventoryVersionHistory,
  useTotalVersions,
} from '../../hooks';
import { DataContext } from '../../contexts';

export const getFieldFormatter = referenceData => ({
  discoverySuppress: value => value.toString(),
  holdingsTypeId: value => referenceData.holdingsTypes?.find(type => type.id === value)?.name,
  statisticalCodeIds: value => {
    const statisticalCode = referenceData.statisticalCodes?.find(code => code.id === value);

    return `${statisticalCode.statisticalCodeType.name}: ${statisticalCode.code} - ${statisticalCode.name}`;
  },
  callNumberTypeId: value => referenceData.callNumberTypes?.find(type => type.id === value)?.name,
  permanentLocationId: value => referenceData.locationsById[value]?.name,
  temporaryLocationId: value => referenceData.locationsById[value]?.name,
  effectiveLocationId: value => referenceData.locationsById[value]?.name,
  illPolicyId: value => referenceData.illPolicies.find(policy => policy.id === value)?.name,
  staffOnly: value => value.toString(),
  holdingsNoteTypeId: value => referenceData.holdingsNoteTypes?.find(noteType => noteType.id === value)?.name,
  relationshipId: value => referenceData.electronicAccessRelationships?.find(noteType => noteType.id === value)?.name,
  publicDisplay: value => value.toString(),
});

const HoldingVersionHistory = ({ onClose, holdingId }) => {
  const { formatMessage } = useIntl();
  const referenceData = useContext(DataContext);

  const [lastVersionEventTs, setLastVersionEventTs] = useState(null);

  const {
    data,
    totalRecords,
    isLoading,
  } = useHoldingAuditDataQuery(holdingId, lastVersionEventTs);

  const {
    actionsMap,
    versions,
    isLoadMoreVisible,
  } = useInventoryVersionHistory({ data, totalRecords });

  const [totalVersions] = useTotalVersions(totalRecords);

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

  const fieldFormatter = getFieldFormatter(referenceData);

  const handleLoadMore = lastEventTs => {
    setLastVersionEventTs(lastEventTs);
  };

  return (
    <AuditLogPane
      versions={versions}
      onClose={onClose}
      isLoadMoreVisible={isLoadMoreVisible}
      handleLoadMore={handleLoadMore}
      isLoading={isLoading}
      fieldLabelsMap={fieldLabelsMap}
      fieldFormatter={fieldFormatter}
      actionsMap={actionsMap}
      totalVersions={totalVersions}
    />
  );
};

HoldingVersionHistory.propTypes = {
  holdingId: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default HoldingVersionHistory;
