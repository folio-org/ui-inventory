import React from 'react';
import PropTypes from 'prop-types';

import {
  Accordion,
  FilterAccordionHeader,
} from '@folio/stripes/components';

const languages = [
  { value: 'English', label: 'English' },
  { value: 'French', label: 'French' },
  { value: 'German', label: 'German' },
  { value: 'Spanish', label: 'Spanish' },
  { value: 'Mandarin', label: 'Mandarin' },
  { value: 'Russian', label: 'Russian' },
  { value: 'Arabic', label: 'Arabic' },
];

import MultiSelectionFilter from './components/multi-selection-filter';

const locations = ['Annex', 'Main Library'];
const isPerpetualValues = ['yes', 'no'];
const vendors = ['vendor1', 'vendor2', 'vendor3'];
const contentProviders = ['content provider1', 'content provider2', 'content provider3'];
const subscriptionAgents = ['subscription agent1', 'subscription agent2', 'subscription agent3'];

export default class Filters extends React.Component {
  static propTypes = {
    activeFilters: PropTypes.objectOf(PropTypes.array),
    onChange: PropTypes.func.isRequired,
  };

  static defaultProps = {
    activeFilters: {
      language: [],
    }
  }

  onChangeHandler = (filter) => {
    this.props.onChange(filter);
  }

  createOnClearFilterHandler = (filterName) => () => {
    this.props.onChange({
      name: filterName,
      values: [],
    });
  }

  render() {
    const {
      activeFilters,
    } = this.props;

    return (
      <div>
        <Accordion
          label="language"
          id="language"
          name="language"
          separator={false}
          header={FilterAccordionHeader}
          closedByDefault
          displayClearButton={activeFilters.language.length > 0}
          onClearFilter={this.createOnClearFilterHandler('language')}
        >
          <MultiSelectionFilter
            id="language"
            name="language"
            availableValues={languages}
            selectedValues={activeFilters.language}
            onChange={this.onChangeHandler}
          />
        </Accordion>
      </div>
    );
  }
}
