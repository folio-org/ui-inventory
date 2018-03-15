import React from 'react';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import _ from 'lodash';

import SearchAndSort from '@folio/stripes-smart-components/lib/SearchAndSort';
import { filters2cql, onChangeFilter as commonChangeFilter } from '@folio/stripes-components/lib/FilterGroups';
import transitionToParams from '@folio/stripes-components/util/transitionToParams';
import removeQueryParam from '@folio/stripes-components/util/removeQueryParam';

import packageInfo from './package';
import InstanceForm from './edit/InstanceForm';
import ViewInstance from './ViewInstance';
import formatters from './referenceFormatters';

const INITIAL_RESULT_COUNT = 30;
const RESULT_COUNT_INCREMENT = 30;
const emptyObj = {};
const emptyArr = [];


const languages = [
  { code: 'eng', name: 'English' },
  { code: 'spa', name: 'Spanish' },
  { code: 'fre', name: 'French' },
  { code: 'ger', name: 'German' },
  { code: 'chi', name: 'Mandarin' },
  { code: 'rus', name: 'Russian' },
  { code: 'ara', name: 'Arabic' },
];

// the empty 'values' properties will be filled in by componentWillUpdate
// as those are pulled from the backend
const filterConfig = [
  {
    label: 'Resource Type',
    name: 'resource',
    cql: 'instanceTypeId',
    values: [],
  },
  {
    label: 'Language',
    name: 'language',
    cql: 'languages',
    values: languages.map(rec => ({ name: rec.name, cql: rec.code })),
  },
  {
    label: 'Location',
    name: 'location',
    cql: 'holdingsRecords.permanentLocationId',
    values: [],
  },
];

const GET_INSTANCES = gql`
query allInstances {
  instances {
     id,
     source,
     title,
     alternativeTitles,
     edition,
     series,
     identifiers { value, identifierTypeId,
                   identifierType { name }
                 },
     contributors { name,
                    contributorTypeId,
                    contributorNameTypeId,
                    primary,
                    contributorType { name },
                    contributorNameType { name }
                  },
     subjects,
     classifications { classificationNumber,
                       classificationTypeId,
                       classificationType { name }
                     },
     publication { publisher,
                   place,
                   dateOfPublication },
     urls,
     instanceTypeId,
     instanceType { name },
     instanceFormatId,
     instanceFormat {name},
     physicalDescriptions,
     languages,
     notes,
     metadata { updatedByUser { username } }
  }
}
`;

class Instances extends React.Component {
  static manifest = Object.freeze({
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
      path: 'instance-storage/instances',
      GET: {
        params: {
          query: (...args) => {
            /*
              This code is not DRY as it is copied from makeQueryFunction in stripes-components.
              This is necessary, as makeQueryFunction only references query parameters as a data source.
              STRIPES-480 is intended to correct this and allow this query function to be replace with a call
              to makeQueryFunction.
              https://issues.folio.org/browse/STRIPES-480
            */
            const resourceData = args[2];
            const sortMap = {
              Title: 'title',
              publishers: 'publication',
              Contributors: 'contributors',
            };

            let cql = `(title="${resourceData.query.query}*" or contributors adj "\\"name\\": \\"${resourceData.query.query}*\\"" or identifiers adj "\\"value\\": \\"${resourceData.query.query}*\\"")`;
            const filterCql = filters2cql(filterConfig, resourceData.query.filters);
            if (filterCql) {
              if (cql) {
                cql = `(${cql}) and ${filterCql}`;
              } else {
                cql = filterCql;
              }
            }

            const { sort } = resourceData.query;
            if (sort) {
              const sortIndexes = sort.split(',').map((sort1) => {
                let reverse = false;
                if (sort1.startsWith('-')) {
                  // eslint-disable-next-line no-param-reassign
                  sort1 = sort1.substr(1);
                  reverse = true;
                }
                let sortIndex = sortMap[sort1] || sort1;
                if (reverse) {
                  sortIndex = `${sortIndex.replace(' ', '/sort.descending ')}/sort.descending`;
                }
                return sortIndex;
              });

              cql += ` sortby ${sortIndexes.join(' ')}`;
            }

            return cql;
          },
        },
        staticFallback: { params: {} },
      },
    },
    identifierTypes: {
      type: 'okapi',
      records: 'identifierTypes',
      path: 'identifier-types?limit=100&query=cql.allRecords=1 sortby name',
    },
    contributorTypes: {
      type: 'okapi',
      records: 'contributorTypes',
      path: 'contributor-types?limit=100&query=cql.allRecords=1 sortby name',
    },
    contributorNameTypes: {
      type: 'okapi',
      records: 'contributorNameTypes',
      path: 'contributor-name-types?limit=100&query=cql.allRecords=1 sortby name',
    },
    instanceFormats: {
      type: 'okapi',
      records: 'instanceFormats',
      path: 'instance-formats?limit=100&query=cql.allRecords=1 sortby name',
    },
    instanceTypes: {
      type: 'okapi',
      records: 'instanceTypes',
      path: 'instance-types?limit=100&query=cql.allRecords=1 sortby name',
    },
    classificationTypes: {
      type: 'okapi',
      records: 'classificationTypes',
      path: 'classification-types?limit=100&query=cql.allRecords=1 sortby name',
    },
    locations: {
      type: 'okapi',
      records: 'shelflocations',
      path: 'shelf-locations?limit=100&query=cql.allRecords=1 sortby name',
    },
  });

  constructor(props) {
    super(props);

    this.transitionToParams = transitionToParams.bind(this);
    this.removeQueryParam = removeQueryParam.bind(this);

    this.cViewInstance = this.props.stripes.connect(ViewInstance);
    this.resultsList = null;
    this.SRStatus = null;

    this.onChangeFilter = commonChangeFilter.bind(this);
    this.copyInstance = this.copyInstance.bind(this);
  }

  /**
   * fill in the filter values
   */
  componentWillUpdate() {
    // resource types
    const rt = (this.props.resources.instanceTypes || {}).records || [];
    if (rt && rt.length) {
      filterConfig[0].values = rt.map(rec => ({ name: rec.name, cql: rec.id }));
    }

    // locations
    const locations = (this.props.resources.locations || {}).records || [];
    if (locations && locations.length) {
      filterConfig[2].values = locations.map(rec => ({ name: rec.name, cql: rec.id }));
    }
  }

  updateFilters(filters) { // provided for onChangeFilter
    this.transitionToParams({ filters: Object.keys(filters).filter(key => filters[key]).join(',') });
  }

  closeNewInstance = (e) => {
    if (e) e.preventDefault();
    this.setState({ copiedInstance: null });
    this.removeQueryParam('layer');
  }

  copyInstance(instance) {
    this.setState({ copiedInstance: _.omit(instance, ['id']) });
    this.transitionToParams({ layer: 'create' });
  }

  createInstance = (instance) => {
    // POST item record
    this.props.mutator.records.POST(instance).then(() => {
      this.closeNewInstance();
    });
  }

  render() {
    const { resources } = this.props;
    const contributorTypes = (resources.contributorTypes || emptyObj).records || emptyArr;
    const contributorNameTypes = (resources.contributorNameTypes || emptyObj).records || emptyArr;
    const identifierTypes = (resources.identifierTypes || emptyObj).records || emptyArr;
    const classificationTypes = (resources.classificationTypes || emptyObj).records || emptyArr;
    const instanceTypes = (resources.instanceTypes || emptyObj).records || emptyArr;
    const instanceFormats = (resources.instanceFormats || emptyObj).records || emptyArr;
    const shelfLocations = (resources.locations || emptyObj).records || emptyArr;

    const referenceTables = {
      contributorTypes,
      contributorNameTypes,
      identifierTypes,
      classificationTypes,
      instanceTypes,
      instanceFormats,
      shelfLocations,
    };

    const resultsFormatter = {
      publishers: r => r.publication.map(p => `${p.publisher} ${p.dateOfPublication ? `(${p.dateOfPublication})` : ''}`).join(', '),
      'publication date': r => r.publication.map(p => p.dateOfPublication).join(', '),
      contributors: r => formatters.contributorsFormatter(r, contributorTypes),
    };

    return (<SearchAndSort
      packageInfo={packageInfo}
      objectName="inventory"
      maxSortKeys={1}
      filterConfig={filterConfig}
      initialResultCount={INITIAL_RESULT_COUNT}
      resultCountIncrement={RESULT_COUNT_INCREMENT}
      viewRecordComponent={ViewInstance}
      editRecordComponent={InstanceForm}
      newRecordInitialValues={(this.state && this.state.copiedInstance) ? this.state.copiedInstance : { source: 'manual' }}
      visibleColumns={['title', 'contributors', 'publishers']}
      columnWidths={{ title: '40%' }}
      resultsFormatter={resultsFormatter}
      onCreate={this.createInstance}
      viewRecordPerms="inventory-storage.instances.item.get"
      newRecordPerms="inventory-storage.instances.item.post"
      disableRecordCreation={false}
      parentResources={this.props.resources}
      parentMutator={this.props.mutator}
      detailProps={{ referenceTables, onCopy: this.copyInstance }}
      path={`${this.props.match.path}/view/:id/:holdingsrecordid?/:itemid?`}
      showSingleResult
    />);
  }
}

Instances.propTypes = {
  stripes: PropTypes.shape({
    connect: PropTypes.func.isRequired,
    locale: PropTypes.string.isRequired,
  }).isRequired,
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
    resultCount: PropTypes.number,
    instanceTypes: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object),
    }),
    locations: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object),
    }),
  }).isRequired,
  match: PropTypes.shape({
    path: PropTypes.string.isRequired,
  }).isRequired,
  mutator: PropTypes.shape({
    addInstanceMode: PropTypes.shape({
      replace: PropTypes.func,
    }),
    records: PropTypes.shape({
      POST: PropTypes.func,
    }),
    resultCount: PropTypes.shape({
      replace: PropTypes.func,
    }),
  }).isRequired,
};

export default compose(
  graphql(GET_INSTANCES),
)(Instances);
