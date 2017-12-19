import React from 'react';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import _ from 'lodash';

import SearchAndSort from '@folio/stripes-smart-components/lib/SearchAndSort';
import { filters2cql, initialFilterState, onChangeFilter as commonChangeFilter } from '@folio/stripes-components/lib/FilterGroups';
import transitionToParams from '@folio/stripes-components/util/transitionToParams';

import packageInfo from './package';
import InstanceForm from './edit/InstanceForm';
import ViewInstance from './ViewInstance';
import formatters from './referenceFormatters';
import utils from './utils';

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
    cql: 'location.id',
    values: [],
  },
];

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
              This is necessary, as makeQueryFunction only referneces query paramaters as a data source.
              STRIPES-480 is intended to correct this and allow this query function to be replace with a call
              to makeQueryFunction.
              https://issues.folio.org/browse/STRIPES-480
            */
            const resourceData = args[2];
            const sortMap = {
              Title: 'title',
              Publisher: 'publisher',
              Contributors: 'contributors',
            };

            let cql = `(title="${resourceData.query.query}*" or contributors="name": "${resourceData.query.query}*" or identifiers="value": "${resourceData.query.query}*")`;
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
      path: 'identifier-types?limit=100',
    },
    creatorTypes: {
      type: 'okapi',
      records: 'creatorTypes',
      path: 'creator-types?limit=100',
    },
    contributorTypes: {
      type: 'okapi',
      records: 'contributorTypes',
      path: 'contributor-types?limit=100',
    },
    instanceFormats: {
      type: 'okapi',
      records: 'instanceFormats',
      path: 'instance-formats?limit=100',
    },
    instanceTypes: {
      type: 'okapi',
      records: 'instanceTypes',
      path: 'instance-types?limit=100',
    },
    classificationTypes: {
      type: 'okapi',
      records: 'classificationTypes',
      path: 'classification-types?limit=100',
    },
    locations: {
      type: 'okapi',
      records: 'shelflocations',
      path: 'shelf-locations?limit=100',
    },
  });

  constructor(props) {
    super(props);

    const query = props.location.search ? queryString.parse(props.location.search) : {};
    this.state = {
      searchTerm: query.query || '',
      sortOrder: query.sort || '',
      filters: initialFilterState(filterConfig, query.filters),
    };
    this.transitionToParams = transitionToParams.bind(this);
    this.cViewInstance = this.props.stripes.connect(ViewInstance);
    this.resultsList = null;
    this.SRStatus = null;

    this.onChangeFilter = commonChangeFilter.bind(this);
    this.copyInstance = this.copyInstance.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const resource = this.props.resources.records;
    if (resource && resource.isPending && !nextProps.resources.records.isPending) {
      const resultAmount = nextProps.resources.records.other.totalRecords;
      if (this.SRSStatus) this.SRStatus.sendMessage(`Search returned ${resultAmount} result${resultAmount !== 1 ? 's' : ''}`);
    }
  }

  /**
   * fill in the filter values
   */
  componentWillUpdate() {
    // resource types
    const rt = (this.props.resources.instanceTypes || {}).records || [];
    if (rt && rt.length) {
      filterConfig[0].values = rt.map(rec => ({ name: rec.name, cql: rec.id }))
        .sort((a, b) => a.name.localeCompare(b.name));
    }

    // locations
    const locations = (this.props.resources.locations || {}).records || [];
    if (locations && locations.length) {
      filterConfig[2].values = locations.map(rec => ({ name: rec.name, cql: rec.id }));
    }
  }

  onClearSearch = () => {
    const path = (_.get(packageInfo, ['stripes', 'home']) ||
                  _.get(packageInfo, ['stripes', 'route']));
    this.setState({
      searchTerm: '',
      sortOrder: 'title',
      filters: {},
    });
    this.props.history.push(path);
  }

  onSort = (e, meta) => {
    const newOrder = meta.alias;
    const oldOrder = this.state.sortOrder || '';
    const orders = oldOrder ? oldOrder.split(',') : [];
    if (orders[0] && newOrder === orders[0].replace(/^-/, '')) {
      orders[0] = `-${orders[0]}`.replace(/^--/, '');
    } else {
      orders.unshift(newOrder);
    }

    const sortOrder = orders.slice(0, 2).join(',');
    this.setState({ sortOrder });
    this.transitionToParams({ sort: sortOrder });
  }

  onClickAddNewInstance = (e) => {
    if (e) e.preventDefault();
    this.transitionToParams({ layer: 'create' });
  }

  onChangeSearch = (e) => {
    this.props.mutator.resultCount.replace(INITIAL_RESULT_COUNT);
    const query = e.target.value;
    this.setState({ searchTerm: query });
    this.performSearch(query);
  }

  onChangeFilter = (e) => {
    this.props.mutator.resultCount.replace(INITIAL_RESULT_COUNT);
    this.commonChangeFilter(e);
  }

  openInstance(selectedInstance) {
    const instanceId = selectedInstance.id;
    this.setState({ selectedInstance });
    this.props.history.push(`/inventory/view/${instanceId}${this.props.location.search}`);
  }

  updateFilters(filters) { // provided for onChangeFilter
    this.transitionToParams({ filters: Object.keys(filters).filter(key => filters[key]).join(',') });
  }

  closeNewInstance = (e) => {
    if (e) e.preventDefault();
    this.setState({ copiedInstance: null });
    utils.removeQueryParam('layer', this.props.location, this.props.history);
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

  performSearch = _.debounce((query) => {
    this.transitionToParams({ query });
  }, 250);

  collapseDetails = () => {
    this.setState({
      selectedItem: {},
    });
    this.props.history.push(`${this.props.match.path}${this.props.location.search}`);
  };

  render() {
    const { resources } = this.props;
    const creatorTypes = (resources.creatorTypes || emptyObj).records || emptyArr;
    const contributorTypes = (resources.contributorTypes || emptyObj).records || emptyArr;
    const identifierTypes = (resources.identifierTypes || emptyObj).records || emptyArr;
    const classificationTypes = (resources.classificationTypes || emptyObj).records || emptyArr;
    const instanceTypes = (resources.instanceTypes || emptyObj).records || emptyArr;
    const instanceFormats = (resources.instanceFormats || emptyObj).records || emptyArr;
    const referenceTables = {
      creatorTypes,
      contributorTypes,
      identifierTypes,
      classificationTypes,
      instanceTypes,
      instanceFormats,
    };

    const initialPath = (_.get(packageInfo, ['stripes', 'home']) ||
                         _.get(packageInfo, ['stripes', 'route']));

    const resultsFormatter = {
      publishers: r => r.publication.map(p => `${p.publisher} ${p.dateOfPublication ? `(${p.dateOfPublication})` : ''}`).join(', '),
      'publication date': r => r.publication.map(p => p.dateOfPublication).join(', '),
      contributors: r => formatters.contributorsFormatter(r, contributorTypes),
    };

    return (<SearchAndSort
      moduleName={packageInfo.name.replace(/.*\//, '')}
      moduleTitle={packageInfo.stripes.displayName}
      objectName="inventory"
      baseRoute={packageInfo.stripes.route}
      initialPath={initialPath}
      filterConfig={filterConfig}
      initialResultCount={INITIAL_RESULT_COUNT}
      resultCountIncrement={RESULT_COUNT_INCREMENT}
      viewRecordComponent={ViewInstance}
      editRecordComponent={InstanceForm}
// @@      newRecordInitialValues={{ active: true, personal: { preferredContactTypeId: '002' } }}
      visibleColumns={['title', 'contributors', 'publishers']}
      resultsFormatter={resultsFormatter}
      onCreate={this.onClickAddNewInstance}
// @@      massageNewRecord={this.massageNewRecord}
      finishedResourceName="perms"
      viewRecordPerms="users.item.get"
      newRecordPerms="users.item.post,login.item.post,perms.users.item.post"
      // viewRecordPerms="module.inventory.enabled" // @@
      // newRecordPerms="module.inventory.enabled" // @@
      disableRecordCreation={false}
      parentResources={this.props.resources}
      parentMutator={this.props.mutator}

      detailProps={{ referenceTables }}
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
      isPending: PropTypes.bool.isPending,
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
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
    search: PropTypes.string,
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

export default Instances;
