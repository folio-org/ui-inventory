import { get } from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { stripesConnect } from '@folio/stripes/core';
import { makeQueryFunction } from '@folio/stripes/smart-components';

import withData from './withData';
import { ItemsView } from '../views';
import { getQueryTemplate } from '../utils';
import {
  itemIndexes,
  itemSortMap,
  itemFilterConfig,
  CQL_FIND_ALL,
} from '../constants';

function buildQuery(queryParams, pathComponents, resourceData, logger) {
  const query = { ...resourceData.query };
  const queryIndex = get(query, 'qindex', 'all');
  const queryValue = get(query, 'query', '');
  const queryTemplate = getQueryTemplate(resourceData, itemIndexes);

  if (queryIndex === 'querySearch' && queryValue.match('sortby')) {
    query.sort = '';
  }

  resourceData.query = { ...query, qindex: '' };

  return makeQueryFunction(
    CQL_FIND_ALL,
    queryTemplate,
    itemSortMap,
    itemFilterConfig,
    2
  )(queryParams, pathComponents, resourceData, logger);
}

class ItemsRoute extends React.Component {
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
      <ItemsView
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

ItemsRoute.propTypes = {
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

export default stripesConnect(withData(ItemsRoute));
