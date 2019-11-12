import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import {
  ItemFilters,
  InstancesList,
} from '../components';
import { getCurrentFilters } from '../utils';
import {
  itemIndexes,
  itemStatuses,
} from '../constants';

class ItemsView extends React.Component {
  static propTypes = {
    data: PropTypes.object,
  };

  renderFilters = (onChange) => {
    const {
      data: {
        query,
        materialTypes,
      },
    } = this.props;

    const activeFilters = getCurrentFilters(get(query, 'filters', ''));

    return (
      <ItemFilters
        activeFilters={activeFilters}
        data={{
          materialTypes,
          itemStatuses,
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
          segment="items"
          searchableIndexes={itemIndexes}
        />
      </div>
    );
  }
}

export default ItemsView;
