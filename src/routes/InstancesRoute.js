import React from 'react';
import PropTypes from 'prop-types';
import {
  template,
  get,
} from 'lodash';
import { stripesConnect } from '@folio/stripes/core';
import { makeQueryFunction } from '@folio/stripes/smart-components';

import withData from './withData';
import { InstancesView } from '../views';
import {
  instanceIndexes,
  instanceFilterConfig,
  instanceSortMap,
  CQL_FIND_ALL,
} from '../constants';
import { getQueryTemplate } from '../utils';

function getIsbnIssnTemplate(queryTemplate, props, queryIndex) {
  const { resources: { identifierTypes } } = props;
  const identifierType = get(identifierTypes, 'records', [])
    .find(({ name }) => name.toLowerCase() === queryIndex);
  const identifierTypeId = get(identifierType, 'id', 'identifier-type-not-found');

  return template(queryTemplate)({ identifierTypeId });
}

function buildQuery(queryParams, pathComponents, resourceData, logger, props) {
  const query = { ...resourceData.query };
  const queryIndex = get(query, 'qindex', 'all');
  const queryValue = get(query, 'query', '');
  let queryTemplate = getQueryTemplate(queryIndex, instanceIndexes);

  if (queryIndex.match(/isbn|issn/)) {
    queryTemplate = getIsbnIssnTemplate(queryTemplate, props, queryIndex);
  }

  if (queryIndex === 'querySearch' && queryValue.match('sortby')) {
    query.sort = '';
  }

  resourceData.query = { ...query, qindex: '' };

  return makeQueryFunction(
    CQL_FIND_ALL,
    queryTemplate,
    instanceSortMap,
    instanceFilterConfig,
    2
  )(queryParams, pathComponents, resourceData, logger, props);
}

class InstancesRoute extends React.Component {
  static propTypes = {
    resources: PropTypes.object.isRequired,
    mutator: PropTypes.object.isRequired,
    showSingleResult: PropTypes.bool,
    browseOnly: PropTypes.bool,
    disableRecordCreation: PropTypes.bool,
    onSelectRow: PropTypes.func,
    isLoading: PropTypes.func,
    getData: PropTypes.func,
    createInstance: PropTypes.func,
  };

  static manifest = Object.freeze({
    records: {
      type: 'okapi',
      records: 'instances',
      recordsRequired: '%{resultCount}',
      perRequest: 30,
      path: 'inventory/instances',
      GET: {
        params: { query: buildQuery },
        staticFallback: { params: {} },
      },
    }
  });

  render() {
    const {
      showSingleResult,
      browseOnly,
      onSelectRow,
      disableRecordCreation,
      resources,
      mutator,
      isLoading,
      getData,
      createInstance,
    } = this.props;

    if (isLoading()) {
      return null;
    }

    return (
      <InstancesView
        parentResources={resources}
        parentMutator={mutator}
        data={getData()}
        browseOnly={browseOnly}
        showSingleResult={showSingleResult}
        onCreate={createInstance}
        onSelectRow={onSelectRow}
        disableRecordCreation={disableRecordCreation}
      />
    );
  }
}

export default stripesConnect(withData(InstancesRoute));
