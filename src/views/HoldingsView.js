import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import {
  HoldingFilters,
  InstancesList,
} from '../components';
import { getCurrentFilters } from '../utils';
import { holdingIndexes } from '../constants';

class HoldingsView extends React.Component {
  static propTypes = {
    data: PropTypes.object,
  };

  renderFilters = (onChange) => {
    const {
      data: {
        query,
        locations,
      },
    } = this.props;

    const activeFilters = getCurrentFilters(get(query, 'filters', ''));

    return (
      <HoldingFilters
        activeFilters={activeFilters}
        data={{
          locations,
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
          segment="holdings"
          searchableIndexes={holdingIndexes}
        />
      </div>
    );
  }
}

export default HoldingsView;
