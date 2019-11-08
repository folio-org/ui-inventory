import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Accordion,
  FilterAccordionHeader,
} from '@folio/stripes/components';
import { CheckboxFilter } from '@folio/stripes/smart-components';

export default class HoldingFilters extends React.Component {
  static propTypes = {
    activeFilters: PropTypes.objectOf(PropTypes.array),
    onChange: PropTypes.func.isRequired,
    onClear: PropTypes.func.isRequired,
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
    ];

    return (
      <React.Fragment>
        <Accordion
          label={<FormattedMessage id="ui-inventory.holdings.permanentLocation" />}
          id="holdingsPermanentLocation"
          name="holdingsPermanentLocation"
          closedByDefault
          header={FilterAccordionHeader}
          displayClearButton={holdingsPermanentLocation.length > 0}
          onClearFilter={() => onClear('holdingsPermanentLocation')}
        >
          <CheckboxFilter
            data-test-filter-instance-location
            name="holdingsPermanentLocation"
            dataOptions={locationOptions}
            selectedValues={holdingsPermanentLocation}
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
