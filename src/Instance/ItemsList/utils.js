import {
  orderBy,
} from 'lodash';

/**
 * enumerationSorter
 * Parse an object's enumeration value as a number.
 * Given { enumeration: [string] value } where value is a string like
 * "v.23" or "v.23:no.7-12", return a number like 23 or 23.7, respectively.
 * If the value does not match the pattern, return it as a string.
 *
 * @param  {[object]} an object containing the property "enumeration".
 * @return {[Number|String]} the input object's enumeration property, parse as a number, if possible.
 */
const enumerationSorter = (i) => {
  const matches = i.enumeration.match(/^v\.([0-9]+)(:no\.([0-9]).*)?$/);
  return matches ? Number.parseFloat(`${matches[1]}.${matches[3]}`, 10) : i.enumeration;
};

const sorters = {
  'barcode': ({ barcode }) => barcode,
  'status': ({ status }) => status.name.toLowerCase(),
  'copyNumber': ({ copyNumber }) => copyNumber?.toLowerCase(),
  'materialType': ({ materialType }) => materialType.name.toLowerCase(),
  'loanType': (item) => item.temporaryLoanType?.name?.toLowerCase() || item.permanentLoanType?.name?.toLowerCase(),
  'effectiveLocation': ({ effectiveLocation }) => effectiveLocation.name.toLowerCase(),
  'enumeration': enumerationSorter,
  'chronology': ({ chronology }) => chronology,
  'volume': ({ volume }) => volume,
  'yearCaption': ({ yearCaption }) => yearCaption,
};

export const sortItems = (items, sorting) => orderBy(
  items, sorters[sorting.column], sorting.isDesc ? 'desc' : 'asc',
);
