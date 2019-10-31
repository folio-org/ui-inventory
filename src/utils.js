import {
  includes,
  find,
  get,
  forOwn,
} from 'lodash';
import {
  itemStatuses,
} from './constants';

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

// Return the instanceRelationshipTypeId corresponding to 'preceding-succeeding'
// idTypes is an array of relationship definition objects of the form
// { id, name }
export function psTitleRelationshipId(idTypes) {
  const relationshipDetail = find(idTypes, { 'name': 'preceding-succeeding' });
  return relationshipDetail ? relationshipDetail.id : '';
}

export const getHoldingsNotes = (noteTypes, notes) => notes.filter(noteType => noteTypes.find(note => note.holdingsNoteTypeId === noteType.id));
