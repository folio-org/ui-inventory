import { browseModeOptions } from '@folio/stripes-inventory-components';

// [pageNumber, direction, anchor] - E.g. [1, 'prev', 'Fizz Buzz'];
export const INIT_PAGE_CONFIG = [0, null, null];

export const regExp = /^((callNumber|subject|name|itemEffectiveShelvingOrder) [<|>])/i;

// `newRegExp` is used to ensure compatibility with the new `browse` 1.5 interface,
// which has different requirements for matching call numbers.
// The `regExp` is the original regular expression that is used if `browse` 1.5 interface is not available.
export const newRegExp = /^((callNumber|subject|name|fullCallNumber) [<|>])/i;
export const PRECEDING_RECORDS_COUNT = 5;
export const FIVE_MINUTES = 5 * 60 * 1000;

export const PATH_MAP = {
  [browseModeOptions.SUBJECTS]: 'browse/subjects/instances',
  [browseModeOptions.CALL_NUMBERS]: 'browse/call-numbers/instances',
  [browseModeOptions.DEWEY]: 'browse/call-numbers/instances',
  [browseModeOptions.LIBRARY_OF_CONGRESS]: 'browse/call-numbers/instances',
  [browseModeOptions.LOCAL]: 'browse/call-numbers/instances',
  [browseModeOptions.NATIONAL_LIBRARY_OF_MEDICINE]: 'browse/call-numbers/instances',
  [browseModeOptions.OTHER]: 'browse/call-numbers/instances',
  [browseModeOptions.CLASSIFICATION_ALL]: 'browse/classification-numbers/all/instances',
  [browseModeOptions.DEWEY_CLASSIFICATION]: 'browse/classification-numbers/dewey/instances',
  [browseModeOptions.LC_CLASSIFICATION]: 'browse/classification-numbers/lc/instances',
  [browseModeOptions.SUPERINTENDENT]: 'browse/call-numbers/instances',
  [browseModeOptions.CONTRIBUTORS]: 'browse/contributors/instances',
};

// The `NEW_PATH_MAP` is used for the new call number `browse` 1.5 interface,
// which includes different paths for call numbers.
// The `PATH_MAP` is the original set of paths that is used if `browse` 1.5 interface is not available.
export const NEW_PATH_MAP = {
  ...PATH_MAP,
  [browseModeOptions.CALL_NUMBERS]: 'browse/call-numbers/all/instances',
  [browseModeOptions.DEWEY]: 'browse/call-numbers/dewey/instances',
  [browseModeOptions.LIBRARY_OF_CONGRESS]: 'browse/call-numbers/lc/instances',
  [browseModeOptions.LOCAL]: 'browse/call-numbers/instances', // not supported, option disabled
  [browseModeOptions.NATIONAL_LIBRARY_OF_MEDICINE]: 'browse/call-numbers/nlm/instances',
  [browseModeOptions.OTHER]: 'browse/call-numbers/other/instances',
  [browseModeOptions.SUPERINTENDENT]: 'browse/call-numbers/sudoc/instances',
};

export const INITIAL_SEARCH_PARAMS_MAP = {
  [browseModeOptions.SUBJECTS]: 'value',
  [browseModeOptions.CALL_NUMBERS]: 'callNumber',
  [browseModeOptions.DEWEY]: 'typedCallNumber',
  [browseModeOptions.LIBRARY_OF_CONGRESS]: 'typedCallNumber',
  [browseModeOptions.LOCAL]: 'typedCallNumber',
  [browseModeOptions.NATIONAL_LIBRARY_OF_MEDICINE]: 'typedCallNumber',
  [browseModeOptions.OTHER]: 'typedCallNumber',
  [browseModeOptions.CLASSIFICATION_ALL]: 'number',
  [browseModeOptions.DEWEY_CLASSIFICATION]: 'number',
  [browseModeOptions.LC_CLASSIFICATION]: 'number',
  [browseModeOptions.SUPERINTENDENT]: 'typedCallNumber',
  [browseModeOptions.CONTRIBUTORS]: 'name',
};

// The `NEW_INITIAL_SEARCH_PARAMS_MAP` is used for the new call number `browse` 1.5 interface,
// which includes different search params for call numbers.
// The `INITIAL_SEARCH_PARAMS_MAP` is the original set of paths that is used if `browse` 1.5 interface is not available.
export const NEW_INITIAL_SEARCH_PARAMS_MAP = {
  ...INITIAL_SEARCH_PARAMS_MAP,
  [browseModeOptions.CALL_NUMBERS]: 'fullCallNumber',
  [browseModeOptions.DEWEY]: 'fullCallNumber',
  [browseModeOptions.LIBRARY_OF_CONGRESS]: 'fullCallNumber',
  [browseModeOptions.LOCAL]: 'fullCallNumber',
  [browseModeOptions.NATIONAL_LIBRARY_OF_MEDICINE]: 'fullCallNumber',
  [browseModeOptions.OTHER]: 'fullCallNumber',
  [browseModeOptions.SUPERINTENDENT]: 'fullCallNumber',
};

export const PAGINATION_SEARCH_PARAMS_MAP = {
  [browseModeOptions.SUBJECTS]: INITIAL_SEARCH_PARAMS_MAP[browseModeOptions.SUBJECTS],
  [browseModeOptions.CALL_NUMBERS]: 'itemEffectiveShelvingOrder',
  [browseModeOptions.DEWEY]: 'itemEffectiveShelvingOrder',
  [browseModeOptions.LIBRARY_OF_CONGRESS]: 'itemEffectiveShelvingOrder',
  [browseModeOptions.LOCAL]: 'itemEffectiveShelvingOrder',
  [browseModeOptions.NATIONAL_LIBRARY_OF_MEDICINE]: 'itemEffectiveShelvingOrder',
  [browseModeOptions.OTHER]: 'itemEffectiveShelvingOrder',
  [browseModeOptions.SUPERINTENDENT]: 'itemEffectiveShelvingOrder',
  [browseModeOptions.CLASSIFICATION_ALL]: INITIAL_SEARCH_PARAMS_MAP[browseModeOptions.CLASSIFICATION_ALL],
  [browseModeOptions.DEWEY_CLASSIFICATION]: INITIAL_SEARCH_PARAMS_MAP[browseModeOptions.DEWEY_CLASSIFICATION],
  [browseModeOptions.LC_CLASSIFICATION]: INITIAL_SEARCH_PARAMS_MAP[browseModeOptions.LC_CLASSIFICATION],
  [browseModeOptions.CONTRIBUTORS]: INITIAL_SEARCH_PARAMS_MAP[browseModeOptions.CONTRIBUTORS],
};

// The `NEW_PAGINATION_SEARCH_PARAMS_MAP` is used for the new call number `browse` 1.5 interface,
// which includes different search params for call numbers.
// The `PAGINATION_SEARCH_PARAMS_MAP` is the original set of paths that is used if `browse` 1.5 interface is not available.
export const NEW_PAGINATION_SEARCH_PARAMS_MAP = {
  ...PAGINATION_SEARCH_PARAMS_MAP,
  [browseModeOptions.CALL_NUMBERS]: 'fullCallNumber',
  [browseModeOptions.DEWEY]: 'fullCallNumber',
  [browseModeOptions.LIBRARY_OF_CONGRESS]: 'fullCallNumber',
  [browseModeOptions.LOCAL]: 'fullCallNumber',
  [browseModeOptions.NATIONAL_LIBRARY_OF_MEDICINE]: 'fullCallNumber',
  [browseModeOptions.OTHER]: 'fullCallNumber',
  [browseModeOptions.SUPERINTENDENT]: 'fullCallNumber',
};
