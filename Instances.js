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
import Layer from '@folio/stripes-components/lib/Layer';
import SRStatus from '@folio/stripes-components/lib/SRStatus';
import transitionToParams from '@folio/stripes-components/util/transitionToParams';
import makeQueryFunction from '@folio/stripes-components/util/makeQueryFunction';

import packageInfo from './package';

import utils from './utils';

import InstanceForm from './InstanceForm';
import ViewInstance from './ViewInstance';

const INITIAL_RESULT_COUNT = 30;
const RESULT_COUNT_INCREMENT = 30;
const emptyObj = {};
const emptyArr = [];

class Instances extends React.Component {

  static manifest = Object.freeze({
    instanceCount: { initialValue: INITIAL_RESULT_COUNT },
    instances: {
      type: 'okapi',
      records: 'instances',
      path: 'inventory/instances',
      recordsRequired: '%{instanceCount}',
      perRequest: RESULT_COUNT_INCREMENT,
      GET: {
        params: {
          query: makeQueryFunction(
            'cql.allRecords=1',
            'title="$QUERY*"',
            { Title: 'title' },
          ),
        },
        staticFallback: { params: {} },
      },
    },
  });

  constructor(props) {
    super(props);

    const query = props.location.search ? queryString.parse(props.location.search) : {};
    this.state = {
      searchTerm: query.query || '',
      sortOrder: query.sort || '',
    };
    this.transitionToParams = transitionToParams.bind(this);
    this.cViewInstance = this.props.stripes.connect(ViewInstance);
    this.resultsList = null;
    this.SRStatus = null;
  }

  componentWillReceiveProps(nextProps) {
    const resource = this.props.resources.instances;
    if (resource && resource.isPending && !nextProps.resources.instances.isPending) {
      const resultAmount = nextProps.resources.instances.other.totalRecords;
      if (this.SRSStatus) this.SRStatus.sendMessage(`Search returned ${resultAmount} result${resultAmount !== 1 ? 's' : ''}`);
    }
  }

  onClearSearch = () => {
    const path = (_.get(packageInfo, ['stripes', 'home']) ||
                  _.get(packageInfo, ['stripes', 'route']));
    this.setState({
      searchTerm: '',
      sortOrder: 'title',
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
    const instanceId = meta.id;
    this.setState({ selectedInstance: meta });
    this.props.history.push(`/instances/view/${instanceId}${this.props.location.search}`);
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

  onNeedMore = () => {
    this.props.mutator.instanceCount.replace(this.props.resources.instanceCount + RESULT_COUNT_INCREMENT);
  }

  closeNewInstance = (e) => {
    if (e) e.preventDefault();
    utils.removeQueryParam('layer', this.props.location, this.props.history);
  }

  createInstance = (instance) => {
    // POST item record
    this.props.mutator.instances.POST(instance).then(() => this.closeNewInstance());
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
    const query = location.search ? queryString.parse(location.search) : {};

    const searchHeader = <FilterPaneSearch id="input-instances-search" onChange={this.onChangeSearch} onClear={this.onClearSearch} resultsList={this.resultsList} value={this.state.searchTerm} />;
    const newInstanceButton = <PaneMenu><Button id="clickable-new-instance" onClick={this.onClickAddNewInstance} title="+ Instance" buttonStyle="primary paneHeaderNewButton">+ New</Button></PaneMenu>;
// /
    const resultsFormatter = {
      identifiers: r => utils.identifiersFormatter(r),
      creators: () => 'to come',
      publisher: () => 'to come',
      'publication date': () => utils.localizeDate('2017-09-08T12:42:21Z', this.props.stripes.locale),
    };
    const maybeTerm = this.state.searchTerm ? ` for "${this.state.searchTerm}"` : '';
    const maybeSpelling = this.state.searchTerm ? 'spelling and ' : '';
    return (
      <Paneset>
        <SRStatus ref={(ref) => { this.SRStatus = ref; }} />
        <Pane defaultWidth="16%" header={searchHeader} />
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
            visibleColumns={['title', 'creators', 'identifiers', 'publisher', 'publication date']}
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
          path={`${match.path}/view/:instanceid`}
          render={props => <this.cViewInstance stripes={stripes} paneWidth="44%" onClose={this.collapseDetails} {...props} />}
        />
        <Layer isOpen={query.layer ? query.layer === 'create' : false} label="Add New Instance Dialog">
          <InstanceForm
            initialValues={{}}
            onSubmit={(record) => { this.createInstance(record); }}
            onCancel={this.closeNewInstance}
            okapi={okapi}
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
