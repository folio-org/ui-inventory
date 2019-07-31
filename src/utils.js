import { includes, get } from 'lodash';
import { itemStatuses } from './constants';

export function craftLayerUrl(mode, location) { // eslint-disable-line import/prefer-default-export
  if (location) {
    const url = location.pathname + location.search;
    return includes(url, '?') ? `${url}&layer=${mode}` : `${url}?layer=${mode}`;
  }
  return null;
}

export function canMarkItemAsMissing(item) {
  return includes([
    itemStatuses.AVAILABLE,
    itemStatuses.IN_TRANSIT,
    itemStatuses.AWAITING_PICKUP,
    itemStatuses.PAGED,
    itemStatuses.IN_PROCESS
  ], get(item, 'status.name'));
}

export function memoize(fn) {
  let lastArg;
  let lastResult;

  return arg => {
    if (arg !== lastArg) {
      lastArg = arg;
      lastResult = fn(arg);
    }

    return lastResult;
  };
}
