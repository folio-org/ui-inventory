import React from 'react';
import PropTypes from 'prop-types';

import { MultiSelection } from '@folio/stripes/components';

export default class MultiSelectionFilter extends React.Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    availableValues: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.any,
    })).isRequired,
    selectedValues: PropTypes.arrayOf(PropTypes.string).isRequired,
    onChange: PropTypes.func.isRequired,
  };

  onChangeHandler = (selectedOptions) => {
    const {
      name,
      onChange,
    } = this.props;

    onChange({
      name,
      values: selectedOptions.map((option) => option.value),
    });
  };

  getSelectedValues() {
    const {
      selectedValues,
      availableValues,
    } = this.props;

    return selectedValues
      .map((curValue) => availableValues.find((curAvailableValue) => curAvailableValue.value === curValue));
  }

  render() {
    const {
      name,
      availableValues,
    } = this.props;

    return (
      <MultiSelection
        name={name}
        label="Language"
        id={name}
        placeholder="Select language"
        value={this.getSelectedValues()}
        dataOptions={availableValues}
        onChange={this.onChangeHandler}
      />
    );
  }
}
