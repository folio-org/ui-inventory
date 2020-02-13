import React from 'react';
import PropTypes from 'prop-types';
import {
  map,
  concat,
  set,
  omit,
  flowRight,
} from 'lodash';

import { stripesConnect } from '@folio/stripes/core';

import withData from './withData';
import withLocation from '../withLocation';
import { InstancesView } from '../views';
import {
  getFilterConfig,
} from '../filterConfig';

import buildManifestObject from './buildManifestObject';
import { psTitleRelationshipId } from '../utils';

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

  createInstance = (instance) => {
    // Massage record to add preceeding and succeeding title fields in the
    // right place.
    const instanceCopy = this.combineRelTitles(instance);

    // POST item record
    return this.props.mutator.records.POST(instanceCopy);
  };

  combineRelTitles = (instance) => {
    // preceding/succeeding titles are stored in parentInstances and childInstances
    // in the instance record. Each title needs to provide an instance relationship
    // type ID corresponding to 'preceeding-succeeding' in addition to the actual
    // parent/child instance ID.
    let instanceCopy = instance;
    const titleRelationshipTypeId = psTitleRelationshipId(this.props.resources.instanceRelationshipTypes.records);
    const precedingTitles = map(instanceCopy.precedingTitles, p => { p.instanceRelationshipTypeId = titleRelationshipTypeId; return p; });
    set(instanceCopy, 'parentInstances', concat(instanceCopy.parentInstances, precedingTitles));
    const succeedingTitles = map(instanceCopy.succeedingTitles, p => { p.instanceRelationshipTypeId = titleRelationshipTypeId; return p; });
    set(instanceCopy, 'childInstances', succeedingTitles);
    instanceCopy = omit(instanceCopy, ['precedingTitles', 'succeedingTitles']);

    return instanceCopy;
  }

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
      <InstancesView
        parentResources={resources}
        parentMutator={mutator}
        data={data}
        browseOnly={browseOnly}
        showSingleResult={showSingleResult}
        onCreate={this.createInstance}
        onSelectRow={onSelectRow}
        disableRecordCreation={disableRecordCreation}
        renderFilters={renderer(data)}
        segment={segment}
        searchableIndexes={indexes}
      />
    );
  }
}

export default flowRight(
  stripesConnect,
  withLocation,
  withData,
)(InstancesRoute);
