import { browseModeOptions } from '../../constants';

// [pageNumber, direction, anchor] - E.g. [1, 'prev', 'Fizz Buzz'];
export const INIT_PAGE_CONFIG = [0, null, null];

export const regExp = /^((callNumber|subject|name|itemEffectiveShelvingOrder) [<|>])/i;
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
  [browseModeOptions.SUPERINTENDENT]: 'browse/call-numbers/instances',
  [browseModeOptions.CONTRIBUTORS]: 'browse/contributors/instances',
};

export const INITIAL_SEARCH_PARAMS_MAP = {
  [browseModeOptions.SUBJECTS]: 'value',
  [browseModeOptions.CALL_NUMBERS]: 'callNumber',
  [browseModeOptions.DEWEY]: 'typedCallNumber',
  [browseModeOptions.LIBRARY_OF_CONGRESS]: 'typedCallNumber',
  [browseModeOptions.LOCAL]: 'typedCallNumber',
  [browseModeOptions.NATIONAL_LIBRARY_OF_MEDICINE]: 'typedCallNumber',
  [browseModeOptions.OTHER]: 'typedCallNumber',
  [browseModeOptions.SUPERINTENDENT]: 'typedCallNumber',
  [browseModeOptions.CONTRIBUTORS]: 'name',
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
  [browseModeOptions.CONTRIBUTORS]: INITIAL_SEARCH_PARAMS_MAP[browseModeOptions.CONTRIBUTORS],
};
