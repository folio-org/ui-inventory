import React from 'react';
import PropTypes from 'prop-types';
import { flowRight } from 'lodash';

import { stripesConnect } from '@folio/stripes/core';

import withData from './withData';
import withLocation from '../withLocation';
import { InstancesView } from '../views';
import {
  getFilterConfig,
} from '../filterConfig';
import { buildManifestObject } from './buildManifestObject';
import DataContext from '../contexts/DataContext';

class InstancesRoute extends React.Component {
  static propTypes = {
    resources: PropTypes.object.isRequired,
    mutator: PropTypes.object.isRequired,
    showSingleResult: PropTypes.bool,
    browseOnly: PropTypes.bool,
    disableRecordCreation: PropTypes.bool,
    onSelectRow: PropTypes.func,
    isLoading: PropTypes.func,
    getData: PropTypes.func,
    getParams: PropTypes.func,
  };

  static defaultProps = {
    showSingleResult: false,
    browseOnly: false,
    disableRecordCreation: false,
  };

  static manifest = Object.freeze(buildManifestObject());

  render() {
    const {
      showSingleResult,
      browseOnly,
      onSelectRow,
      disableRecordCreation,
      resources,
      mutator,
      isLoading,
      getData,
      getParams,
    } = this.props;

    if (isLoading()) {
      return null;
    }

    const data = getData();
    const { segment } = getParams(this.props);
    const { indexes, renderer } = getFilterConfig(segment);

    return (
      <DataContext.Provider value={data}>
        <InstancesView
          parentResources={resources}
          parentMutator={mutator}
          data={data}
          browseOnly={browseOnly}
          showSingleResult={showSingleResult}
          onSelectRow={onSelectRow}
          disableRecordCreation={disableRecordCreation}
          renderFilters={renderer(data)}
          segment={segment}
          searchableIndexes={indexes}
        />
      </DataContext.Provider>
    );
  }
}

export default flowRight(
  stripesConnect,
  withLocation,
  withData,
)(InstancesRoute);
