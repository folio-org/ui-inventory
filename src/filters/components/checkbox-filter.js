import React from 'react';
import PropTypes from 'prop-types';

import { Checkbox } from '@folio/stripes/components';

export class CheckboxFilter extends React.Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    availableValues: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.any,
    })).isRequired,
    selectedValues: PropTypes.arrayOf(PropTypes.string).isRequired,
    onChange: PropTypes.func.isRequired,
  };

  createOnChangeHandler = (filterValue) => (e) => {
    const {
      name,
      selectedValues,
      onChange,
    } = this.props;

    const newValues = e.target.checked
      ? [...selectedValues, filterValue]
      : selectedValues.filter((value) => value !== filterValue);

    onChange({
      name,
      values: newValues,
    });
  };

  render() {
    const {
      availableValues,
      selectedValues,
    } = this.props;

    return availableValues.map((availableValue) => {
      const {
        label,
        value,
      } = availableValue;

      return (
        <Checkbox
          label={label}
          name={value}
          checked={selectedValues.includes(value)}
          onChange={this.createOnChangeHandler(value)}
        />
      );
    });
  }
}
