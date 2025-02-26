import { useContext } from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';

import { AuditLogPane } from '@folio/stripes-acq-components';

import { useItemAuditDataQuery } from '../../hooks';
import { DataContext } from '../../contexts';
import { getDateWithTime } from '../../utils';

const ItemVersionHistory = ({
  onClose,
  itemId,
  circulationHistory,
}) => {
  const { formatMessage } = useIntl();
  const referenceData = useContext(DataContext);

  const { data, isLoading } = useItemAuditDataQuery(itemId);

  const fieldLabelsMap = {
    discoverySuppress: formatMessage({ id: 'ui-inventory.discoverySuppress' }),
    callNumber: formatMessage({ id: 'ui-inventory.effectiveCallNumber' }),
    prefix: formatMessage({ id: 'ui-inventory.callNumberPrefix' }),
    suffix: formatMessage({ id: 'ui-inventory.callNumberSuffix' }),
    typeId: formatMessage({ id: 'ui-inventory.callNumberType' }),
    accessionNumber: formatMessage({ id: 'ui-inventory.accessionNumber' }),
    barcode : formatMessage({ id: 'ui-inventory.itemBarcode' }),
    chronology: formatMessage({ id: 'ui-inventory.chronology' }),
    copyNumber: formatMessage({ id: 'ui-inventory.copyNumber' }),
    descriptionOfPieces: formatMessage({ id: 'ui-inventory.descriptionOfPieces' }),
    displaySummary: formatMessage({ id: 'ui-inventory.displaySummary' }),
    effectiveLocationId: formatMessage({ id: 'ui-inventory.effectiveLocation' }),
    enumeration: formatMessage({ id: 'ui-inventory.enumeration' }),
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
    numberOfMissingPieces: formatMessage({ id: 'ui-inventory.numberOfMissingPieces' }),
    numberOfPieces: formatMessage({ id: 'ui-inventory.numberOfPieces' }),
    permanentLoanTypeId: formatMessage({ id: 'ui-inventory.permanentLoantype' }),
    permanentLocationId: formatMessage({ id: 'ui-inventory.permanentLocation' }),
    temporaryLoanTypeId: formatMessage({ id: 'ui-inventory.temporaryLoantype' }),
    temporaryLocationId: formatMessage({ id: 'ui-inventory.temporaryLocation' }),
    volume: formatMessage({ id: 'ui-inventory.volume' }),
    administrativeNotes: formatMessage({ id: 'ui-inventory.administrativeNotes' }),
    circulationNotes: formatMessage({ id: 'ui-inventory.circulationHistory' }),
    electronicAccess: formatMessage({ id: 'ui-inventory.electronicAccess' }),
    formerIds: formatMessage({ id: 'ui-inventory.formerId' }),
    notes: formatMessage({ id: 'ui-inventory.itemNotes' }),
    statisticalCodeIds: formatMessage({ id: 'ui-inventory.statisticalCodes' }),
    yearCaption: formatMessage({ id: 'ui-inventory.yearCaption' }),
    dateTime: formatMessage({ id: 'ui-inventory.checkInDate' }),
    servicePointId: formatMessage({ id: 'ui-inventory.servicePoint' }),
    staffMemberId: formatMessage({ id: 'ui-inventory.source' }),
    name: formatMessage({ id: 'ui-inventory.item.availability.itemStatus' }),
    date: formatMessage({ id: 'ui-inventory.date' }),
  };

  const fieldFormatter = {
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
  };

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

ItemVersionHistory.propTypes = {
  itemId: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  circulationHistory: PropTypes.object.isRequired,
};

export default ItemVersionHistory;
