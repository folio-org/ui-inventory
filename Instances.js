import React from 'react';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import _ from 'lodash';

import Pane from '@folio/stripes-components/lib/Pane';
import Paneset from '@folio/stripes-components/lib/Paneset';
import MultiColumnList from '@folio/stripes-components/lib/MultiColumnList';
import FilterPaneSearch from '@folio/stripes-components/lib/FilterPaneSearch';
import SRStatus from '@folio/stripes-components/lib/SRStatus';
import transitionToParams from '@folio/stripes-components/util/transitionToParams';
import makeQueryFunction from '@folio/stripes-components/util/makeQueryFunction';

import packageInfo from './package';

const INITIAL_RESULT_COUNT = 30;
const RESULT_COUNT_INCREMENT = 30;

class Instances extends React.Component {

  static propTypes = {
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
    mutator: PropTypes.shape({
      instanceCount: PropTypes.shape({
        replace: PropTypes.func,
      }),
    }).isRequired,
  };

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
            { 'Title': 'title' },
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
    this.onClearSearch = this.onClearSearch.bind(this);
    this.onSort = this.onSort.bind(this);
    this.onChangeSearch = this.onChangeSearch.bind(this);
    this.transitionToParams = transitionToParams.bind(this);
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

  onClearSearch() {
    const path = (_.get(packageInfo, ['stripes', 'home']) ||
                  _.get(packageInfo, ['stripes', 'route']));
    this.setState({
      searchTerm: '',
      sortOrder: 'title',
    });
    this.props.history.push(path);
  }

  onSort(e, meta) {
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

  onChangeSearch(e) {
    this.props.mutator.instanceCount.replace(INITIAL_RESULT_COUNT);
    const query = e.target.value;
    this.setState({ searchTerm: query });
    this.performSearch(query);
  }

  onNeedMore = () => {
    this.props.mutator.instanceCount.replace(this.props.resources.instanceCount + RESULT_COUNT_INCREMENT);
  }

  performSearch = _.debounce((query) => {
    this.transitionToParams({ query });
  }, 250);

  render() {
    const { resources } = this.props;
    const instances = (resources.instances || {}).records || [];
    const searchHeader = <FilterPaneSearch id="SearchField" onChange={this.onChangeSearch} onClear={this.onClearSearch} resultsList={this.resultsList} value={this.state.searchTerm} />;

    const maybeTerm = this.state.searchTerm ? ` for "${this.state.searchTerm}"` : '';
    const maybeSpelling = this.state.searchTerm ? 'spelling and ' : '';

    return (
      <Paneset>
        <SRStatus ref={(ref) => { this.SRStatus = ref; }} />
        <Pane defaultWidth="16%" header={searchHeader}>
        </Pane>
        {/* Results Pane */}
        <Pane
          defaultWidth="fill"
          paneTitle={
            <div style={{ textAlign: 'center' }}>
              <strong>Instances</strong>
              <div>
                <em>{this.props.resources.instances && this.props.resources.instances.hasLoaded ? this.props.resources.instances.other.totalRecords : ''} Result{instances.length === 1 ? '' : 's'} Found</em>
              </div>
            </div>
          }
        >
          <MultiColumnList
            contentData={instances}
            rowMetadata={['title', 'id']}
            onHeaderClick={this.onSort}
            onNeedMoreData={this.onNeedMore}
            visibleColumns={['title']}
            sortOrder={this.state.sortOrder.replace(/^-/, '').replace(/,.*/, '')}
            sortDirection={this.state.sortOrder.startsWith('-') ? 'descending' : 'ascending'}
            isEmptyMessage={`No results found${maybeTerm}. Please check your ${maybeSpelling}filters.`}
            loading={this.props.resources.instances ? this.props.resources.instances.isPending : false}
            autosize
            virtualize
            ariaLabel={'Instances search results'}
            containerRef={(ref) => { this.resultsList = ref; }}
          />
        </Pane>
      </Paneset>
    );
  }
}

export default Instances;
