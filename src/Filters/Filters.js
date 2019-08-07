import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { get } from 'lodash';
import {
  Accordion,
  FilterAccordionHeader,
} from '@folio/stripes/components';
import {
  CheckboxFilter,
  MultiSelectionFilter,
} from '@folio/stripes/smart-components';

import { languages } from '../constants';

export default class Filters extends React.Component {
  static propTypes = {
    activeFilters: PropTypes.objectOf(PropTypes.array),
    onChange: PropTypes.func.isRequired,
    data: PropTypes.object,
  };

  static defaultProps = {
    activeFilters: {},
    data: {
      locations: [],
      resourceTypes: [],
    },
  }

  createOnClearFilterHandler = (filterName) => () => {
    this.props.onChange({
      name: filterName,
      values: [],
    });
  }

  onChangeHandler = (filter) => {
    this.props.onChange(filter);
  }

  isFilterNotEmpty(filterName) {
    return get(this.props.activeFilters, [filterName, 'length'], []) > 0;
  }

  render() {
    const {
      activeFilters,
      data: { resourceTypes, locations },

    } = this.props;

    const resourceTypeOptions = resourceTypes.map(({ name, id }) => ({
      label: name,
      value: id,
    }));
    const locationOptions = locations.map(({ name, id }) => ({
      label: name,
      value: id,
    }));
    const languageOptions = languages.map(({ code, name }) => ({
      label: name,
      value: code
    }));

    return (
      <React.Fragment>
        <Accordion
          label={<FormattedMessage id="ui-inventory.instances.language" />}
          id="language"
          name="language"
          separator={false}
          closedByDefault
          header={FilterAccordionHeader}
          displayClearButton={this.isFilterNotEmpty('language')}
          onClearFilter={this.createOnClearFilterHandler('language')}
        >
          <MultiSelectionFilter
            name="language"
            dataOptions={languageOptions}
            selectedValues={activeFilters.language}
            onChange={this.onChangeHandler}
          />
        </Accordion>
        <Accordion
          label={<FormattedMessage id="ui-inventory.instances.resourceType" />}
          id="resource"
          name="resource"
          header={FilterAccordionHeader}
          displayClearButton={this.isFilterNotEmpty('resource')}
          onClearFilter={this.createOnClearFilterHandler('resource')}
        >
          <CheckboxFilter
            name="resource"
            dataOptions={resourceTypeOptions}
            selectedValues={activeFilters.resource}
            onChange={this.onChangeHandler}
          />
        </Accordion>
        <Accordion
          label={<FormattedMessage id="ui-inventory.instances.location" />}
          id="location"
          name="location"
          header={FilterAccordionHeader}
          displayClearButton={this.isFilterNotEmpty('location')}
          onClearFilter={this.createOnClearFilterHandler('location')}
        >
          <CheckboxFilter
            name="location"
            dataOptions={locationOptions}
            selectedValues={activeFilters.location}
            onChange={this.onChangeHandler}
          />
        </Accordion>
      </React.Fragment>
    );
  }
}
