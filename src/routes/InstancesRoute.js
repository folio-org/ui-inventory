import React from 'react';
import PropTypes from 'prop-types';
import {
  keyBy,
  get,
  template,
} from 'lodash';
import { stripesConnect } from '@folio/stripes/core';
import { makeQueryFunction } from '@folio/stripes/smart-components';

import InstancesView from '../views';
import {
  searchableIndexes,
  filterConfig,
} from '../constants';
import { psTitleRelationshipId } from '../utils';

const INITIAL_RESULT_COUNT = 30;

class InstancesRoute extends React.Component {
  static defaultProps = {
    browseOnly: false,
    showSingleResult: true,
  };

  static manifest = Object.freeze({
    numFiltersLoaded: { initialValue: 1 }, // will be incremented as each filter loads
    query: {
      initialValue: {
        query: '',
        filters: '',
        sort: 'title',
      },
    },
    resultCount: { initialValue: INITIAL_RESULT_COUNT },
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
            const searchableIndex = searchableIndexes.find(idx => idx.value === queryIndex);
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
              filterConfig,
              2
            )(queryParams, pathComponents, resourceData, logger);
          }
        },
        staticFallback: { params: {} },
      },
    },
    identifierTypes: {
      type: 'okapi',
      records: 'identifierTypes',
      path: 'identifier-types?limit=1000&query=cql.allRecords=1 sortby name',
    },
    contributorTypes: {
      type: 'okapi',
      records: 'contributorTypes',
      path: 'contributor-types?limit=400&query=cql.allRecords=1 sortby name',
    },
    contributorNameTypes: {
      type: 'okapi',
      records: 'contributorNameTypes',
      path: 'contributor-name-types?limit=1000&query=cql.allRecords=1 sortby ordering',
    },
    instanceFormats: {
      type: 'okapi',
      records: 'instanceFormats',
      path: 'instance-formats?limit=1000&query=cql.allRecords=1 sortby name',
    },
    instanceTypes: {
      type: 'okapi',
      records: 'instanceTypes',
      path: 'instance-types?limit=1000&query=cql.allRecords=1 sortby name',
    },
    classificationTypes: {
      type: 'okapi',
      records: 'classificationTypes',
      path: 'classification-types?limit=1000&query=cql.allRecords=1 sortby name',
    },
    alternativeTitleTypes: {
      type: 'okapi',
      records: 'alternativeTitleTypes',
      path: 'alternative-title-types?limit=1000&query=cql.allRecords=1 sortby name',
    },
    locations: {
      type: 'okapi',
      records: 'locations',
      path: 'locations?limit=1000&query=cql.allRecords=1 sortby name',
    },
    instanceRelationshipTypes: {
      type: 'okapi',
      records: 'instanceRelationshipTypes',
      path: 'instance-relationship-types?limit=1000&query=cql.allRecords=1 sortby name',
    },
    instanceStatuses: {
      type: 'okapi',
      records: 'instanceStatuses',
      path: 'instance-statuses?limit=1000&query=cql.allRecords=1 sortby name',
    },
    modesOfIssuance: {
      type: 'okapi',
      records: 'issuanceModes',
      path: 'modes-of-issuance?limit=1000&query=cql.allRecords=1 sortby name',
    },
    instanceNoteTypes: {
      type: 'okapi',
      path: 'instance-note-types',
      params: {
        query: 'cql.allRecords=1 sortby name',
        limit: '1000',
      },
      records: 'instanceNoteTypes',
    },
    electronicAccessRelationships: {
      type: 'okapi',
      records: 'electronicAccessRelationships',
      path: 'electronic-access-relationships?limit=1000&query=cql.allRecords=1 sortby name',
    },
    statisticalCodeTypes: {
      type: 'okapi',
      records: 'statisticalCodeTypes',
      path: 'statistical-code-types?limit=1000&query=cql.allRecords=1 sortby name',
    },
    statisticalCodes: {
      type: 'okapi',
      records: 'statisticalCodes',
      path: 'statistical-codes?limit=1000&query=cql.allRecords=1 sortby name',
    },
    illPolicies: {
      type: 'okapi',
      path: 'ill-policies?limit=1000&query=cql.allRecords=1 sortby name',
      records: 'illPolicies',
    },
    holdingsTypes: {
      type: 'okapi',
      path: 'holdings-types?limit=1000&query=cql.allRecords=1 sortby name',
      records: 'holdingsTypes',
    },
    callNumberTypes: {
      type: 'okapi',
      path: 'call-number-types?limit=1000&query=cql.allRecords=1 sortby name',
      records: 'callNumberTypes',
    },
    holdingsNoteTypes: {
      type: 'okapi',
      path: 'holdings-note-types?limit=1000&query=cql.allRecords=1 sortby name',
      records: 'holdingsNoteTypes',
    },
    itemNoteTypes: {
      type: 'okapi',
      path: 'item-note-types',
      params: {
        query: 'cql.allRecords=1 sortby name',
        limit: '1000',
      },
      records: 'itemNoteTypes',
    },
    itemDamagedStatuses: {
      type: 'okapi',
      path: 'item-damaged-statuses?limit=1000&query=cql.allRecords=1 sortby name',
      records: 'itemDamageStatuses',
    },
    natureOfContentTerms: {
      type: 'okapi',
      path: 'nature-of-content-terms?limit=1000&query=cql.allRecords=1 sortby name',
      records: 'natureOfContentTerms',
    },
  });

  createInstance = (instance) => {
    // Massage record to add preceeding and succeeding title fields in the
    // right place.
    const instanceCopy = this.combineRelTitles(instance);

    // POST item record
    this.props.mutator.records.POST(instanceCopy).then(() => {
      this.closeNewInstance();
    });
  };

  combineRelTitles = (instance) => {
    // preceding/succeeding titles are stored in parentInstances and childInstances
    // in the instance record. Each title needs to provide an instance relationship
    // type ID corresponding to 'preceeding-succeeding' in addition to the actual
    // parent/child instance ID.
    let instanceCopy = instance;
    const titleRelationshipTypeId = psTitleRelationshipId(this.props.resources.instanceRelationshipTypes.records);
    const precedingTitles = map(instanceCopy.precedingTitles, p => { p.instanceRelationshipTypeId = titleRelationshipTypeId; return p; });
    set(instanceCopy, 'parentInstances', concat(instanceCopy.parentInstances, precedingTitles));
    const succeedingTitles = map(instanceCopy.succeedingTitles, p => { p.instanceRelationshipTypeId = titleRelationshipTypeId; return p; });
    set(instanceCopy, 'childInstances', succeedingTitles);
    instanceCopy = omit(instanceCopy, ['precedingTitles', 'succeedingTitles']);
    return instanceCopy;
  }

  isLoading() {
    const { manifest } = InstancesRoute;
    const { resources } = this.props;

    for (const key in manifest) {
      if (key !== 'records' && manifest[key].type === 'okapi' &&
        !(resources[key] && resources[key].hasLoaded)) {
        return true;
      }
    }

    return false;
  }

  getData() {
    const { manifest } = InstancesRoute;
    const { resources } = this.props;
    const data = {};

    for (const key in manifest) {
      if (key !== 'records' && manifest[key].type === 'okapi') {
        data[key] = get(resources, `${key}.records`, []);
      }
    }

    data.locationsById = keyBy(data.locations, 'id');
    data.query = resources.query;

    return data;
  }

  render() {
    const {
      showSingleResult,
      browseOnly,
      onSelectRow,
      disableRecordCreation,
      resources,
      mutator,
    } = this.props;

    if (this.isLoading()) {
      return null;
    }

    return (
      <InstancesView
        parentResources={resources}
        parentMutator={mutator}
        data={this.getData()}
        browseOnly={browseOnly}
        showSingleResult={showSingleResult}
        onCreate={this.createInstance}
        onSelectRow={onSelectRow}
        disableRecordCreation={disableRecordCreation}
      />
    );
  }
}

InstancesRoute.propTypes = {
  resources: PropTypes.shape({
    records: PropTypes.shape({
      hasLoaded: PropTypes.bool.isRequired,
      other: PropTypes.shape({
        totalRecords: PropTypes.number,
        total_records: PropTypes.number,
      }),
      successfulMutations: PropTypes.arrayOf(
        PropTypes.shape({
          record: PropTypes.shape({
            id: PropTypes.string.isRequired,
          }).isRequired,
        }),
      ),
    }),
    numFiltersLoaded: PropTypes.number,
    resultCount: PropTypes.number,
    instanceTypes: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object),
    }),
    itemNoteTypes: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object),
    }),
    locations: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object),
    }),
    query: PropTypes.shape({
      qindex: PropTypes.string,
      term: PropTypes.string,
    }),
  }).isRequired,
  match: PropTypes.shape({
    path: PropTypes.string.isRequired,
    params: PropTypes.object.isRequired,
  }).isRequired,
  mutator: PropTypes.shape({
    addInstanceMode: PropTypes.shape({
      replace: PropTypes.func,
    }),
    numFiltersLoaded: PropTypes.shape({
      replace: PropTypes.func.isRequired,
    }),
    records: PropTypes.shape({
      POST: PropTypes.func,
    }),
    resultCount: PropTypes.shape({
      replace: PropTypes.func,
    }),
    query: PropTypes.shape({
      update: PropTypes.func,
    }),
  }).isRequired,
  showSingleResult: PropTypes.bool, // eslint-disable-line react/no-unused-prop-types
  browseOnly: PropTypes.bool,
  disableRecordCreation: PropTypes.bool,
  onSelectRow: PropTypes.func,
};

export default stripesConnect(InstancesRoute);
