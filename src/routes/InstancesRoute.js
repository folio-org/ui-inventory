import React from 'react';
import PropTypes from 'prop-types';
import { template } from 'lodash';
import { stripesConnect } from '@folio/stripes/core';
import { makeQueryFunction } from '@folio/stripes/smart-components';

import withData from './withData';
import { InstancesView } from '../views';
import {
  instanceIndexes,
  instanceFilterConfig,
} from '../constants';

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
        params: {
          query: (...args) => {
            const [
              queryParams,
              pathComponents,
              resourceData,
              logger
            ] = args;
            const queryIndex = resourceData.query.qindex ? resourceData.query.qindex : 'all';
            const searchableIndex = instanceIndexes.find(idx => idx.value === queryIndex);
            let queryTemplate = '';

            if (queryIndex === 'isbn' || queryIndex === 'issn') {
              const identifierType = resourceData.identifier_types.records.find(type => type.name.toLowerCase() === queryIndex);
              const identifierTypeId = identifierType ? identifierType.id : 'identifier-type-not-found';

              queryTemplate = template(searchableIndex.queryTemplate)({ identifierTypeId });
            } else {
              queryTemplate = searchableIndex.queryTemplate;
            }

            resourceData.query = { ...resourceData.query, qindex: '' };

            return makeQueryFunction(
              'cql.allRecords=1',
              queryTemplate,
              {
                Title: 'title',
                publishers: 'publication',
                Contributors: 'contributors',
              },
              instanceFilterConfig,
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
