import { isEmpty } from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import {
  Accordion,
  FilterAccordionHeader,
} from '@folio/stripes/components';
import {
  CheckboxFilter,
  MultiSelectionFilter,
} from '@folio/stripes/smart-components';

import { filterItemsBy } from '../../utils';
import TagsFilter from '../TagsFilter';

class ItemFilters extends React.Component {
  static propTypes = {
    activeFilters: PropTypes.objectOf(PropTypes.array),
    onChange: PropTypes.func.isRequired,
    onClear: PropTypes.func.isRequired,
    data: PropTypes.object,
    intl: PropTypes.object,
  };

  static defaultProps = {
    activeFilters: {},
    data: {
      materialTypes: [],
      itemStatuses: [],
      locations: [],
    },
  }

  render() {
    const {
      activeFilters: {
        materialType = [],
        itemStatus = [],
        effectiveLocation = [],
        holdingsPermanentLocation = [],
        discoverySuppress = [],
        tags,
      },
      data: {
        materialTypes,
        itemStatuses,
        locations,
        tagsRecords,
      },
      intl,
      onChange,
      onClear,
    } = this.props;

    const materialTypesOptions = materialTypes.map(({ name, id }) => ({
      label: name,
      value: id,
    }));

    const itemStatusesOptions = itemStatuses.map(({ label, value }) => ({
      label: intl.formatMessage({ id: label }),
      value,
    })).sort((a, b) => a.label.localeCompare(b.label));

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
      <>
        <Accordion
          label={<FormattedMessage id="ui-inventory.item.status" />}
          id="itemFilterAccordion"
          name="itemFilterAccordion"
          header={FilterAccordionHeader}
          displayClearButton={!isEmpty(itemStatus)}
          onClearFilter={() => onClear('itemStatus')}
        >
          <MultiSelectionFilter
            data-test-filter-item-status
            name="itemStatus"
            dataOptions={itemStatusesOptions}
            selectedValues={itemStatus}
            onChange={onChange}
          />
        </Accordion>
        <Accordion
          label={<FormattedMessage id="ui-inventory.filters.effectiveLocation" />}
          id="itemEffectiveLocationAccordion"
          name="effectiveLocation"
          separator
          header={FilterAccordionHeader}
          displayClearButton={effectiveLocation.length > 0}
          onClearFilter={() => onClear('effectiveLocation')}
        >
          <MultiSelectionFilter
            name="effectiveLocation"
            dataOptions={locationOptions}
            selectedValues={effectiveLocation}
            onChange={onChange}
          />
        </Accordion>
        <Accordion
          label={<FormattedMessage id="ui-inventory.holdings.permanentLocation" />}
          id="holdingsPermanentLocationAccordion"
          name="holdingsPermanentLocationAccordion"
          closedByDefault
          header={FilterAccordionHeader}
          displayClearButton={holdingsPermanentLocation.length > 0}
          onClearFilter={() => onClear('holdingsPermanentLocation')}
        >
          <MultiSelectionFilter
            name="holdingsPermanentLocation"
            dataOptions={locationOptions}
            selectedValues={holdingsPermanentLocation}
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
        <TagsFilter
          onChange={onChange}
          onClear={onClear}
          selectedValues={tags}
          tagsRecords={tagsRecords}
        />
      </>
    );
  }
}

export default injectIntl(ItemFilters);
