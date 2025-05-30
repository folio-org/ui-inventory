import {
  useCallback,
  useMemo,
} from 'react';
import {
  get,
  isEmpty,
  values,
} from 'lodash';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

import { NoValue } from '@folio/stripes/components';

import useItemOpenLoansQuery from '../useItemOpenLoansQuery';
import useItemServicePointsQuery from '../useItemServicePointsQuery';
import useStaffMembersQuery from '../../../hooks/useStaffMembersQuery';

import {
  areAllFieldsEmpty,
  getDate,
  getDateWithTime,
} from '../../../utils';

const useItemDetailsData = ({
  item = {},
  instance,
  refLookup,
  referenceTables,
  requestCount,
  requestsUrl,
  holdingLocation,
}) => {
  const { locationsById } = referenceTables;

  const { servicePoints } = useItemServicePointsQuery(item.lastCheckIn?.servicePointId);
  const { staffMembers } = useStaffMembersQuery(item.lastCheckIn?.staffMemberId);
  const { openLoans } = useItemOpenLoansQuery(item.id);
  const staffMember = staffMembers[0];

  const openLoan = openLoans.loans?.[0];

  const layoutNotes = useCallback((noteTypes, notes) => {
    if (!isEmpty(notes)) {
      return noteTypes
        .filter(noteType => notes.find(note => note.itemNoteTypeId === noteType.id))
        .map((noteType) => ({
          staffOnly: {
            label: <FormattedMessage id="ui-inventory.staffOnly" />,
            value: notes.map((note, j) => {
              if (note.itemNoteTypeId === noteType.id) {
                return <div key={`${noteType}-${j}`}>{note.staffOnly ? 'Yes' : 'No'}</div>;
              }
              return null;
            }),
          },
          noteType: {
            label: noteType.name,
            value: notes.map((note, j) => {
              if (note.itemNoteTypeId === noteType.id) {
                return <div key={`${note.id} - ${j}`}>{note.note || <NoValue />}</div>;
              }
              return null;
            }),
          },
        }));
    }

    return [];
  }, []);

  const layoutCirculationNotes = useCallback((notes) => {
    if (!isEmpty(notes)) {
      return ['Check out', 'Check in']
        .filter(noteType => notes.find(note => note.noteType === noteType))
        .map((noteType) => ({
          staffOnly: {
            label: <FormattedMessage id="ui-inventory.staffOnly" />,
            value: notes.map((note, j) => {
              if (note.noteType === noteType) {
                return <div key={`note-staff-only-${j}`}>{note.staffOnly ? 'Yes' : 'No'}</div>;
              }
              return null;
            }),
          },
          noteType: {
            label: `${noteType} note`,
            value: notes.map((note, j) => {
              if (note.noteType === noteType) {
                return <div key={`note-name-${j}`}>{note.note || <NoValue />}</div>;
              }
              return null;
            }),
          },
        }));
    }

    return [];
  }, []);

  const itemLocation = useMemo(() => ({
    permanentLocation: {
      name: get(item, ['permanentLocation', 'name'], <NoValue />),
      isActive: locationsById[item.permanentLocation?.id]?.isActive,
    },
    temporaryLocation: {
      name: get(item, ['temporaryLocation', 'name'], <NoValue />),
      isActive: locationsById[item.temporaryLocation?.id]?.isActive,
    },
    effectiveLocation: {
      name: get(item, ['effectiveLocation', 'name'], <NoValue />),
      isActive: locationsById[item.effectiveLocation?.id]?.isActive,
    },
  }), [item, locationsById]);

  const administrativeData = useMemo(() => ({
    discoverySuppress: instance?.discoverySuppress,
    hrid: item?.hrid,
    barcode: item?.barcode,
    accessionNumber: item?.accessionNumber,
    identifier: item?.itemIdentifier,
    formerIds: item?.formerIds,
    statisticalCodeIds: item?.statisticalCodeIds || [],
    administrativeNotes: item?.administrativeNotes || [],
  }), [instance, item]);

  const itemData = useMemo(() => ({
    materialType: item?.materialType?.name,
    callNumberType: refLookup(referenceTables.callNumberTypes, item?.itemLevelCallNumberTypeId)?.name,
    callNumberPrefix: item?.itemLevelCallNumberPrefix,
    callNumber: item?.itemLevelCallNumber,
    callNumberSuffix: item?.itemLevelCallNumberSuffix,
    copyNumber: item?.copyNumber,
    numberOfPieces: item?.numberOfPieces,
    descriptionOfPieces: item?.descriptionOfPieces,
    effectiveShelvingOrder: item?.effectiveShelvingOrder,
  }), [item, referenceTables]);

  const enumerationData = useMemo(() => ({
    displaySummary: item?.displaySummary,
    enumeration: item?.enumeration,
    chronology: item?.chronology,
    volume: item?.volume,
    yearCaption: item?.yearCaption || [],
  }), [item]);

  const condition = useMemo(() => ({
    numberOfMissingPieces: item?.numberOfMissingPieces,
    missingPieces: item?.missingPieces,
    missingPiecesDate: getDate(item?.missingPiecesDate),
    itemDamagedStatus: refLookup(referenceTables.itemDamagedStatuses, item?.itemDamagedStatusId)?.name,
    itemDamagedStatusDate: getDate(item?.itemDamagedStatusDate),
  }), [item, referenceTables]);

  const itemNotes = useMemo(() => ({
    notes: layoutNotes(referenceTables.itemNoteTypes, item?.notes || []),
  }), [item, referenceTables, layoutNotes]);

  const loanAndAvailability = useMemo(() => ({
    permanentLoanType: item?.permanentLoanType?.name,
    temporaryLoanType: item?.temporaryLoanType?.name,
    itemStatusDate: getDateWithTime(item?.status?.date),
    requestLink: requestCount ? <Link to={requestsUrl}>{requestCount}</Link> : 0,
    borrower: openLoan?.borrower ? <Link to={`/users/view/${openLoan.userId}`}>{openLoan.borrower.barcode}</Link> : null,
    loanDate: openLoan?.loanDate && getDateWithTime(openLoan.loanDate),
    dueDate: openLoan?.dueDate && getDateWithTime(openLoan.dueDate),
    circulationNotes: layoutCirculationNotes(item?.circulationNotes || []),
  }), [item, openLoan, requestCount]);

  const electronicAccess = useMemo(() => ({
    electronicAccess: item?.electronicAccess || [],
  }), [item]);

  const circulationHistory = useMemo(() => ({
    checkInDate: getDateWithTime(item?.lastCheckIn?.dateTime),
    servicePointName: item?.lastCheckIn?.dateTime && servicePoints[0]?.name,
    source: staffMember?.id && (
      <Link to={`/users/view/${staffMember.id}`}>
        {`${staffMember.personal.lastName}, ${staffMember.personal.firstName} ${staffMember.personal.middleName || ''}`}
      </Link>
    )
  }), [item, staffMember]);

  const initialAccordionsState = {
    acc01: !areAllFieldsEmpty(values(administrativeData)),
    acc02: !areAllFieldsEmpty(values(itemData)),
    acc03: !areAllFieldsEmpty(values(enumerationData)),
    acc04: !areAllFieldsEmpty(values(condition)),
    acc05: !areAllFieldsEmpty(values(itemNotes)),
    acc06: !areAllFieldsEmpty(values(loanAndAvailability)),
    acc07: !areAllFieldsEmpty([...values(holdingLocation), ...values(itemLocation)]),
    acc08: !areAllFieldsEmpty(values(electronicAccess)),
    acc09: !areAllFieldsEmpty(values(circulationHistory)),
    acc10: !areAllFieldsEmpty(values(item.boundWithTitles)),
    itemAcquisitionAccordion: true,
  };

  return {
    itemLocation,
    administrativeData,
    itemData,
    enumerationData,
    condition,
    itemNotes: itemNotes.notes,
    loanAndAvailability,
    electronicAccess,
    circulationHistory,
    initialAccordionsState,
    boundWithTitles: item.boundWithTitles,
  };
};

export default useItemDetailsData;
