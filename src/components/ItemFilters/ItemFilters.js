import { isEmpty } from 'lodash';
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

import { filterItemsBy } from '../../utils';

export default class ItemFilters extends React.Component {
  static propTypes = {
    activeFilters: PropTypes.objectOf(PropTypes.array),
    onChange: PropTypes.func.isRequired,
    onClear: PropTypes.func.isRequired,
    data: PropTypes.object,
  };

  static defaultProps = {
    activeFilters: {},
    data: {
      materialTypes: [],
      itemStatuses: [],
    },
  }

  render() {
    const {
      activeFilters: {
        materialType = [],
        itemStatus = [],
        discoverySuppress = [],
      },
      data: {
        materialTypes,
        itemStatuses
      },
      onChange,
      onClear,
    } = this.props;

    const materialTypesOptions = materialTypes.map(({ name, id }) => ({
      label: name,
      value: id,
    }));

    const itemStatusesOptions = itemStatuses.map(({ label, value }) => ({
      label: <FormattedMessage id={`${label}`} />,
      value,
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
          label={<FormattedMessage id="ui-inventory.item.status" />}
          id="itemFilterAccordion"
          name="itemFilterAccordion"
          header={FilterAccordionHeader}
          displayClearButton={!isEmpty(itemStatus)}
          onClearFilter={() => onClear('itemStatus')}
        >
          <CheckboxFilter
            data-test-filter-item-status
            name="itemStatus"
            dataOptions={itemStatusesOptions}
            selectedValues={itemStatus}
            onChange={onChange}
          />
        </Accordion>
        <Accordion
          label={<FormattedMessage id="ui-inventory.materialType" />}
          id="materialTypeAccordion"
          name="materialTypeAccordion"
          separator
          closedByDefault
          header={FilterAccordionHeader}
          displayClearButton={!isEmpty(materialType)}
          onClearFilter={() => onClear('materialType')}
        >
          <MultiSelectionFilter
            name="materialType"
            id="materialTypeFilter"
            dataOptions={materialTypesOptions}
            selectedValues={materialType}
            filter={filterItemsBy('label')}
            onChange={onChange}
          />
        </Accordion>
        <Accordion
          label={<FormattedMessage id="ui-inventory.discoverySuppress" />}
          id="itemDiscoverySuppressAccordion"
          name="discoverySuppress"
          closedByDefault
          header={FilterAccordionHeader}
          displayClearButton={discoverySuppress.length > 0}
          onClearFilter={() => onClear('discoverySuppress')}
        >
          <CheckboxFilter
            data-test-filter-item-discovery-suppress
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
