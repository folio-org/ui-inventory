import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import {
  Accordion,
  AccordionSet,
  FilterAccordionHeader,
} from '@folio/stripes/components';

import TagsFilter from '../TagsFilter';
import CheckboxFacet from '../CheckboxFacet';
import { useFacets } from '../../common/hooks';
import {
  getSuppressedOptions,
  processFacetOptions,
  processItemsStatuses
} from '../../facetUtils';
import {
  FACETS,
  FACETS_OPTIONS,
  FACETS_SETTINGS,
  FACETS_CQL,
} from '../../constants';

const ItemFilters = (props) => {
  const {
    activeFilters,
    data: {
      itemStatuses,
      locations,
      materialTypes,
      tagsRecords,
    },
    onChange,
    onClear,
  } = props;

  const intl = useIntl();

  const segmentAccordions = {
    [FACETS.ITEM_STATUS]: false,
    [FACETS.EFFECTIVE_LOCATION]: false,
    [FACETS.HOLDINGS_PERMANENT_LOCATION]: false,
    [FACETS.MATERIAL_TYPE]: false,
    [FACETS.ITEMS_DISCOVERY_SUPPRESS]: false,
    [FACETS.ITEMS_TAGS]: false,
  };

  const segmentOptions = {
    [FACETS_OPTIONS.ITEMS_STATUSES_OPTIONS]: [],
    [FACETS_OPTIONS.EFFECTIVE_LOCATION_OPTIONS]: [],
    [FACETS_OPTIONS.HOLDINGS_PERMANENT_LOCATION_OPTIONS]: [],
    [FACETS_OPTIONS.MATERIAL_TYPES_OPTIONS]: [],
    [FACETS_OPTIONS.ITEMS_DISCOVERY_SUPPRESS_OPTIONS]: [],
    [FACETS_OPTIONS.ITEMS_TAGS_OPTIONS]: [],
  };

  const selectedFacetFilters = {
    [FACETS.ITEM_STATUS]: activeFilters[FACETS.ITEM_STATUS],
    [FACETS.EFFECTIVE_LOCATION]: activeFilters[FACETS.EFFECTIVE_LOCATION],
    [FACETS.HOLDINGS_PERMANENT_LOCATION]: activeFilters[FACETS.HOLDINGS_PERMANENT_LOCATION],
    [FACETS.MATERIAL_TYPE]: activeFilters[FACETS.MATERIAL_TYPE],
    [FACETS.ITEMS_DISCOVERY_SUPPRESS]: activeFilters[FACETS.ITEMS_DISCOVERY_SUPPRESS],
    [FACETS.ITEMS_TAGS]: activeFilters[FACETS.ITEMS_TAGS],
  };

  const getNewRecords = (records) => {
    return _.reduce(FACETS_SETTINGS, (accum, name, recordName) => {
      if (records[recordName]) {
        const recordValues = records[recordName].values;
        const commonProps = [recordValues, accum, name];

        switch (recordName) {
          case FACETS_CQL.ITEMS_STATUSES:
            processItemsStatuses(activeFilters[FACETS.ITEM_STATUS], itemStatuses, intl, ...commonProps);
            break;
          case FACETS_CQL.EFFECTIVE_LOCATION:
            processFacetOptions(activeFilters[FACETS.EFFECTIVE_LOCATION], locations, ...commonProps);
            break;
          case FACETS_CQL.HOLDINGS_PERMANENT_LOCATION:
            processFacetOptions(activeFilters[FACETS.HOLDINGS_PERMANENT_LOCATION], locations, ...commonProps);
            break;
          case FACETS_CQL.MATERIAL_TYPES:
            processFacetOptions(activeFilters[FACETS.MATERIAL_TYPE], materialTypes, ...commonProps);
            break;
          case FACETS_CQL.ITEMS_DISCOVERY_SUPPRESS:
            accum[name] = getSuppressedOptions(activeFilters[FACETS.ITEMS_DISCOVERY_SUPPRESS], recordValues);
            break;
          case FACETS_CQL.ITEMS_TAGS:
            processFacetOptions(activeFilters[FACETS.ITEMS_TAGS], tagsRecords, ...commonProps, 'label');
            break;
          default:
        }
      }
      return accum;
    }, {});
  };

  const [
    accordions,
    onToggleSection,
    handleFetchFacets,
    handleFilterSearch,
    facetsOptions,
    getIsPending,
  ] = useFacets(
    segmentAccordions,
    segmentOptions,
    selectedFacetFilters,
    getNewRecords,
    props.data
  );

  return (
    <AccordionSet accordionStatus={accordions} onToggle={onToggleSection}>
      <Accordion
        label={<FormattedMessage id="ui-inventory.item.status" />}
        id={FACETS.ITEM_STATUS}
        name={FACETS.ITEM_STATUS}
        header={FilterAccordionHeader}
        displayClearButton={!_.isEmpty(activeFilters[FACETS.ITEM_STATUS])}
        onClearFilter={() => onClear(FACETS.ITEM_STATUS)}
      >
        <CheckboxFacet
          name={FACETS.ITEM_STATUS}
          dataOptions={facetsOptions[FACETS_OPTIONS.ITEMS_STATUSES_OPTIONS]}
          selectedValues={activeFilters[FACETS.ITEM_STATUS]}
          onChange={onChange}
          onSearch={handleFilterSearch}
          onFetch={handleFetchFacets}
          isPending={getIsPending(FACETS.ITEM_STATUS)}
          isFilterable
        />
      </Accordion>
      <Accordion
        label={<FormattedMessage id={`ui-inventory.filters.${FACETS.EFFECTIVE_LOCATION}`} />}
        id={FACETS.EFFECTIVE_LOCATION}
        name={FACETS.EFFECTIVE_LOCATION}
        separator
        header={FilterAccordionHeader}
        displayClearButton={activeFilters[FACETS.EFFECTIVE_LOCATION]?.length > 0}
        onClearFilter={() => onClear(FACETS.EFFECTIVE_LOCATION)}
      >
        <CheckboxFacet
          name={FACETS.EFFECTIVE_LOCATION}
          dataOptions={facetsOptions[FACETS_OPTIONS.EFFECTIVE_LOCATION_OPTIONS]}
          selectedValues={activeFilters[FACETS.EFFECTIVE_LOCATION]}
          onChange={onChange}
          onSearch={handleFilterSearch}
          onFetch={handleFetchFacets}
          isPending={getIsPending(FACETS.EFFECTIVE_LOCATION)}
          isFilterable
        />
      </Accordion>
      <Accordion
        label={<FormattedMessage id="ui-inventory.holdings.permanentLocation" />}
        id={FACETS.HOLDINGS_PERMANENT_LOCATION}
        name={FACETS.HOLDINGS_PERMANENT_LOCATION}
        closedByDefault
        header={FilterAccordionHeader}
        displayClearButton={activeFilters[FACETS.HOLDINGS_PERMANENT_LOCATION]?.length > 0}
        onClearFilter={() => onClear(FACETS.HOLDINGS_PERMANENT_LOCATION)}
      >
        <CheckboxFacet
          name={FACETS.HOLDINGS_PERMANENT_LOCATION}
          dataOptions={facetsOptions[FACETS_OPTIONS.HOLDINGS_PERMANENT_LOCATION_OPTIONS]}
          selectedValues={activeFilters[FACETS.HOLDINGS_PERMANENT_LOCATION]}
          onChange={onChange}
          onSearch={handleFilterSearch}
          onFetch={handleFetchFacets}
          isPending={getIsPending(FACETS.HOLDINGS_PERMANENT_LOCATION)}
          isFilterable
        />
      </Accordion>
      <Accordion
        label={<FormattedMessage id={`ui-inventory.${FACETS.MATERIAL_TYPE}`} />}
        id={FACETS.MATERIAL_TYPE}
        name={FACETS.MATERIAL_TYPE}
        separator
        closedByDefault
        header={FilterAccordionHeader}
        displayClearButton={!_.isEmpty(activeFilters[FACETS.MATERIAL_TYPE])}
        onClearFilter={() => onClear(FACETS.MATERIAL_TYPE)}
      >
        <CheckboxFacet
          name={FACETS.MATERIAL_TYPE}
          id="materialTypeFilter"
          dataOptions={facetsOptions[FACETS_OPTIONS.MATERIAL_TYPES_OPTIONS]}
          selectedValues={activeFilters[FACETS.MATERIAL_TYPE]}
          onChange={onChange}
          onSearch={handleFilterSearch}
          onFetch={handleFetchFacets}
          isPending={getIsPending(FACETS.MATERIAL_TYPE)}
          isFilterable
        />
      </Accordion>
      <Accordion
        label={<FormattedMessage id="ui-inventory.discoverySuppress" />}
        id={FACETS.ITEMS_DISCOVERY_SUPPRESS}
        name={FACETS.ITEMS_DISCOVERY_SUPPRESS}
        closedByDefault
        header={FilterAccordionHeader}
        displayClearButton={activeFilters[FACETS.ITEMS_DISCOVERY_SUPPRESS]?.length > 0}
        onClearFilter={() => onClear(FACETS.ITEMS_DISCOVERY_SUPPRESS)}
      >
        <CheckboxFacet
          data-test-filter-item-discovery-suppress
          name={FACETS.ITEMS_DISCOVERY_SUPPRESS}
          dataOptions={facetsOptions[FACETS_OPTIONS.ITEMS_DISCOVERY_SUPPRESS_OPTIONS]}
          selectedValues={activeFilters[FACETS.ITEMS_DISCOVERY_SUPPRESS]}
          onChange={onChange}
          isPending={getIsPending(FACETS.ITEMS_DISCOVERY_SUPPRESS)}
        />
      </Accordion>
      <TagsFilter
        id={FACETS.ITEMS_TAGS}
        name={FACETS.ITEMS_TAGS}
        onChange={onChange}
        onClear={onClear}
        onSearch={handleFilterSearch}
        onFetch={handleFetchFacets}
        selectedValues={activeFilters[FACETS.ITEMS_TAGS]}
        tagsRecords={facetsOptions[FACETS_OPTIONS.ITEMS_TAGS_OPTIONS]}
        isPending={getIsPending(FACETS.ITEMS_TAGS)}
      />
    </AccordionSet>
  );
};

ItemFilters.propTypes = {
  activeFilters: PropTypes.objectOf(PropTypes.array),
  onChange: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
  data: PropTypes.object,
};

ItemFilters.defaultProps = {
  activeFilters: {},
};

export default ItemFilters;
