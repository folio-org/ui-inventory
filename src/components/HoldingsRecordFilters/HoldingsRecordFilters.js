import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Accordion,
  FilterAccordionHeader,
} from '@folio/stripes/components';
import {
  CheckboxFilter,
  MultiSelectionFilter,
} from '@folio/stripes/smart-components';
import {
  filterItemsBy,
} from '../../utils';

export default class HoldingsRecordFilters extends React.Component {
  static propTypes = {
    activeFilters: PropTypes.objectOf(PropTypes.array),
    onChange: PropTypes.func.isRequired,
    onClear: PropTypes.func.isRequired,
    data: PropTypes.object,
  };

  static defaultProps = {
    activeFilters: {},
    data: {
      locations: [],
    },
  }

  render() {
    const {
      activeFilters: {
        discoverySuppress = [],
        effectiveLocation = [],
        holdingsPermanentLocation = [],
      },
      data: {
        locations,
      },
      onChange,
      onClear,
    } = this.props;

    const locationOptions = locations.map(({ name, id }) => ({
      label: name,
      value: id,
    }));

    const suppressedOptions = [
      {
        label: <FormattedMessage id="ui-inventory.yes" />,
        value: 'true',
      },
      {
        label: <FormattedMessage id="ui-inventory.no" />,
        value: 'false',
      },
    ];

    return (
      <React.Fragment>
        <Accordion
          label={<FormattedMessage id="ui-inventory.filters.effectiveLocation" />}
          id="holdingsEffectiveLocationAccordion"
          name="effectiveLocation"
          separator={false}
          header={FilterAccordionHeader}
          displayClearButton={effectiveLocation.length > 0}
          onClearFilter={() => onClear('effectiveLocation')}
        >
          <MultiSelectionFilter
            name="effectiveLocation"
            dataOptions={locationOptions}
            selectedValues={effectiveLocation}
            filter={filterItemsBy('label')}
            onChange={onChange}
          />
        </Accordion>
        <Accordion
          label={<FormattedMessage id="ui-inventory.holdings.permanentLocation" />}
          id="holdingsPermanentLocationAccordion"
          name="holdingsPermanentLocation"
          closedByDefault
          header={FilterAccordionHeader}
          displayClearButton={holdingsPermanentLocation.length > 0}
          onClearFilter={() => onClear('holdingsPermanentLocation')}
        >
          <MultiSelectionFilter
            name="holdingsPermanentLocation"
            dataOptions={locationOptions}
            selectedValues={holdingsPermanentLocation}
            filter={filterItemsBy('label')}
            onChange={onChange}
          />
        </Accordion>
        <Accordion
          data-test-filter-holding-discovery-suppress
          label={<FormattedMessage id="ui-inventory.discoverySuppress" />}
          id="holdingDiscoverySuppress"
          name="discoverySuppress"
          closedByDefault
          header={FilterAccordionHeader}
          displayClearButton={discoverySuppress.length > 0}
          onClearFilter={() => onClear('discoverySuppress')}
        >
          <CheckboxFilter
            data-test-filter-holdings-discovery-suppress
            name="discoverySuppress"
            dataOptions={suppressedOptions}
            selectedValues={discoverySuppress}
            onChange={onChange}
          />
        </Accordion>
      </React.Fragment>
    );
  }
}
