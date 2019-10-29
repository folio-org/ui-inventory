import React from 'react';
import PropTypes from 'prop-types';

export default class ItemFilters extends React.Component {
  static propTypes = {
    activeFilters: PropTypes.objectOf(PropTypes.array),
    onChange: PropTypes.func.isRequired,
    onClear: PropTypes.func.isRequired,
    data: PropTypes.object,
  };

  render() {
    return (
      <React.Fragment>
        {/* TODO: add filters */}
      </React.Fragment>
    );
  }
}
