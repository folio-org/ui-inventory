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
  }

  render() {
    const {
      activeFilters: {
        discoverySuppress = [],
        staffSuppress = [],
      },
      onChange,
      onClear,
    } = this.props;

    const suppressedOptions = [
      {
        label: <FormattedMessage id="ui-inventory.yes" />,
        value: 'true',
      },
    ];

    return (
      <React.Fragment>
        <Accordion
          label={<FormattedMessage id="ui-inventory.staffSuppress" />}
          id="staffSuppress"
          name="staffSuppress"
          closedByDefault
          header={FilterAccordionHeader}
          displayClearButton={staffSuppress.length > 0}
          onClearFilter={() => onClear('staffSuppress')}
        >
          <CheckboxFilter
            data-test-filter-holding-staff-suppress
            name="staffSuppress"
            dataOptions={suppressedOptions}
            selectedValues={staffSuppress}
            onChange={onChange}
          />
        </Accordion>
        <Accordion
          label={<FormattedMessage id="ui-inventory.discoverySuppress" />}
          id="discoverySuppress"
          name="discoverySuppress"
          closedByDefault
          header={FilterAccordionHeader}
          displayClearButton={discoverySuppress.length > 0}
          onClearFilter={() => onClear('discoverySuppress')}
        >
          <CheckboxFilter
            data-test-filter-holding-discovery-suppress
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
