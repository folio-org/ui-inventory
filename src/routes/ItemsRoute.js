import React from 'react';
import PropTypes from 'prop-types';
import { stripesConnect } from '@folio/stripes/core';
import { makeQueryFunction } from '@folio/stripes/smart-components';

import withData from './withData';
import { ItemsView } from '../views';
import {
  itemIndexes,
  itemFilterConfig,
} from '../constants';

class ItemsRoute extends React.Component {
  static manifest = Object.freeze({
    records: {
      type: 'okapi',
      records: 'instances',
      recordsRequired: '%{resultCount}',
      perRequest: 30,
      path: 'inventory/instances',
      GET: {
        params: {
          query: (...args) => {
            const [
              queryParams,
              pathComponents,
              resourceData,
              logger,
            ] = args;
            const { query } = resourceData;
            const queryIndex = query.qindex || 'all';
            const searchableIndex = itemIndexes.find(({ value }) => value === queryIndex);
            const queryTemplate = searchableIndex && searchableIndex.queryTemplate;

            resourceData.query = { ...query, qindex: '' };

            return makeQueryFunction(
              'cql.allRecords=1',
              queryTemplate,
              {
                Title: 'title',
                publishers: 'publication',
                Contributors: 'contributors',
              },
              itemFilterConfig,
              2
            )(queryParams, pathComponents, resourceData, logger);
          }
        },
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
