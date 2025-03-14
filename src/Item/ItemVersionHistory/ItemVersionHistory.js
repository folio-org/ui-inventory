import { useContext, useState } from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';

import { AuditLogPane } from '@folio/stripes/components';

import { DataContext } from '../../contexts';
import {
  useItemAuditDataQuery,
  useInventoryVersionHistory,
} from '../../hooks';

import { getDateWithTime } from '../../utils';

export const createFieldFormatter = (referenceData, circulationHistory) => ({
  discoverySuppress: value => value.toString(),
  typeId: value => referenceData.callNumberTypes?.find(type => type.id === value)?.name,
  itemLevelCallNumberTypeId: value => referenceData.callNumberTypes?.find(type => type.id === value)?.name,
  itemDamagedStatusId: value => referenceData.itemDamagedStatuses?.find(type => type.id === value)?.name,
  permanentLocationId: value => referenceData.locationsById[value]?.name,
  temporaryLocationId: value => referenceData.locationsById[value]?.name,
  effectiveLocationId: value => referenceData.locationsById[value]?.name,
  permanentLoanTypeId: value => referenceData.loanTypes?.find(type => type.id === value)?.name,
  temporaryLoanTypeId: value => referenceData.loanTypes?.find(type => type.id === value)?.name,
  materialTypeId: value => referenceData.materialTypes?.find(type => type.id === value)?.name,
  statisticalCodeIds: value => {
    const statisticalCode = referenceData.statisticalCodes?.find(code => code.id === value);

    return `${statisticalCode.statisticalCodeType.name}: ${statisticalCode.code} - ${statisticalCode.name}`;
  },
  relationshipId: value => referenceData.electronicAccessRelationships?.find(type => type.id === value)?.name,
  staffOnly: value => value.toString(),
  itemNoteTypeId: value => referenceData.itemNoteTypes?.find(type => type.id === value)?.name,
  date: value => getDateWithTime(value),
  servicePointId: () => circulationHistory.servicePointName,
  staffMemberId: () => circulationHistory.source,
  dateTime: value => getDateWithTime(value),
  source: value => `${value.personal.lastName}, ${value.personal.firstName}`,
});

const ItemVersionHistory = ({
  onClose,
  itemId,
  circulationHistory,
}) => {
  const { formatMessage } = useIntl();
  const referenceData = useContext(DataContext);

  const [lastVersionEventTs, setLastVersionEventTs] = useState(null);

  const {
    data,
    totalRecords,
    isLoading,
  } = useItemAuditDataQuery(itemId, lastVersionEventTs);
  const {
    actionsMap,
    versions,
    isLoadMoreVisible,
  } = useInventoryVersionHistory({ data, totalRecords });

  const fieldLabelsMap = {
    accessionNumber: formatMessage({ id: 'ui-inventory.accessionNumber' }),
    administrativeNotes: formatMessage({ id: 'ui-inventory.administrativeNotes' }),
    barcode: formatMessage({ id: 'ui-inventory.itemBarcode' }),
    callNumber: formatMessage({ id: 'ui-inventory.effectiveCallNumber' }),
    circulationNotes: formatMessage({ id: 'ui-inventory.circulationHistory' }),
    chronology: formatMessage({ id: 'ui-inventory.chronology' }),
    copyNumber: formatMessage({ id: 'ui-inventory.copyNumber' }),
    date: formatMessage({ id: 'ui-inventory.date' }),
    dateTime: formatMessage({ id: 'ui-inventory.checkInDate' }),
    descriptionOfPieces: formatMessage({ id: 'ui-inventory.descriptionOfPieces' }),
    discoverySuppress: formatMessage({ id: 'ui-inventory.discoverySuppress' }),
    displaySummary: formatMessage({ id: 'ui-inventory.displaySummary' }),
    effectiveLocationId: formatMessage({ id: 'ui-inventory.effectiveLocation' }),
    electronicAccess: formatMessage({ id: 'ui-inventory.electronicAccess' }),
    enumeration: formatMessage({ id: 'ui-inventory.enumeration' }),
    formerIds: formatMessage({ id: 'ui-inventory.formerId' }),
    itemDamagedStatusDate: formatMessage({ id: 'ui-inventory.itemDamagedStatusDate' }),
    itemDamagedStatusId: formatMessage({ id: 'ui-inventory.itemDamagedStatus' }),
    itemIdentifier: formatMessage({ id: 'ui-inventory.itemIdentifier' }),
    itemLevelCallNumber: formatMessage({ id: 'ui-inventory.callNumber' }),
    itemLevelCallNumberPrefix: formatMessage({ id: 'ui-inventory.callNumberPrefix' }),
    itemLevelCallNumberSuffix: formatMessage({ id: 'ui-inventory.callNumberSuffix' }),
    itemLevelCallNumberTypeId: formatMessage({ id: 'ui-inventory.callNumberType' }),
    materialTypeId: formatMessage({ id: 'ui-inventory.materialType' }),
    missingPieces: formatMessage({ id: 'ui-inventory.missingPieces' }),
    missingPiecesDate: formatMessage({ id: 'ui-inventory.date' }),
    name: formatMessage({ id: 'ui-inventory.item.availability.itemStatus' }),
    notes: formatMessage({ id: 'ui-inventory.itemNotes' }),
    numberOfMissingPieces: formatMessage({ id: 'ui-inventory.numberOfMissingPieces' }),
    numberOfPieces: formatMessage({ id: 'ui-inventory.numberOfPieces' }),
    permanentLoanTypeId: formatMessage({ id: 'ui-inventory.permanentLoantype' }),
    permanentLocationId: formatMessage({ id: 'ui-inventory.permanentLocation' }),
    prefix: formatMessage({ id: 'ui-inventory.callNumberPrefix' }),
    servicePointId: formatMessage({ id: 'ui-inventory.servicePoint' }),
    staffMemberId: formatMessage({ id: 'ui-inventory.source' }),
    statisticalCodeIds: formatMessage({ id: 'ui-inventory.statisticalCodes' }),
    suffix: formatMessage({ id: 'ui-inventory.callNumberSuffix' }),
    temporaryLoanTypeId: formatMessage({ id: 'ui-inventory.temporaryLoantype' }),
    temporaryLocationId: formatMessage({ id: 'ui-inventory.temporaryLocation' }),
    typeId: formatMessage({ id: 'ui-inventory.callNumberType' }),
    volume: formatMessage({ id: 'ui-inventory.volume' }),
    yearCaption: formatMessage({ id: 'ui-inventory.yearCaption' }),
  };

  const fieldFormatter = createFieldFormatter(referenceData, circulationHistory);

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
      totalVersions={totalRecords ?? 0}
    />
  );
};

ItemVersionHistory.propTypes = {
  itemId: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  circulationHistory: PropTypes.object.isRequired,
};

export default ItemVersionHistory;
