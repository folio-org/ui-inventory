import React from 'react';
import PropTypes from 'prop-types';
import { flowRight } from 'lodash';

import { stripesConnect } from '@folio/stripes/core';

import withLocation from '../withLocation';
import withFacets from '../withFacets';
import { InstancesView } from '../views';
import {
  getFilterConfig,
} from '../filterConfig';
import { buildManifestObject } from './buildManifestObject';
import { DataContext } from '../contexts';

class InstancesRoute extends React.Component {
  static propTypes = {
    resources: PropTypes.object.isRequired,
    mutator: PropTypes.object.isRequired,
    showSingleResult: PropTypes.bool,
    browseOnly: PropTypes.bool,
    disableRecordCreation: PropTypes.bool,
    onSelectRow: PropTypes.func,
    getParams: PropTypes.func,
    fetchFacets: PropTypes.func,
  };

  static defaultProps = {
    showSingleResult: false,
    browseOnly: false,
    disableRecordCreation: false,
  };

  static manifest = Object.freeze(buildManifestObject());

  // componentDidMount() {
  //   const params = new URLSearchParams(document.location.search);
  //   const qindex = params.get('qindex');

  //   if (qindex === 'callNumbers') {
  //     this.setState({ callNumber: true });
  //   }
  // }

  render() {
    const {
      showSingleResult,
      browseOnly,
      onSelectRow,
      disableRecordCreation,
      resources,
      mutator,
      getParams,
      fetchFacets,
    } = this.props;
    const { segment } = getParams(this.props);
    const { indexes, renderer } = getFilterConfig(segment);
    const { query } = resources;


    // const onChangeIndex = (e) => {
    //   if (e.target.value === 'callNumbers') { this.setState({ callNumber: true }); } else this.setState({ callNumber: false });
    // };

    const params = new URLSearchParams(document.location.search);
    const qindex = params.get('qindex');

    const resourceBrowse = qindex === 'callNumbers' ? {
      ...resources,
      records: resources.recordsBrowseCallNumber,
      recordsBrowseCallNumber: {},
    } : resources;

    return (
      <DataContext.Consumer>
        {data => (
          <InstancesView
            parentResources={resourceBrowse}
            parentMutator={mutator}
            data={{ ...data, query }}
            browseOnly={browseOnly}
            showSingleResult={showSingleResult}
            onSelectRow={onSelectRow}
            disableRecordCreation={disableRecordCreation}
            renderFilters={renderer({
              ...data,
              query,
              onFetchFacets: fetchFacets(data),
              parentResources: resources,
            })}
            segment={segment}
            searchableIndexes={indexes}
          />
        )}
      </DataContext.Consumer>
    );
  }
}

export default flowRight(
  stripesConnect,
  withLocation,
  withFacets,
)(InstancesRoute);
