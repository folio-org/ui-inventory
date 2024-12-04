import React from 'react';
import { FormattedMessage } from 'react-intl';
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
  omit,
  chunk,
  flatten,
  pick,
} from 'lodash';

import {
  updateTenant,
  validateUser,
  updateUser,
} from '@folio/stripes/core';
import {
  FormattedTime,
  FormattedUTCDate,
} from '@folio/stripes/components';
import {
  segments,
  LIMIT_MAX,
  OKAPI_TENANT_HEADER,
  SORT_OPTIONS,
} from '@folio/stripes-inventory-components';

import {
  itemStatusesMap,
  noValue,
  emptyList,
  indentifierTypeNames,
  ERROR_TYPES,
  SINGLE_ITEM_QUERY_TEMPLATES,
  CONSORTIUM_PREFIX,
  CONTENT_TYPE_HEADER,
  OKAPI_TOKEN_HEADER,
  AUTHORITY_LINKED_FIELDS,
} from './constants';
import { removeItem } from './storage';

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
    itemStatusesMap.AWAITING_DELIVERY,
    itemStatusesMap.AWAITING_PICKUP,
    itemStatusesMap.INTELLECTUAL_ITEM,
    itemStatusesMap.IN_PROCESS,
    itemStatusesMap.IN_PROCESS_NON_REQUESTABLE,
    itemStatusesMap.IN_TRANSIT,
    itemStatusesMap.LONG_MISSING,
    itemStatusesMap.LOST_AND_PAID,
    itemStatusesMap.PAGED,
    itemStatusesMap.RESTRICTED,
    itemStatusesMap.UNAVAILABLE,
    itemStatusesMap.UNKNOWN,
    itemStatusesMap.WITHDRAWN,
  ], item?.status?.name);
}

export function canMarkItemAsWithdrawn(item) {
  return includes([
    itemStatusesMap.AVAILABLE,
    itemStatusesMap.AWAITING_DELIVERY,
    itemStatusesMap.AWAITING_PICKUP,
    itemStatusesMap.INTELLECTUAL_ITEM,
    itemStatusesMap.IN_PROCESS,
    itemStatusesMap.IN_PROCESS_NON_REQUESTABLE,
    itemStatusesMap.IN_TRANSIT,
    itemStatusesMap.LONG_MISSING,
    itemStatusesMap.LOST_AND_PAID,
    itemStatusesMap.MISSING,
    itemStatusesMap.PAGED,
    itemStatusesMap.RESTRICTED,
    itemStatusesMap.UNAVAILABLE,
    itemStatusesMap.UNKNOWN,
  ], item?.status?.name);
}

export function canMarkItemWithStatus(item) {
  return includes([
    itemStatusesMap.AVAILABLE,
    itemStatusesMap.AWAITING_DELIVERY,
    itemStatusesMap.AWAITING_PICKUP,
    itemStatusesMap.INTELLECTUAL_ITEM,
    itemStatusesMap.IN_PROCESS_NON_REQUESTABLE,
    itemStatusesMap.IN_TRANSIT,
    itemStatusesMap.LONG_MISSING,
    itemStatusesMap.LOST_AND_PAID,
    itemStatusesMap.MISSING,
    itemStatusesMap.ORDER_CLOSED,
    itemStatusesMap.PAGED,
    itemStatusesMap.RESTRICTED,
    itemStatusesMap.UNAVAILABLE,
    itemStatusesMap.UNKNOWN,
    itemStatusesMap.WITHDRAWN,
  ], item?.status?.name);
}

export function canCreateNewRequest(item, stripes) {
  return stripes.hasPerm('ui-requests.create') &&
    includes([
      itemStatusesMap.IN_PROCESS,
      itemStatusesMap.AVAILABLE,
      itemStatusesMap.CHECKED_OUT,
      itemStatusesMap.ON_ORDER,
      itemStatusesMap.IN_TRANSIT,
      itemStatusesMap.AWAITING_PICKUP,
      itemStatusesMap.MISSING,
      itemStatusesMap.AWAITING_DELIVERY,
      itemStatusesMap.PAGED,
      itemStatusesMap.RESTRICTED,
    ], item?.status?.name);
}

export function canMarkRequestAsOpen(request) {
  if (!request) {
    return false;
  }

  const { item, holdShelfExpirationDate } = request;
  const status = item?.status;

  return new Date(holdShelfExpirationDate) > new Date() &&
    includes([
      itemStatusesMap.AWAITING_PICKUP,
      itemStatusesMap.AWAITING_DELIVERY,
    ], status);
}

export function parseFiltersToStr(filters) {
  const newFilters = [];

  forOwn(filters, (values, name) => {
    const filter = values?.map(value => `${name}.${value}`);
    newFilters.push(filter);
  });

  return newFilters.join(',');
}

// Function which takes a filter name and returns
// another function which can be used in filter config
// to parse a given filter into a CQL manually.
export const buildOptionalBooleanQuery = name => values => {
  if (values.length === 2) {
    return 'cql.allRecords=1';
  } else if (values.length === 1 && values[0] === 'false') {
    return `cql.allRecords=1 not ${name}=="true"`;
  } else {
    const joinedValues = values.map(v => `"${v}"`).join(' or ');

    return `${name}==${joinedValues}`;
  }
};

// A closure function which takes the name of the attribute used
// for filtering purposes and returns a function which can be used as a custom
// filter function in <MultiSelection>.
// https://github.com/folio-org/stripes-components/tree/master/lib/MultiSelection#common-props

export function filterItemsBy(name) {
  return (filter, list) => {
    if (!filter) {
      return { renderedItems: list };
    }

    // Escaped filter regex used to filter items on the list.
    const esFilter = new RegExp(escapeRegExp(filter), 'i');

    // Regex used to return filtered items in alphabetical order.
    const regex = new RegExp(`^${esFilter}`, 'i');

    const renderedItems = list
      .filter(item => item[name].match(esFilter))
      .sort((item1, item2) => {
        const match1 = item1[name].match(regex);
        const match2 = item2[name].match(regex);

        if ((match1 && match2) || (!match1 && !match2)) {
          return item1[name] < item2[name] ? -1 : 1;
        }

        if (match1) return -1;
        if (match2) return 1;

        return 1;
      });

    return { renderedItems };
  };
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

/**
 * Provide validation of an optional form field consisting of one or more
 * textfields and one or more select fields used for type id selection,
 * where both parts (text and identifier type) are required.
 *
 * @param optionalField the field description object, consisting of
 *  list: list name (string)
 *  textFields: array of text field names
 *  selectFields: array of select field names
 * @param values array of field values passed in to caller validate function
 *
 * @return nested array of errors for optionalField
 */
export const validateOptionalField = (optionalField, values) => {
  const listName = optionalField.list;
  const errorList = [];

  if (values[listName] && values[listName].length) {
    values[listName].forEach((item, i) => {
      const entryErrors = {};
      optionalField.textFields.forEach((field) => {
        if (!item || !item[field]) {
          entryErrors[field] = <FormattedMessage id="ui-inventory.fillIn" />;
          errorList[i] = entryErrors;
        }
      });

      optionalField.selectFields.forEach((field) => {
        if (!item || !item[field]) {
          entryErrors[field] = <FormattedMessage id="ui-inventory.selectToContinue" />;
          errorList[i] = entryErrors;
        }
      });
    });
  }

  return errorList;
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
    <FormattedUTCDate
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
      key,
    };
  });

  return sortedNotes;
};

/**
 * Filter instance identifiers by given type and
 * return them as a comma separated string.
 *
 * @param identifiers array of objects
 * @param type string
 * @param identifierTypesById object
 *
 * @return string
 */
export const getIdentifiers = (identifiers = [], type, identifierTypesById) => {
  const result = [];

  identifiers.forEach(({ identifierTypeId, value }) => {
    const ident = identifierTypesById[identifierTypeId];

    if (ident?.name === type && value) {
      result.push(value);
    }
  });

  if (!result.length) return null;

  return (
    <div>
      {result.map((value, index) => <div>{`${value}${index !== result.length - 1 ? ',' : ''}`}</div>)}
    </div>);
};

/**
 * Creates an object with identifier type as a key and its value
 *
 * @param {String[]} types identifier names
 * @param {Object} identifierTypesById
 * @param {Object[]} identifiers
 *
 * @returns {Object} Identifier names and its values
 */
export const getIdentifiersValues = (types, identifierTypesById, identifiers = []) => {
  const result = {};

  if (!identifiers.length) return result;

  identifiers.forEach(({ identifierTypeId, value }) => {
    const ident = identifierTypesById[identifierTypeId];

    if (types.some(type => type === ident?.name) && value) {
      result[ident.name] = value;
    }
  });

  return result;
};

export const updateOrAddIdentifier = (identifiers, identifierTypeId, value) => {
  const index = identifiers.findIndex(identifier => identifier.identifierTypeId === identifierTypeId);
  const indentifier = { identifierTypeId, value };

  if (index > -1) {
    identifiers[index] = indentifier;
  } else {
    identifiers.push(indentifier);
  }
};

/**
 * Marshal ISBN and ISSN attatched to the given title into
 * identifiers required by the backend.
 *
 * @param title object
 * @param identifierTypesByName object
 *
 */
export const marshalIdentifiers = (title, identifierTypesByName) => {
  const identifiers = [...(title?.identifiers ?? [])];
  const {
    isbn,
    issn,
  } = title;

  if (isbn) {
    updateOrAddIdentifier(identifiers, identifierTypesByName.ISBN.id, isbn);
  }

  if (issn) {
    updateOrAddIdentifier(identifiers, identifierTypesByName.ISSN.id, issn);
  }

  return identifiers;
};

/**
 * Unmarshal identifiers to the format required by the instance form.
 *
 * @param title object
 * @param identifierTypesById object
 *
 */
export const unmarshalIdentifiers = (title, identifierTypesById) => {
  const { identifiers = [] } = title;

  identifiers.forEach(ident => {
    const identifier = identifierTypesById[ident.identifierTypeId];
    if (identifier.name === indentifierTypeNames.ISBN) {
      title.isbn = ident.value;
    }

    if (identifier.name === indentifierTypeNames.ISSN) {
      title.issn = ident.value;
    }
  });

  return title;
};

/**
 * UnMarshal preceding/succeeding titles to the format required by the instance form.
 *
 * @param instance instance object
 * @param identifierTypesById object
 * @param type string ("preceding" or "succeeding")
 *
 */
export const unmarshalTitles = (instance, identifierTypesById, type) => {
  const titleAttr = `${type}Titles`;

  (instance?.[titleAttr] ?? []).map((title) => unmarshalIdentifiers(title, identifierTypesById));

  return instance;
};

/**
 * Marshal preceding/succeeding titles for a given instance
 * to the format required by the server.
 *
 * @param instance instance object
 * @param identifierTypesByName object
 * @param type string ("preceding" or "succeeding")
 *
 */
export const marshalTitles = (instance, identifierTypesByName, type) => {
  const titleAttr = `${type}Titles`;
  const titleIdKey = `${type}InstanceId`;

  instance[titleAttr] = (instance?.[titleAttr] ?? []).map((inst) => {
    const {
      id,
      title,
      hrid,
    } = inst;
    const identifiers = marshalIdentifiers(inst, identifierTypesByName);

    return inst[titleIdKey] ?
      // connected title
      { [titleIdKey]: inst[titleIdKey] } :
      // unconnected title
      {
        id,
        title,
        hrid,
        identifiers,
      };
  });
};

/**
 * Marshal parent/child instances
 * to the format required by the server.
 *
 * @param instance instance object
 * @param relationshipName string ("parentInstances" or "childInstances")
 * @param relationshipIdKey string ("subInstanceId" or "superInstanceId")
 *
 */
export const marshalRelationship = (instance, relationshipName, relationshipIdKey) => {
  instance[relationshipName] = (instance?.[relationshipName] ?? []).map((inst) => {
    const {
      id,
      instanceRelationshipTypeId,
    } = inst;

    const relationshipRecord = {
      [relationshipIdKey]: inst[relationshipIdKey],
      instanceRelationshipTypeId,
    };

    // if relationshipId is different from the id it means this is an existing relationship record
    // https://issues.folio.org/browse/UIIN-1546?focusedCommentId=106757&page=com.atlassian.jira.plugin.system.issuetabpanels:comment-tabpanel#comment-106757
    if (inst[relationshipIdKey] !== id) {
      relationshipRecord.id = id;
    }

    return relationshipRecord;
  });
};

/**
 * Marshal given instance to the format required by the server.
 *
 * @param instance instance object
 * @param identifierTypesByName object
 * @param instanceDateTypesByCode object
 *
 */
export const marshalInstance = (instance, identifierTypesByName, instanceDateTypesByCode) => {
  const marshaledInstance = { ...instance };

  marshalTitles(marshaledInstance, identifierTypesByName, 'preceding');
  marshalTitles(marshaledInstance, identifierTypesByName, 'succeeding');

  marshalRelationship(marshaledInstance, 'parentInstances', 'superInstanceId');
  marshalRelationship(marshaledInstance, 'childInstances', 'subInstanceId');

  const { dates } = instance;
  if (dates && (dates.date1 || dates.date2) && !dates.dateTypeId) {
    marshaledInstance.dates = {
      ...dates,
      dateTypeId: instanceDateTypesByCode['|']?.id
    };
  }

  return marshaledInstance;
};

/**
 * Unmarshal given instance to the format required by the instance form.
 *
 * @param instance instance object
 * @param identifierTypesById object
 *
 */
export const unmarshalInstance = (instance, identifierTypesById) => {
  const unmarshaledInstance = { ...instance };

  unmarshalTitles(unmarshaledInstance, identifierTypesById, 'preceding');
  unmarshalTitles(unmarshaledInstance, identifierTypesById, 'succeeding');

  return unmarshaledInstance;
};

/**
 * Omit from array
 *
 * For example:
 *
 * omitFromArray([{id: 1, title: 'A'}, {id: 2, title: 'B'}], 'id')
 *
 * will produce:
 *
 * [{title: 'A'}, {title: 'B'}]
 *
 */
export const omitFromArray = (array, path) => array.map(title => omit(title, path));

export const getNextSelectedRowsState = (selectedRows, row) => {
  const { id } = row;
  const isRowSelected = Boolean(selectedRows[id]);
  const newSelectedRows = { ...selectedRows };

  if (isRowSelected) {
    delete newSelectedRows[id];
  } else {
    newSelectedRows[id] = row;
  }

  return newSelectedRows;
};

export const isTestEnv = () => process.env.NODE_ENV === 'test';

export const formatCellStyles = css => defaultCellStyle => `${defaultCellStyle} ${css}`;

export const handleKeyCommand = (handler, { disabled } = {}) => {
  return (e) => {
    if (e) {
      e.preventDefault();
    }

    if (!disabled) {
      handler();
    }
  };
};

export const buildQueryByIds = (itemsChunk) => {
  const query = itemsChunk
    .map(id => `id==${id}`)
    .join(' or ');

  return query || '';
};

export const batchRequest = (requestFn, items, buildQuery = buildQueryByIds, _params = {}, filterParamName = 'query') => {
  if (!items?.length) return Promise.resolve([]);

  const requests = chunk(items, 25).map(itemsChunk => {
    const query = buildQuery(itemsChunk);

    if (!query) return Promise.resolve([]);

    const params = {
      limit: LIMIT_MAX,
      ..._params,
      [filterParamName]: query,
    };

    return requestFn({ params });
  });

  return Promise.all(requests)
    .then((responses) => flatten(responses));
};

/**
 * Parses http error to json and attaches an error type.
 *
 * @param httpError object
 * @returns object
 */
export const parseHttpError = async httpError => {
  const contentType = httpError?.headers?.get('content-type');
  let jsonError = {};

  try {
    if (contentType.includes('text/plain')) {
      jsonError.message = await httpError.text();
    } else {
      jsonError = await httpError.json();
    }

    // Optimistic locking error is currently returned as a plain text
    // https://issues.folio.org/browse/UIIN-1872?focusedCommentId=125438&page=com.atlassian.jira.plugin.system.issuetabpanels%3Acomment-tabpanel#comment-125438
    if (jsonError.message?.match(/optimistic locking/i)) {
      jsonError.errorType = ERROR_TYPES.OPTIMISTIC_LOCKING;
    }

    return jsonError;
  } catch (err) {
    return httpError;
  }
};

/**
 * Creates an item query from a template for a given qindex and query.
 *
 * @param qindex string
 * @param query string
 * @returns strins
 */
export const buildSingleItemQuery = (qindex, query) => {
  const queryTemplate = SINGLE_ITEM_QUERY_TEMPLATES[qindex];

  if (!queryTemplate) {
    return null;
  }

  return template(queryTemplate, { interpolate: /%{([\s\S]+?)}/g })({ query });
};

export const isMARCSource = (source) => {
  return ['MARC', `${CONSORTIUM_PREFIX}MARC`].includes(source);
};

export const isLinkedDataSource = (source) => {
  return source === 'LINKED_DATA';
};

export const isUserInConsortiumMode = stripes => stripes.hasInterface('consortia');

export const isInstanceShadowCopy = (source) => [`${CONSORTIUM_PREFIX}FOLIO`, `${CONSORTIUM_PREFIX}MARC`].includes(source);

/**
 * hasMemberTenantPermission
 * return true if permissionName is present in the array of permissions for
 * the given tenant. permissionName may match a top-level permissionName or a
 * permission's subPermissions.
 *
 * @param {string} permissionName
 * @param {string} tenantId
 * @param {array} permissions array of objects shaped like
 * {
 *   permissionNames: [{
 *     permissionName: 'string',
 *     subPermissions: ['string'],
 *   }],
 *   tenantId: 'string'
 * }
 *
 * @returns true if permissions contains a value matching the given permissionName and tenant
 */
export const hasMemberTenantPermission = (permissionName, tenantId, permissions = []) => {
  const tenantPermissions = permissions?.find(permission => permission?.tenantId === tenantId)?.permissionNames || [];

  const hasPermission = tenantPermissions?.some(tenantPermission => tenantPermission?.permissionName === permissionName);

  if (!hasPermission) {
    return tenantPermissions.some(tenantPermission => tenantPermission.subPermissions?.includes(permissionName));
  }

  return hasPermission;
};

const handleUpdateUser = async (stripes) => {
  const consortium = stripes.user.user?.consortium;

  if (consortium) {
    const centralTenant = stripes.user.user.consortium.centralTenantId;
    const userTenants = stripes.user.user.tenants;

    if (userTenants) {
      await updateUser(stripes.store, {
        tenants: userTenants,
        consortium: {
          id: consortium.id,
          centralTenantId: centralTenant,
        },
      });
    }
  }
};

export const switchAffiliation = async (stripes, tenantId, move) => {
  if (stripes.okapi.tenant !== tenantId) {
    await updateTenant(stripes.okapi, tenantId);

    await validateUser(
      stripes.okapi.url,
      stripes.store,
      tenantId,
      {
        token: stripes.okapi.token,
        user: stripes.user.user,
        perms: stripes.user.perms,
      },
    );

    await handleUpdateUser(stripes);

    move();
  } else {
    move();
  }
};

export const getLinkedAuthorityIds = instance => {
  // Pick fields with authorityId
  const linkedAuthorities = pick(instance, AUTHORITY_LINKED_FIELDS);

  // Retrieve only authorityId
  const authorityIdList = AUTHORITY_LINKED_FIELDS.map(field => {
    return linkedAuthorities[field].filter(auth => !!auth.authorityId).map(auth => auth.authorityId);
  });

  return flatten(authorityIdList);
};

export const clearStorage = () => {
  const namespace = '@folio/inventory';

  removeItem(`${namespace}/search.${segments.instances}.lastSearch`);
  removeItem(`${namespace}/search.${segments.holdings}.lastSearch`);
  removeItem(`${namespace}/search.${segments.items}.lastSearch`);
  removeItem(`${namespace}/browse.lastSearch`);
  removeItem(`${namespace}/search.${segments.instances}.lastOffset`);
  removeItem(`${namespace}/search.${segments.holdings}.lastOffset`);
  removeItem(`${namespace}/search.${segments.items}.lastOffset`);
  removeItem(`${namespace}/browse.lastOffset`);
  removeItem(`${namespace}/search.lastSegment`);

  Object.values(segments).forEach((segment) => {
    removeItem(`${namespace}.${segment}.lastOpenRecord`);
  });
};

export const addFilter = (filters, filterNameAndValue) => {
  return filters ? `${filters},${filterNameAndValue}` : filterNameAndValue;
};

export const replaceFilter = (filters, filterToReplace, filterToReplaceWith) => {
  const filtersArray = filters.split(',');

  return filtersArray.reduce((acc, _filter) => {
    if (_filter === filterToReplace) {
      return [...acc, filterToReplaceWith];
    }

    return [...acc, _filter];
  }, []).join(',');
};

export const setRecordForDeletion = async (okapi, id, tenantId) => {
  const {
    url,
    token,
  } = okapi;
  const path = `${url}/inventory/instances/${id}/mark-deleted`;

  const response = await fetch(path, {
    method: 'DELETE',
    headers: {
      [OKAPI_TENANT_HEADER]: tenantId,
      [CONTENT_TYPE_HEADER]: 'application/json',
      ...(token && { [OKAPI_TOKEN_HEADER]: token }),
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw response;
  }

  return response;
};

export const parseEmptyFormValue = value => value;

export const redirectToMarcEditPage = (pathname, instance, location, history) => {
  const searchParams = new URLSearchParams(location.search);

  searchParams.delete('relatedRecordVersion');

  if (instance.shared) {
    searchParams.append('shared', instance.shared.toString());
  }

  history.push({
    pathname,
    search: searchParams.toString(),
  });
};

export const sendCalloutOnAffiliationChange = (stripes, tenantId, callout) => {
  if (tenantId && stripes.okapi.tenant !== tenantId) {
    const name = stripes.user.user.tenants.find(tenant => tenant.id === tenantId)?.name;

    if (name) {
      callout.sendCallout({
        type: 'info',
        message: (
          <FormattedMessage
            id="ui-inventory.affiliationChanging.namedNotification"
            values={{ name }}
          />
        ),
      });
    } else {
      callout.sendCallout({
        type: 'info',
        message: <FormattedMessage id="ui-inventory.affiliationChanging.notification" />,
      });
    }
  }
};

export const batchQueryIntoSmaller = (query, VALUES_PER_BATCH = 50) => {
  const arrayParameterRegexp = /[a-zA-Z.]+==\([a-zA-Z0-9-"\s]+\)/g;

  const findArrays = (_query) => {
    // arrays always follow this format: param==(c1 or c2 or c3 or...cN)
    // this function will return start and end indexes in query string for all arrays

    const matches = _query.matchAll(arrayParameterRegexp);

    const indexes = [];

    for (const match of matches) {
      indexes.push({
        arrayString: match[0],
      });
    }

    return indexes;
  };

  /*
    return object with information about search parameter
    {
      parameter: 'item.effectiveLocation',
      values: ["id-1", "id-2", ...]
    }
  */
  const parseArrayString = (arrayString) => {
    const parameter = arrayString.match(/^(.+)==/)[1];
    const values = arrayString.match(/==\((.+)\)/)[1].split(' or ');

    return {
      parameter,
      values,
    };
  };

  /*
    splits `values` in array returned from `parseArrayString` into arrays with batches.
    Max number of items in sub-array is VALUES_PER_BATCH items.
    Example:
    [["id-1", "id-2", "id-3"], ["id-4", "id-5", "id-6"]]
  */
  const splitArrayIntoMultiple = (parsedArray) => {
    if (parsedArray.values.length <= VALUES_PER_BATCH) {
      return [parsedArray.values];
    }

    return parsedArray.values.reduce((acc, cur) => {
      const lastBatch = acc[acc.length - 1];
      if (lastBatch.length < VALUES_PER_BATCH) {
        lastBatch.push(cur);
      } else {
        const newBatch = [cur];
        acc.push(newBatch);
      }

      return acc;
    }, [[]]);
  };

  /*
    returns a cartesian product of multiple arrays. Example

    cartesianProduct([[1, 2], [3, 4]]) --> [[1, 3], [1, 4], [2, 3], [2, 4]]]
  */
  const cartesianProduct = (arr) => {
    return arr.reduce((a, b) => a.map(x => b.map(y => x.concat(y))).reduce((_a, _b) => _a.concat(_b), []), [[]]);
  };

  /*
    To get same results with split requests we need to request all combinations of parameter values
    For a simple example like (modeOfIssuanceId==("id1" or "id2") and items.effectiveLocationId==("id1" or "id2") sortby title
    We can get the same result with 4 requests like:
    (modeOfIssuanceId==("id1") and items.effectiveLocationId==("id1") sortby title
    (modeOfIssuanceId==("id1") and items.effectiveLocationId==("id2") sortby title
    (modeOfIssuanceId==("id2") and items.effectiveLocationId==("id1") sortby title
    (modeOfIssuanceId==("id2") and items.effectiveLocationId==("id2") sortby title

    So basically we accounted for all combinations of parameters.
    We don't need to make combinations with just 1 parameter, of course.
    If an original query has 100 items for each parameter - we can combine by 50 items.
    So:
      50 first items for param1 and 50 first items for param2
      50 first for param1, 50 last for param2
      50 last for param1, 50 first for param2
      50 last for param2, 50 last for param 2
  */
  const getCombinationsOfBatches = (batchesByParameter) => {
    /*
      Format of `batchesByParameter` parameter doesn't let us use it in `cartesianProduct` function directly
      So we're going to generate cartesian product of indesex of batches

      Basically, from [{ parameter: 'param1', batches: [batch1, batch2] }]
      We'll get `batchIndexes` = [[0, 1], [0, 1]]

      With this we can generate cartesian product of batch indexes = [[0, 0], [0, 1], [1, 0], [1, 1]]

      And then iterate over these combinations and take batches by those indexes
    */
    const batchIndexes = batchesByParameter.map(({ batches }) => batches.map((_, index) => index));

    const indexCombinations = cartesianProduct(batchIndexes);
    const combinations = [];

    indexCombinations.forEach((combination, combinationIndex) => {
      combinations.push([]);

      combination.forEach((batchIndex, parameterIndex) => {
        combinations[combinationIndex].push({
          parameter: batchesByParameter[parameterIndex].parameter,
          values: batchesByParameter[parameterIndex].batches[batchIndex],
        });
      });
    });


    return combinations;
  };

  const arrayIndexes = findArrays(query);

  const batchesByParameter = [];
  let queryStringWithPlaceholders = query;

  for (const arrayIndex of arrayIndexes) {
    const parsedArray = parseArrayString(arrayIndex.arrayString);
    const batches = splitArrayIntoMultiple(parsedArray);

    // don't want to mess with string indexes when replacing original values with batches
    // so just mark in original query places where we've taken parameter values. later we'll replace placeholders with actual batches values

    queryStringWithPlaceholders = queryStringWithPlaceholders.replace(arrayIndex.arrayString, `${parsedArray.parameter}_placeholder`);
    batchesByParameter.push({
      parameter: parsedArray.parameter,
      batches,
    });
  }

  // this is where we get all permutations from parameters
  const permutations = getCombinationsOfBatches(batchesByParameter);
  const resultingQueryStrings = [];
  // now we can generate new query searches by replacing original arrays with permutations

  for (const permutation of permutations) {
    const arrayStringsByParameter = {};
    for (const parameterArray of permutation) {
      const { parameter, values } = parameterArray;
      arrayStringsByParameter[parameter] = `${parameter}==(${values.join(' or ')})`;
    }

    let updatedQueryString = queryStringWithPlaceholders;

    Object.keys(arrayStringsByParameter).forEach(parameter => {
      updatedQueryString = updatedQueryString.replace(`${parameter}_placeholder`, arrayStringsByParameter[parameter]);
    });

    resultingQueryStrings.push(updatedQueryString);
  }

  return resultingQueryStrings;
};

export const checkIfCentralOrderingIsActive = centralOrdering => centralOrdering.records[0]?.settings[0]?.value === 'true';

export const flattenCentralTenantPermissions = (centralTenantPermissions) => {
  // Set is used to collect unique permission names because subPermissions can duplicate
  return new Set(centralTenantPermissions?.reduce((acc, currentPermission) => {
    return [
      ...acc,
      currentPermission?.permissionName,
      ...(currentPermission?.subPermissions || [])
    ];
  }, []));
};

export const getSortOptions = (intl) => {
  return Object.keys(SORT_OPTIONS).map(option => ({
    value: SORT_OPTIONS[option],
    label: intl.formatMessage({ id: `ui-inventory.actions.menuSection.sortBy.${option.toLowerCase()}` }),
  }));
};

export const omitCurrentAndCentralTenants = (stripes) => {
  const tenants = stripes?.user?.user?.tenants;

  const currentTenantId = stripes.okapi.tenant;
  const centralTenantId = stripes.user?.user?.consortium?.centralTenantId;

  return tenants?.filter(tenant => tenant.id !== currentTenantId && tenant.id !== centralTenantId);
};
