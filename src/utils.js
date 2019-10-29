import {
  includes,
  get,
  forOwn,
} from 'lodash';
import {
  itemStatuses,
  availableFilters,
} from './constants';

import {
  InstanceFilters,
  HoldingFilters,
  ItemFilters,
} from './components';

const filterComponents = {
  instances: InstanceFilters,
  holdings: HoldingFilters,
  items: ItemFilters,
};

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

export function getCurrentFilters(filtersStr) {
  if (!filtersStr) {
    return undefined;
  }

  return filtersStr
    .split(',')
    .reduce((filters, filter) => {
      const [name, value] = filter.split('.');
      filters[name] = filters[name] || [];
      filters[name].push(value);
      return filters;
    }, {});
}

export function parseFiltersToStr(filters) {
  const newFilters = [];

  forOwn(filters, (values, name) => {
    const filter = values.map(value => `${name}.${value}`);
    newFilters.push(filter);
  });

  return newFilters.join(',');
}

export function getFilterName(name) {
  return availableFilters[name] ||
    availableFilters.instances;
}

export function getFilterComponent(name) {
  const filter = getFilterName(name);
  return filterComponents[filter];
}
