import React from 'react';
import PropTypes from 'prop-types';
import { stripesConnect } from '@folio/stripes/core';
import { makeQueryFunction } from '@folio/stripes/smart-components';

import withData from './withData';
import { HoldingsView } from '../views';
import { getQueryTemplate } from '../utils';
import {
  holdingIndexes,
  holdingSortMap,
  holdingFilterConfig,
  CQL_FIND_ALL,
} from '../constants';

function query(queryParams, pathComponents, resourceData, logger) {
  const queryTemplate = getQueryTemplate(resourceData, holdingIndexes);

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
        params: { query },
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
