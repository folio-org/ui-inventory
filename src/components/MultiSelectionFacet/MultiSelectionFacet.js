import PropTypes from 'prop-types';

import {
  MultiSelection,
  Accordion,
  FilterAccordionHeader,
} from '@folio/stripes/components';

import { FacetOptionFormatter } from '../FacetOptionFormatter';

const propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  name: PropTypes.string.isRequired,
  displayClearButton: PropTypes.bool.isRequired,
  onClearFilter: PropTypes.func.isRequired,
  onFilterChange: PropTypes.func.isRequired,
  closedByDefault: PropTypes.bool,
  options: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    label: PropTypes.string,
    totalRecords: PropTypes.number.isRequired,
  })),
  selectedValues: PropTypes.arrayOf(PropTypes.string),
};

const MultiSelectionFacet = ({
  id,
  label,
  name,
  closedByDefault = true,
  options,
  selectedValues,
  onFilterChange,
  onClearFilter,
  displayClearButton,
  ...props
}) => {
  const onChange = newOptions => {
    onFilterChange({
      name,
      values: newOptions.map(option => option.value),
    });
  };

  const missingValuesInOptions = selectedValues
    .filter(selectedValue => !options.find(option => {
      return option.value
        ? option.value === selectedValue
        : option.id === selectedValue;
    }))
    .map(value => ({
      label: value,
      value,
      count: 0,
    }));

  // include options returned from backend
  // if some selected options are missing from response we're adding them here with 0 results
  const dataOptions = [...options.map(option => ({
    label: option.label || option.id,
    value: option.value || option.id,
    totalRecords: option.count,
  })), ...missingValuesInOptions];

  const itemToString = option => {
    return option?.label || '';
  };

  const selectedOptions = dataOptions.filter(option => selectedValues.includes(option.value));

  return (
    <Accordion
      label={label}
      id={id}
      closedByDefault={closedByDefault}
      header={FilterAccordionHeader}
      headerProps={{ label }}
      onClearFilter={() => onClearFilter(name)}
      displayClearButton={displayClearButton}
    >
      <MultiSelection
        id={`${id}-multiselect`}
        label={label}
        name={name}
        formatter={FacetOptionFormatter}
        valueFormatter={({ option }) => option.label}
        onChange={onChange}
        dataOptions={dataOptions}
        itemToString={itemToString}
        value={selectedOptions}
        {...props}
      />
    </Accordion>
  );
};

MultiSelectionFacet.defaultProps = {
  selectedValues: [],
  options: [],
  closedByDefault: false,
};

MultiSelectionFacet.propTypes = propTypes;

export default MultiSelectionFacet;
