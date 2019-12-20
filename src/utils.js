import React from 'react';
import {
  FormattedMessage,
  FormattedTime,
  FormattedDate,
} from 'react-intl';
import {
  includes,
  find,
  get,
  forOwn,
  escapeRegExp,
  isArray,
  isEmpty,
  template,
  groupBy,
  map,
  isObject,
} from 'lodash';
import {
  itemStatusesMap,
  noValue,
  emptyList,
} from './constants';

export const areAllFieldsEmpty = fields => fields.every(item => (isArray(item)
  ? (isEmpty(item) || item.every(element => !element || element === '-'))
  : (!item || item === '-')));

export function craftLayerUrl(mode, location) { // eslint-disable-line import/prefer-default-export
  if (location) {
    const url = location.pathname + location.search;
    return includes(url, '?') ? `${url}&layer=${mode}` : `${url}?layer=${mode}`;
  }
  return null;
}

export function canMarkItemAsMissing(item) {
  return includes([
    itemStatusesMap.AVAILABLE,
    itemStatusesMap.IN_TRANSIT,
    itemStatusesMap.AWAITING_PICKUP,
    itemStatusesMap.PAGED,
    itemStatusesMap.IN_PROCESS,
    itemStatusesMap.AWAITING_DELIVERY,
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

export function filterItemsBy(name) {
  return (filter, list) => {
    if (!filter) {
      return { renderedItems: list };
    }

    const esFilter = escapeRegExp(filter);
    const regex = new RegExp(`^${esFilter}`, 'i');
    const renderedItems = list
      .filter(item => item[name].match(new RegExp(esFilter, 'i')))
      .sort((item1, item2) => {
        const match1 = item1[name].match(regex);
        const match2 = item2[name].match(regex);

        if (match1) return -1;
        if (match2) return 1;

        return (item1[name] < item2[name]) ? -1 : 1;
      });

    return { renderedItems };
  };
}

export function getQueryTemplate(queryIndex, indexes) {
  const searchableIndex = indexes.find(({ value }) => value === queryIndex);

  return get(searchableIndex, 'queryTemplate');
}

export function getIsbnIssnTemplate(queryTemplate, props, queryIndex) {
  const { resources: { identifierTypes } } = props;
  const identifierType = get(identifierTypes, 'records', [])
    .find(({ name }) => name.toLowerCase() === queryIndex);
  const identifierTypeId = get(identifierType, 'id', 'identifier-type-not-found');

  return template(queryTemplate)({ identifierTypeId });
}

// Return the instanceRelationshipTypeId corresponding to 'preceding-succeeding'
// idTypes is an array of relationship definition objects of the form
// { id, name }
export function psTitleRelationshipId(idTypes) {
  const relationshipDetail = find(idTypes, { 'name': 'preceding-succeeding' });
  return relationshipDetail ? relationshipDetail.id : '';
}

export const validateRequiredField = value => {
  const number = value ? parseInt(value, 10) : 0;

  if (number > 0) {
    return undefined;
  }

  return <FormattedMessage id="ui-inventory.hridHandling.validation.enterValue" />;
};

export const validateFieldLength = (value, maxLength) => {
  if (value) {
    const str = value.toString();

    if (str.length <= maxLength) {
      return undefined;
    }

    return (
      <FormattedMessage
        id="ui-inventory.hridHandling.validation.maxLength"
        values={{ maxLength }}
      />
    );
  }

  return undefined;
};

export const validateNumericField = value => {
  if (value) {
    const str = value.toString();
    const pattern = /^\d+$/;

    if (str.match(pattern)) {
      return undefined;
    }

    return <FormattedMessage id="ui-inventory.hridHandling.validation.startWithField" />;
  }

  return undefined;
};

export const validateAlphaNumericField = value => {
  if (value) {
    const pattern = /^[\w.,\-!?:;"'(){}[\]$ ]+$/;

    if (value.match(pattern)) {
      return undefined;
    }

    return <FormattedMessage id="ui-inventory.hridHandling.validation.assignPrefixField" />;
  }

  return undefined;
};

export const checkIfElementIsEmpty = element => ((!element || element === '-') ? noValue : element);

export const checkIfArrayIsEmpty = array => (!isEmpty(array)
  ? array.map(element => (isObject(element) ? element : {}))
  : emptyList);

export const convertArrayToBlocks = elements => (!isEmpty(elements)
  ? elements.map((line, i) => (line ? <div key={i}>{line}</div> : noValue))
  : noValue);

export const getDate = dateValue => {
  return dateValue ? (
    <FormattedDate
      value={dateValue}
      day="numeric"
      month="numeric"
      year="numeric"
    />
  ) : '-';
};

export const getDateWithTime = dateValue => {
  return dateValue ? (
    <FormattedTime
      value={dateValue}
      day="numeric"
      month="numeric"
      year="numeric"
    />
  ) : '-';
};

export const callNumberLabel = holdingsRecord => {
  const parts = [];
  parts.push(get(holdingsRecord, 'callNumberPrefix', ''));
  parts.push(get(holdingsRecord, 'callNumber', ''));
  parts.push(get(holdingsRecord, 'callNumberSuffix', ''));

  return parts.join(' ');
};

export const staffOnlyFormatter = x => (get(x, ['staffOnly'])
  ? <FormattedMessage id="ui-inventory.yes" />
  : <FormattedMessage id="ui-inventory.no" />);

export const getSortedNotes = (resource, field, types) => {
  const notes = groupBy(get(resource, ['notes']), field);

  const sortedNotes = map(notes, (value, key) => {
    const noteType = types.find(note => note.id === key);

    return {
      noteType,
      notes: value,
    };
  });

  return sortedNotes;
};
