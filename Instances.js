import React from 'react';
import PropTypes from 'prop-types';
import Route from 'react-router-dom/Route';
import queryString from 'query-string';
import _ from 'lodash';

import Pane from '@folio/stripes-components/lib/Pane';
import Paneset from '@folio/stripes-components/lib/Paneset';
import PaneMenu from '@folio/stripes-components/lib/PaneMenu';
import Button from '@folio/stripes-components/lib/Button';
import MultiColumnList from '@folio/stripes-components/lib/MultiColumnList';
import FilterPaneSearch from '@folio/stripes-components/lib/FilterPaneSearch';
import FilterGroups, { initialFilterState, onChangeFilter as commonChangeFilter } from '@folio/stripes-components/lib/FilterGroups';

import Layer from '@folio/stripes-components/lib/Layer';
import SRStatus from '@folio/stripes-components/lib/SRStatus';
import transitionToParams from '@folio/stripes-components/util/transitionToParams';
import makeQueryFunction from '@folio/stripes-components/util/makeQueryFunction';

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
    cql: 'location.id',
    values: [],
  },
];

class Instances extends React.Component {
  static manifest = Object.freeze({
    instanceCount: { initialValue: INITIAL_RESULT_COUNT },
    instances: {
      type: 'okapi',
      records: 'instances',
      path: 'instance-storage/instances',
      recordsRequired: '%{instanceCount}',
      perRequest: RESULT_COUNT_INCREMENT,
      GET: {
        params: {
          query: makeQueryFunction(
            'cql.allRecords=1',
            'title="$QUERY*" or contributors="name": "$QUERY*" or identifiers="value": "$QUERY*"',
            { Title: 'title' },
            filterConfig,
          ),
        },
        staticFallback: { params: {} },
      },
    },
    identifierTypes: {
      type: 'okapi',
      records: 'identifierTypes',
      path: 'identifier-types?limit=100',
    },
    contributorTypes: {
      type: 'okapi',
      records: 'contributorTypes',
      path: 'contributor-types?limit=100',
    },
    contributorNameTypes: {
      type: 'okapi',
      records: 'contributorNameTypes',
      path: 'contributor-name-types?limit=100',
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
    const resource = this.props.resources.instances;
    if (resource && resource.isPending && !nextProps.resources.instances.isPending) {
      const resultAmount = nextProps.resources.instances.other.totalRecords;
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

  onSelectRow = (e, meta) => {
    this.openInstance(meta);
  }

  onClickAddNewInstance = (e) => {
    if (e) e.preventDefault();
    this.transitionToParams({ layer: 'create' });
  }

  onChangeSearch = (e) => {
    this.props.mutator.instanceCount.replace(INITIAL_RESULT_COUNT);
    const query = e.target.value;
    this.setState({ searchTerm: query });
    this.performSearch(query);
  }

  onChangeFilter = (e) => {
    this.props.mutator.instanceCount.replace(INITIAL_RESULT_COUNT);
    this.commonChangeFilter(e);
  }

  onNeedMore = () => {
    this.props.mutator.instanceCount.replace(this.props.resources.instanceCount + RESULT_COUNT_INCREMENT);
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
    formatters.removeQueryParam('layer', this.props.location, this.props.history);
  }

  copyInstance(instance) {
    this.setState({ copiedInstance: _.omit(instance, ['id']) });
    this.transitionToParams({ layer: 'create' });
  }

  createInstance = (instance) => {
    // POST item record
    this.props.mutator.instances.POST(instance).then(() => {
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
    const { stripes, okapi, match, resources, location } = this.props;
    const instances = (resources.instances || emptyObj).records || emptyArr;
    const contributorTypes = (resources.contributorTypes || emptyObj).records || emptyArr;
    const contributorNameTypes = (resources.contributorNameTypes || emptyObj).records || emptyArr;
    const identifierTypes = (resources.identifierTypes || emptyObj).records || emptyArr;
    const classificationTypes = (resources.classificationTypes || emptyObj).records || emptyArr;
    const instanceTypes = (resources.instanceTypes || emptyObj).records || emptyArr;
    const instanceFormats = (resources.instanceFormats || emptyObj).records || emptyArr;
    const referenceTables = {
      contributorTypes,
      contributorNameTypes,
      identifierTypes,
      classificationTypes,
      instanceTypes,
      instanceFormats,
    };

    const query = location.search ? queryString.parse(location.search) : {};
    const searchHeader = <FilterPaneSearch id="input-instances-search" onChange={this.onChangeSearch} onClear={this.onClearSearch} resultsList={this.resultsList} value={this.state.searchTerm} />;
    const newInstanceButton = <PaneMenu><Button id="clickable-new-instance" onClick={this.onClickAddNewInstance} title="+ Instance" buttonStyle="primary paneHeaderNewButton">+ New</Button></PaneMenu>; // /

    const resultsFormatter = {
      publishers: r => r.publication.map(p => `${p.publisher} ${p.dateOfPublication ? `(${p.dateOfPublication})` : ''}`).join(', '),
      'publication date': r => r.publication.map(p => p.dateOfPublication).join(', '),
      contributors: r => formatters.contributorsFormatter(r, contributorTypes),
    };
    const maybeTerm = this.state.searchTerm ? ` for "${this.state.searchTerm}"` : '';
    const maybeSpelling = this.state.searchTerm ? 'spelling and ' : '';
    return (
      <Paneset>
        <SRStatus ref={(ref) => { this.SRStatus = ref; }} />
        <Pane defaultWidth="16%" header={searchHeader}>
          <FilterGroups config={filterConfig} filters={this.state.filters} onChangeFilter={this.onChangeFilter} />
        </Pane>
        {/* Results Pane */}
        <Pane
          defaultWidth="fill"
          paneTitle={
            <div style={{ textAlign: 'center' }}>
              <strong>Instances</strong>
              <div>
                <em>{resources.instances && resources.instances.hasLoaded ? resources.instances.other.totalRecords : ''} Result{instances.length === 1 ? '' : 's'} Found</em>
              </div>
            </div>
          }
          lastMenu={newInstanceButton}
        >
          <MultiColumnList
            id="list-instances"
            contentData={instances}
            selectedRow={this.state.selectedInstance}
            rowMetadata={['title', 'id']}
            formatter={resultsFormatter}
            onRowClick={this.onSelectRow}
            onHeaderClick={this.onSort}
            onNeedMoreData={this.onNeedMore}
            visibleColumns={['title', 'contributors', 'publishers']}
            sortOrder={this.state.sortOrder.replace(/^-/, '').replace(/,.*/, '')}
            sortDirection={this.state.sortOrder.startsWith('-') ? 'descending' : 'ascending'}
            isEmptyMessage={`No results found${maybeTerm}. Please check your ${maybeSpelling}filters.`}
            loading={resources.instances ? resources.instances.isPending : false}
            autosize
            virtualize
            ariaLabel={'Instances search results'}
            containerRef={(ref) => { this.resultsList = ref; }}
          />
        </Pane>
        {/* Details Pane */}
        <Route
          path={`${match.path}/view/:instanceid/:holdingsrecordid?/:itemid?`}
          render={props => <this.cViewInstance stripes={stripes} referenceTables={referenceTables} paneWidth="44%" onCopy={this.copyInstance} onClose={this.collapseDetails} {...props} />}
        />
        <Layer isOpen={query.layer ? query.layer === 'create' : false} label="Add New Instance Dialog">
          <InstanceForm
            initialValues={(this.state.copiedInstance) ? this.state.copiedInstance : { source: 'manual' }}
            onSubmit={(record) => { this.createInstance(record); }}
            onCancel={this.closeNewInstance}
            okapi={okapi}
            copy={!!(this.state.copiedInstance)}
            referenceTables={referenceTables}
          />
        </Layer>
      </Paneset>
    );
  }
}


Instances.propTypes = {
  stripes: PropTypes.shape({
    connect: PropTypes.func.isRequired,
    locale: PropTypes.string.isRequired,
  }).isRequired,
  resources: PropTypes.shape({
    instances: PropTypes.shape({
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
    instanceCount: PropTypes.number,
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
    instances: PropTypes.shape({
      POST: PropTypes.func,
    }),
    instanceCount: PropTypes.shape({
      replace: PropTypes.func,
    }),
  }).isRequired,
  okapi: PropTypes.object,
};

export default Instances;
