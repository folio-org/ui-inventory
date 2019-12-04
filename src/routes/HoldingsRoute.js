import { get } from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';

import { stripesConnect } from '@folio/stripes/core';
import { makeQueryFunction } from '@folio/stripes/smart-components';

import withData from './withData';
import { HoldingsView } from '../views';
import {
  getQueryTemplate,
  getIsbnIssnTemplate,
} from '../utils';
import {
  holdingIndexes,
  holdingSortMap,
  holdingFilterConfig,
  CQL_FIND_ALL,
} from '../constants';

function buildQuery(queryParams, pathComponents, resourceData, logger, props) {
  const query = { ...resourceData.query };
  const queryIndex = get(query, 'qindex', 'all');
  const queryValue = get(query, 'query', '');
  let queryTemplate = getQueryTemplate(queryIndex, holdingIndexes);

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
    holdingSortMap,
    holdingFilterConfig,
    2
  )(queryParams, pathComponents, resourceData, logger);
}

class HoldingsRoute extends React.Component {
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
    },
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
      <HoldingsView
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

HoldingsRoute.propTypes = {
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

export default stripesConnect(withData(HoldingsRoute));
