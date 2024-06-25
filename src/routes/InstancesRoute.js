import React from 'react';
import PropTypes from 'prop-types';
import { flowRight } from 'lodash';

import { stripesConnect } from '@folio/stripes/core';
import {
  filterConfig,
  renderFilters,
  segments,
} from '@folio/stripes-inventory-components';

import withLocation from '../withLocation';
import withLastSearchTerms from '../withLastSearchTerms';
import { InstancesView } from '../views';
import { buildManifestObject } from './buildManifestObject';
import { DataContext } from '../contexts';

class InstancesRoute extends React.Component {
  static propTypes = {
    resources: PropTypes.object.isRequired,
    mutator: PropTypes.object.isRequired,
    disableRecordCreation: PropTypes.bool,
    onSelectRow: PropTypes.func,
    getParams: PropTypes.func,
    getLastBrowse: PropTypes.func.isRequired,
    getLastSearchOffset: PropTypes.func.isRequired,
    storeLastSearch: PropTypes.func.isRequired,
    storeLastSearchOffset: PropTypes.func.isRequired,
    storeLastSegment: PropTypes.func.isRequired,
  };

  static defaultProps = {
    disableRecordCreation: false,
  };

  static manifest = Object.freeze(buildManifestObject());

  handleFilterChange = (onChange) => ({ name, values }) => {
    onChange({ name, values });
  };

  render() {
    const {
      onSelectRow,
      disableRecordCreation,
      resources,
      mutator,
      getParams,
      getLastBrowse,
      getLastSearchOffset,
      storeLastSearch,
      storeLastSearchOffset,
      storeLastSegment,
    } = this.props;
    const { segment = segments.instances } = getParams(this.props);
    const { indexes } = filterConfig[segment];
    const { query, records } = resources;
    const parentResources = { ...resources, records };

    return (
      <DataContext.Consumer>
        {data => (
          <InstancesView
            parentResources={parentResources}
            parentMutator={mutator}
            data={{ ...data, query }}
            onSelectRow={onSelectRow}
            disableRecordCreation={disableRecordCreation}
            renderFilters={renderFilters({
              data,
              query,
              onFilterChange: this.handleFilterChange,
            })}
            segment={segment}
            searchableIndexes={indexes}
            getLastBrowse={getLastBrowse}
            getLastSearchOffset={getLastSearchOffset}
            storeLastSearch={storeLastSearch}
            storeLastSearchOffset={storeLastSearchOffset}
            storeLastSegment={storeLastSegment}
          />
        )}
      </DataContext.Consumer>
    );
  }
}

export default flowRight(
  stripesConnect,
  withLocation,
  withLastSearchTerms,
)(InstancesRoute);
