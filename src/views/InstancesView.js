import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import {
  InstanceFilters,
  InstancesList,
} from '../components';
import { getCurrentFilters } from '../utils';
import { instanceIndexes } from '../constants';

class InstancesView extends React.Component {
  static propTypes = {
    data: PropTypes.object,
  };

  renderFilters = (onChange) => {
    const {
      data: {
        locations,
        instanceTypes,
        query,
      },
    } = this.props;

    const activeFilters = getCurrentFilters(get(query, 'filters', ''));

    return (
      <InstanceFilters
        activeFilters={activeFilters}
        data={{
          locations,
          resourceTypes: instanceTypes,
        }}
        onChange={onChange}
        onClear={(name) => onChange({ name, values: [] })}
      />
    );
  };

  render() {
    return (
      <div data-test-inventory-instances>
        <InstancesList
          {...this.props}
          renderFilters={this.renderFilters}
          segment="instances"
          searchableIndexes={instanceIndexes}
        />
      </div>
    );
  }
}

export default InstancesView;
