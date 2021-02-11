// /* eslint-disable */
/* OMFG ESLint. If we have to cuddle the else, we can't
 * can't place comments before the condition.
 * CUDDLING THE ELSE IS WRONG. Yes, I'm shouting. Come fight me.
 */

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
 * and comparing them. Further numeric values are ignored. If are present
 * in only one string, that string sorts first. If no numbers are present,
 * compare alphabetically.
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
 * Parse an object's enumeration value numerically by extracting the
 * first three sets of numbers in the string and comparing them. Further
 * values are ignored. If are present in only one string, that string sorts
 * first. If no numbers are present, compare alphabetically.
 *
 * @param object a: an object containing the property "enumeration".
 * @param object b: an object containing the property "enumeration".
 * @return int < 0 if a is before b, 0 if they are equal, > 0 if a is after b
 */
const enumerationComparator = (a, b) => {
  return alphaNumericComparator((a.enumeration ?? ''), (b.enumeration ?? ''));
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
  'barcode': (a, b) => a.barcode.localeCompare(b.barcode),
  'status': (a, b) => a.status.name.toLowerCase().localeCompare(b.status.name.toLowerCase()),
  'copyNumber': (a, b) => a.copyNumber?.toLowerCase().localeCompare(b.copyNumber.name.toLowerCase()),
  'materialType': (a, b) => a.materialType.name.toLowerCase().localeCompare(b.materialType.name.toLowerCase()),
  'loanType': loanTypeComparator,
  'effectiveLocation': (a, b) => a.effectiveLocation.name.toLowerCase().localeCompare(b.effectiveLocation.name.toLowerCase()),
  'enumeration': enumerationComparator,
  'chronology': (a, b) => a.chronology.localeCompare(b.chronology),
  'volume': (a, b) => a.volume.localeCompare(b.volume),
  'yearCaption': (a, b) => a.yearCaption.localeCompare(b.yearCaption),
};

// eslint-disable-next-line
export const sortItems = (items, sorting) => {
  const sorted = [...items].sort(sorters[sorting.column]);
  return sorting.isDesc ? sorted.reverse() : sorted;
};
