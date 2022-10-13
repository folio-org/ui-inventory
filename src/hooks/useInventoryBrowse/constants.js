import { browseModeOptions } from '../../constants';

// [pageNumber, direction, anchor] - E.g. [1, 'prev', 'Fizz Buzz'];
export const INIT_PAGE_CONFIG = [0, null, null];

export const regExp = /^((callNumber|subject|name|itemEffectiveShelvingOrder) [<|>])/i;
export const PRECEDING_RECORDS_COUNT = 5;
export const FIVE_MINUTES = 5 * 60 * 1000;

export const PATH_MAP = {
  [browseModeOptions.SUBJECTS]: 'browse/subjects/instances',
  [browseModeOptions.CALL_NUMBERS]: 'browse/call-numbers/instances',
  [browseModeOptions.CONTRIBUTORS]: 'browse/contributors/instances',
};

export const INITIAL_SEARCH_PARAMS_MAP = {
  [browseModeOptions.SUBJECTS]: 'subject',
  [browseModeOptions.CALL_NUMBERS]: 'callNumber',
  [browseModeOptions.CONTRIBUTORS]: 'name',
};

export const PAGINATION_SEARCH_PARAMS_MAP = {
  [browseModeOptions.SUBJECTS]: INITIAL_SEARCH_PARAMS_MAP[browseModeOptions.SUBJECTS],
  [browseModeOptions.CALL_NUMBERS]: 'itemEffectiveShelvingOrder',
  [browseModeOptions.CONTRIBUTORS]: INITIAL_SEARCH_PARAMS_MAP[browseModeOptions.CONTRIBUTORS],
};
