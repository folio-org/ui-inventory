import React from 'react';
import PropTypes from 'prop-types';
import { flowRight } from 'lodash';

import { stripesConnect } from '@folio/stripes/core';
import {
  filterConfig,
  renderFilters,
  segments,
  withSearchErrors,
  ResetProvider,
} from '@folio/stripes-inventory-components';

import {
  withLocation,
  withLastSearchTerms,
} from '../hocs';
import { InstancesView } from '../views';
import { buildManifestObject } from './buildManifestObject';
import { DataContext } from '../contexts';

class InstancesRoute extends React.Component {
  static propTypes = {
    // tenantId is used in buildManifestObject()
    tenantId: PropTypes.string.isRequired, // eslint-disable-line react/no-unused-prop-types
    resources: PropTypes.object.isRequired,
    mutator: PropTypes.object.isRequired,
    disableRecordCreation: PropTypes.bool,
    onSelectRow: PropTypes.func,
    getParams: PropTypes.func,
    getLastBrowse: PropTypes.func.isRequired,
    getLastSearch: PropTypes.func.isRequired,
    getLastSearchOffset: PropTypes.func.isRequired,
    isRequestUrlExceededLimit: PropTypes.bool.isRequired,
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
      getLastSearch,
      getLastBrowse,
      getLastSearchOffset,
      storeLastSearch,
      storeLastSearchOffset,
      storeLastSegment,
      isRequestUrlExceededLimit,
    } = this.props;
    const { segment = segments.instances } = getParams(this.props);
    const { indexes } = filterConfig[segment];
    const { query, records } = resources;
    const parentResources = { ...resources, records };

    return (
      <DataContext.Consumer>
        {data => (
          <ResetProvider>
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
              getLastSearch={getLastSearch}
              getLastBrowse={getLastBrowse}
              getLastSearchOffset={getLastSearchOffset}
              storeLastSearch={storeLastSearch}
              storeLastSearchOffset={storeLastSearchOffset}
              storeLastSegment={storeLastSegment}
              isRequestUrlExceededLimit={isRequestUrlExceededLimit}
            />
          </ResetProvider>
        )}
      </DataContext.Consumer>
    );
  }
}

export default flowRight(
  stripesConnect,
  withLocation,
  withLastSearchTerms,
  withSearchErrors,
)(InstancesRoute);
