import React from 'react';
import PropTypes from 'prop-types';

import CheckboxFacetList from './CheckboxFacetList';

import { accentFold } from '../../utils';
import { DEFAULT_FILTERS_NUMBER } from '../../constants';

const SHOW_OPTIONS_COUNT = 5;
const SHOW_OPTIONS_INCREMENT = 5;

export default class CheckboxFacet extends React.Component {
  static propTypes = {
    dataOptions: PropTypes.arrayOf(PropTypes.shape({
      disabled: PropTypes.bool,
      label: PropTypes.node,
      readOnly: PropTypes.bool,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      count: PropTypes.number,
    })).isRequired,
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    onFetch: PropTypes.func,
    onSearch: PropTypes.func,
    selectedValues: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
    isFilterable: PropTypes.bool,
    isPending: PropTypes.bool,
  };

  static defaultProps = {
    selectedValues: [],
    isFilterable: false,
  }

  state = {
    more: SHOW_OPTIONS_COUNT,
    searchTerm: '',
    isMoreClicked: false,
  };

  componentDidUpdate(prevProps) {
    if (
      this.state.isMoreClicked &&
      prevProps.dataOptions.length === DEFAULT_FILTERS_NUMBER &&
      this.props.dataOptions.length > DEFAULT_FILTERS_NUMBER
    ) {
      this.updateMore();
    }
  }

  onMoreClick = (totalOptions) => {
    const {
      onFetch,
      name,
    } = this.props;

    this.setState(({ more }) => {
      let visibleOptionsCount = more + SHOW_OPTIONS_INCREMENT;
      const showingAll = visibleOptionsCount >= totalOptions;
      if (showingAll) visibleOptionsCount = totalOptions;

      return { more: visibleOptionsCount };
    });

    this.setState({ isMoreClicked: true });
    onFetch({ onMoreClickedFacet: name });
  };

  onFacetSearch = searchTerm => {
    const {
      onSearch,
      name,
    } = this.props;

    this.setState({ searchTerm });
    onSearch({ name, value: searchTerm });
  };

  onFasetChange = (filterValue) => (e) => {
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

  updateMore = () => {
    this.setState(({ more }) => {
      return { more: more + SHOW_OPTIONS_INCREMENT };
    });
  }

  render() {
    const {
      dataOptions,
      selectedValues,
      isFilterable,
      isPending,
      name,
      onFetch,
    } = this.props;

    const {
      more,
      searchTerm,
    } = this.state;

    let filteredOptions = dataOptions;

    if (searchTerm.trim()) {
      filteredOptions = filteredOptions.filter(option => {
        return accentFold(option.label)
          .toLowerCase()
          .includes(accentFold(searchTerm).toLowerCase());
      });
    }

    return (
      <CheckboxFacetList
        fieldName={name}
        dataOptions={filteredOptions.slice(0, more)}
        selectedValues={selectedValues}
        showMore={filteredOptions.length > more}
        showSearch={isFilterable}
        onMoreClick={() => this.onMoreClick(filteredOptions.length - 1)}
        onSearch={this.onFacetSearch}
        onChange={this.onFasetChange}
        onFetch={onFetch}
        isPending={isPending}
      />
    );
  }
}
