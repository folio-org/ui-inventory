/* OMFG ESLint. If we have to cuddle the else, we can't
 * can't place comments before the condition.
 * CUDDLING THE ELSE IS WRONG. Yes, I'm shouting. Come fight me.
 */

import {
  Icon,
  NoValue,
} from '@folio/stripes/components';
import { itemStatuses } from '@folio/stripes-inventory-components';

import ItemBarcode from './ItemBarcode';
import { draggableVisibleColumns } from './DraggableItemsList';

/**
 * atoiComparator
 * Compare two strings, e.g. "2" and "33", as numbers. Empty string compares as 0.
 *
 * @param  {[type]} a [description]
 * @param  {[type]} b [description]
 * @return {[type]}   [description]
 */
const atoiComparator = (a, b) => {
  const na = a ? Number.parseInt(a, 10) : 0;
  const nb = b ? Number.parseInt(b, 10) : 0;

  return na - nb;
};

/**
 * Parse a string numerically by extracting the first three sets of numbers
 * and comparing them. Further numeric values are ignored. If numbers are present
 * in only one string, that string sorts first. If no numbers are present,
 * compare alphabetically. If numbers compare equally, compare the full string
 * alphabetically.
 *
 * @param string a:
 * @param string b:
 * @return int < 0 if a is before b, 0 if they are equal, > 0 if a is after b
 */
const alphaNumericComparator = (a, b) => {
  const aMatches = a.match(/^[\D]*([\d]+)[\D]*([\d]*)[\D]*([\d]*).*$/);
  const bMatches = b.match(/^[\D]*([\d]+)[\D]*([\d]*)[\D]*([\d]*).*$/);
  // got digits?
  if (aMatches && bMatches) {
    if (aMatches[1] === bMatches[1] && aMatches[2] === bMatches[2]) {
      const cval = atoiComparator(aMatches[3], bMatches[3]);
      if (cval) {
        return cval;
      }
    } else if (aMatches[1] === bMatches[1]) {
      const cval = atoiComparator(aMatches[2], bMatches[2]);
      if (cval) {
        return cval;
      }
    } else {
      const cval = atoiComparator(aMatches[1], bMatches[1]);
      if (cval) {
        return cval;
      }
    }
  } else if (aMatches) { // only a is numeric; a < b
    return -1;
  } else if (bMatches) { // only b is numeric; a > b
    return 1;
  }

  // both are strings, or numbers compared equally
  return a.localeCompare(b);
};

/**
 * enumerationComparator
 * Sort by numbers embedded in the enumeration field using the alphaNumericComparator.
 *
 * @param object a: an object containing the property "enumeration".
 * @param object b: an object containing the property "enumeration".
 * @return int < 0 if a is before b, 0 if they are equal, > 0 if a is after b
 */
const enumerationComparator = (a, b) => {
  return alphaNumericComparator((a.enumeration ?? ''), (b.enumeration ?? ''));
};

/**
 * copyNumberComparator
 * Sort by numbers embedded in the enumeration field using the alphaNumericComparator.
 *
 * @param object a: an object containing the property "copyNumber".
 * @param object b: an object containing the property "copyNumber".
 * @return int < 0 if a is before b, 0 if they are equal, > 0 if a is after b
 */
const copyNumberComparator = (a, b) => {
  return alphaNumericComparator((a.copyNumber ?? ''), (b.copyNumber ?? ''));
};

/**
 * volumeComparator
 * Sort by numbers embedded in the volume field using the alphaNumericComparator.
 *
 * @param object a: an object containing the property "copyNumber".
 * @param object b: an object containing the property "copyNumber".
 * @return int < 0 if a is before b, 0 if they are equal, > 0 if a is after b
 */
const volumeComparator = (a, b) => {
  return alphaNumericComparator((a.volume ?? ''), (b.volume ?? ''));
};

/**
 * loanTypeComparator
 * Order by temporary loan-type name if available, or permanent loan-type name.
 *
 * @param object a: an object containing the property permanentLoanType and/or temporaryLoanType
 * @param object b: an object containing the property permanentLoanType and/or temporaryLoanType
 * @return int < 0 if a is before b, 0 if they are equal, > 0 if a is after b
 */
const loanTypeComparator = (a, b) => {
  const aStr = a.temporaryLoanType?.name?.toLowerCase() || a.permanentLoanType?.name?.toLowerCase();
  const bStr = b.temporaryLoanType?.name?.toLowerCase() || b.permanentLoanType?.name?.toLowerCase();
  return aStr.localeCompare(bStr);
};

const sorters = {
  'barcode': (a, b) => a.barcode?.localeCompare(b.barcode),
  'chronology': (a, b) => a.chronology?.localeCompare(b.chronology),
  'copyNumber': copyNumberComparator,
  'effectiveLocation': (a, b) => a.effectiveLocation?.name?.toLowerCase().localeCompare(b.effectiveLocation?.name?.toLowerCase()),
  'enumeration': enumerationComparator,
  'loanType': loanTypeComparator,
  'materialType': (a, b) => a.materialType?.name?.toLowerCase().localeCompare(b.materialType?.name?.toLowerCase()),
  'status': (a, b) => a.status?.name?.toLowerCase().localeCompare(b.status?.name?.toLowerCase()),
  'volume': volumeComparator,

  // this is kinda brittle. to create a sortable string
  // it replicates ItemsList.getFormatter('yearCaption')
  // but I'm not sure of a better way.
  'yearCaption': (a, b) => {
    const as = a.yearCaption?.length ? a.yearCaption.join(', ') : '';
    const bs = b.yearCaption?.length ? b.yearCaption.join(', ') : '';

    return as.localeCompare(bs);
  },
};

// eslint-disable-next-line
export const sortItems = (items, sorting) => {
  const sorted = [...items].sort(sorters[sorting.column]);
  return sorting.isDesc ? sorted.reverse() : sorted;
};

export const getTableAria = (intl) => intl.formatMessage({ id: 'ui-inventory.items' });

export const getFormatter = (
  intl,
  holdingId,
  locationsById,
  holdingsMapById,
  isBarcodeAsHotlink,
  isFetching,
  tenantId,
) => ({
  'order': (item) => item.order || <NoValue />,
  'barcode': item => {
    return (
      item.id && (
        <>
          <ItemBarcode
            item={item}
            holdingId={item.holdingsRecordId}
            instanceId={holdingsMapById[item.holdingsRecordId]?.instanceId}
            isBarcodeAsHotlink={isBarcodeAsHotlink && !isFetching}
            tenantId={tenantId}
          />
          {item.discoverySuppress &&
            <span>
              <Icon
                size="medium"
                icon="exclamation-circle"
                status="warn"
              />
            </span>
          }
        </>)
    ) || <NoValue />;
  },
  'status': x => {
    if (!x.status?.name) return <NoValue />;

    const statusName = x.status.name;
    const itemStatusTranslationId = itemStatuses.find(({ value }) => value === statusName)?.label;

    return itemStatusTranslationId ? intl.formatMessage({ id: itemStatusTranslationId }) : statusName;
  },
  'copyNumber': ({ copyNumber }) => copyNumber || <NoValue />,
  'loanType': x => x.temporaryLoanType?.name || x.permanentLoanType?.name || <NoValue />,
  'effectiveLocation': x => {
    const effectiveLocation = locationsById[x.effectiveLocation?.id];
    return effectiveLocation?.isActive ?
      effectiveLocation?.name || <NoValue /> :
      intl.formatMessage(
        { id: 'ui-inventory.inactive.gridCell' },
        { location: effectiveLocation?.name }
      );
  },
  'enumeration': x => x.enumeration || <NoValue />,
  'chronology': x => x.chronology || <NoValue />,
  'volume': x => x.volume || <NoValue />,
  'yearCaption': x => x.yearCaption?.join(', ') || <NoValue />,
  'materialType': x => x.materialType?.name || <NoValue />,
});

export const getColumnMapping = (intl) => ({
  'order': intl.formatMessage({ id: 'ui-inventory.item.order' }),
  'barcode': intl.formatMessage({ id: 'ui-inventory.item.barcode' }),
  'status': intl.formatMessage({ id: 'ui-inventory.status' }),
  'copyNumber': intl.formatMessage({ id: 'ui-inventory.copyNumber' }),
  'loanType': intl.formatMessage({ id: 'ui-inventory.loanType' }),
  'effectiveLocation': intl.formatMessage({ id: 'ui-inventory.effectiveLocationShort' }),
  'enumeration': intl.formatMessage({ id: 'ui-inventory.enumeration' }),
  'chronology': intl.formatMessage({ id: 'ui-inventory.chronology' }),
  'volume': intl.formatMessage({ id: 'ui-inventory.volume' }),
  'yearCaption': intl.formatMessage({ id: 'ui-inventory.yearCaption' }),
  'materialType': intl.formatMessage({ id: 'ui-inventory.materialType' }),
});

export const getColumnWidths = () => ({ order: '80px', select: '60px', barcode: '160px' });

export const getVisibleColumns = () => draggableVisibleColumns.filter(col => !['dnd', 'select'].some(it => col === it));


