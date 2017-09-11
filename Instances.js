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
const emptyObj = {};
const emptyArr = [];

class Instances extends React.Component {

  static propTypes = {
    stripes: PropTypes.shape({
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

  onChangeSearch = (e) => {
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

  dateLocalized = dateString => (dateString ? new Date(Date.parse(dateString)).toLocaleDateString(this.props.stripes.locale) : '');

  identifiersFormatter = (r) => {
    let formatted = '';
    if (r.identifiers && r.identifiers.length) {
      for (let i = 0; i < r.identifiers.length; i += 1) {
        const id = r.identifiers[i];
        formatted += (i > 0 ? ', ' : '') +
                     id.value +
                     (id.namespace && id.namespace.length ? ` (${id.namespace})` : '');
      }
    }
    return formatted;
  };

  render() {
    const { resources } = this.props;
    const instances = (resources.instances || emptyObj).records || emptyArr;
    const searchHeader = <FilterPaneSearch id="input-instances-search" onChange={this.onChangeSearch} onClear={this.onClearSearch} resultsList={this.resultsList} value={this.state.searchTerm} />;

    const resultsFormatter = {
      identifiers: r => this.identifiersFormatter(r),
      author: () => 'to come',
      creators: () => 'to come',
      publisher: () => 'to come',
      'publication date': () => this.dateLocalized('2017-09-08T12:42:21Z'),
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
        >
          <MultiColumnList
            id="list-instances"
            contentData={instances}
            rowMetadata={['title', 'id']}
            formatter={resultsFormatter}
            onHeaderClick={this.onSort}
            onNeedMoreData={this.onNeedMore}
            visibleColumns={['title', 'author', 'identifiers', 'creators', 'publisher', 'publication date']}
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
      </Paneset>
    );
  }
}

export default Instances;
