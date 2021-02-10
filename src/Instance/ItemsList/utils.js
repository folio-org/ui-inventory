/**
 * enumerationSorter
 * Parse an object's enumeration value numerically
 * Given { enumeration: [string] value } where value is a string like
 * "v.23" or "v.23:no.11-12", compare "23" and "11".
 * If the value does not match the pattern, compare the full string.
 *
 * @param  {[object]} an object containing the property "enumeration".
 */
const enumerationSorter = (a, b) => {
  const aMatches = a.enumeration.match(/^v\.([0-9]+)(:no\.([0-9]+).*)?$/);
  const bMatches = b.enumeration.match(/^v\.([0-9]+)(:no\.([0-9]+).*)?$/);
  if (aMatches && bMatches) {
    if (aMatches[1] === bMatches[1]) {
      return Number.parseFloat(aMatches[3], 10) - Number.parseFloat(bMatches[3], 10);
    } else {
      return Number.parseFloat(aMatches[1], 10) - Number.parseFloat(bMatches[1], 10);
    }
  }

  return a.enumeration.localeCompare(b.enumeration);
};

/**
 * [loanTypeSorter description]
 * @param  {[type]} a [description]
 * @param  {[type]} b [description]
 * @return {[type]}   [description]
 */
const loanTypeSorter = (a, b) => {
  const aStr = a.temporaryLoanType?.name?.toLowerCase() || a.permanentLoanType?.name?.toLowerCase();
  const bStr = b.temporaryLoanType?.name?.toLowerCase() || b.permanentLoanType?.name?.toLowerCase();
  return aStr.localeCompare(bStr);
};

const sorters = {
  'barcode': (a, b) => a.barcode.localeCompare(b.barcode),
  'status': (a, b) => a.status.name.toLowerCase().localeCompare(b.status.name.toLowerCase()),
  'copyNumber': (a, b) => a.copyNumber?.toLowerCase().localeCompare(b.copyNumber.name.toLowerCase()),
  'materialType': (a, b) => a.materialType.name.toLowerCase().localeCompare(b.materialType.name.toLowerCase()),
  'loanType': loanTypeSorter,
  'effectiveLocation': (a, b) => a.effectiveLocation.name.toLowerCase().localeCompare(b.effectiveLocation.name.toLowerCase()),
  'enumeration': enumerationSorter,
  'chronology': (a, b) => a.chronology.localeCompare(b.chronology),
  'volume': (a, b) => a.volume.localeCompare(b.volume),
  'yearCaption': (a, b) => a.yearCaption.localeCompare(b.yearCaption),
};

// eslint-disable-next-line
export const sortItems = (items, sorting) => {
  const sorted = [...items].sort(sorters[sorting.column]);
  return sorting.isDesc ? sorted.reverse() : sorted;
};
