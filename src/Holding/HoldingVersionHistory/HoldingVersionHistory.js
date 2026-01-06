import { useContext } from 'react';
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

export const getItemFormatter = (fieldLabelsMap, fieldFormatter) => (element, i) => {
  if (!element) return null;

  const { name: fieldName, value, collectionName } = element;
  const compositeKey = collectionName && fieldName
    ? `${collectionName}.${fieldName}`
    : null;

  const label = (compositeKey && fieldLabelsMap?.[compositeKey])
    || fieldLabelsMap?.[fieldName]
    || fieldLabelsMap?.[collectionName];

  const formattedValue = (compositeKey && fieldFormatter?.[compositeKey]?.(value))
    || fieldFormatter?.[fieldName]?.(value)
    || fieldFormatter?.[collectionName]?.(value)
    || value;

  return (
    <li key={i}>
      {fieldName && <strong>{label}: </strong>}
      {formattedValue}
    </li>
  );
};

const HoldingVersionHistory = ({ onClose, holdingId }) => {
  const { formatMessage } = useIntl();
  const referenceData = useContext(DataContext);

  const {
    data,
    totalRecords,
    isLoading,
    isLoadingMore,
    fetchNextPage,
    hasNextPage,
  } = useHoldingAuditDataQuery(holdingId);

  const {
    actionsMap,
    versions,
  } = useInventoryVersionHistory(data);

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
    additionalCallNumbers: formatMessage({ id: 'ui-inventory.additionalCallNumbers' }),
    'additionalCallNumbers.prefix': formatMessage({ id: 'ui-inventory.additionalCallNumberPrefix' }),
    'additionalCallNumbers.suffix': formatMessage({ id: 'ui-inventory.additionalCallNumberSuffix' }),
    'additionalCallNumbers.typeId': formatMessage({ id: 'ui-inventory.additionalCallNumberType' }),
    'additionalCallNumbers.callNumber': formatMessage({ id: 'ui-inventory.additionalCallNumber' }),
    'holdingsStatements.statement': formatMessage({ id: 'ui-inventory.holdingsStatement' }),
    'holdingsStatements.note': formatMessage({ id: 'ui-inventory.holdingsStatementPublicNote' }),
    'holdingsStatements.staffNote': formatMessage({ id: 'ui-inventory.holdingsStatementStaffNote' }),
    'holdingsStatementsForSupplements.statement': formatMessage({ id: 'ui-inventory.holdingsStatementForSupplements' }),
    'holdingsStatementsForSupplements.note': formatMessage({ id: 'ui-inventory.holdingsStatementForSupplementsPublicNote' }),
    'holdingsStatementsForSupplements.staffNote': formatMessage({ id: 'ui-inventory.holdingsStatementForSupplementsStaffNote' }),
    'holdingsStatementsForIndexes.statement': formatMessage({ id: 'ui-inventory.holdingsStatementForIndexes' }),
    'holdingsStatementsForIndexes.note': formatMessage({ id: 'ui-inventory.holdingsStatementForIndexesPublicNote' }),
    'holdingsStatementsForIndexes.staffNote': formatMessage({ id: 'ui-inventory.holdingsStatementForIndexesStaffNote' }),
    'notes.holdingsNoteTypeId': formatMessage({ id: 'ui-inventory.noteType' }),
    'notes.note': formatMessage({ id: 'ui-inventory.note' }),
    'notes.staffOnly': formatMessage({ id: 'ui-inventory.staffOnly' }),
    'electronicAccess.urlRelationship': formatMessage({ id: 'ui-inventory.urlRelationship' }),
    'electronicAccess.uri': formatMessage({ id: 'ui-inventory.uri' }),
    'electronicAccess.linkText': formatMessage({ id: 'ui-inventory.linkText' }),
    'electronicAccess.materialsSpecification': formatMessage({ id: 'ui-inventory.materialsSpecification' }),
    'electronicAccess.urlPublicNote': formatMessage({ id: 'ui-inventory.urlPublicNote' }),
    'entries.publicDisplay': formatMessage({ id: 'ui-inventory.publicDisplay' }),
    'entries.enumeration': formatMessage({ id: 'ui-inventory.enumeration' }),
    'entries.chronology': formatMessage({ id: 'ui-inventory.chronology' }),
  };

  const fieldFormatter = getFieldFormatter(referenceData);
  const itemFormatter = getItemFormatter(fieldLabelsMap, fieldFormatter);

  return (
    <AuditLogPane
      versions={versions}
      onClose={onClose}
      isLoadMoreVisible={hasNextPage}
      handleLoadMore={() => fetchNextPage()}
      isLoading={isLoadingMore}
      isInitialLoading={isLoading}
      fieldLabelsMap={fieldLabelsMap}
      fieldFormatter={fieldFormatter}
      itemFormatter={itemFormatter}
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
