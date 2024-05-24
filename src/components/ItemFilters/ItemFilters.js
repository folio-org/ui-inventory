import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';

import {
  Accordion,
  AccordionSet,
  FilterAccordionHeader,
} from '@folio/stripes/components';
import {
  checkIfUserInMemberTenant,
  useStripes,
} from '@folio/stripes/core';
import {
  HeldByFacet,
  FACETS,
  FACETS_OPTIONS,
  FACETS_SETTINGS,
  FACETS_CQL,
  CheckboxFacet,
} from '@folio/stripes-inventory-components';

import DateRangeFilter from '../DateRangeFilter';
import TagsFilter from '../TagsFilter';
import { useFacets } from '../../common/hooks';
import {
  getSourceOptions,
  getSharedOptions,
  getSuppressedOptions,
  processFacetOptions,
  processItemsStatuses,
  processStatisticalCodes,
} from '../../facetUtils';
import {
  DATE_FORMAT,
} from '../../constants';
import {
  makeDateRangeFilterString,
  retrieveDatesFromDateRangeFilterString,
} from '../../utils';

const ItemFilters = (props) => {
  const {
    activeFilters,
    data: {
      itemStatuses,
      statisticalCodes,
      locations,
      materialTypes,
      consortiaTenants,
    },
    onChange,
    onClear,
  } = props;

  const stripes = useStripes();
  const intl = useIntl();

  const segmentAccordions = {
    [FACETS.SHARED]: false,
    [FACETS.HELD_BY]: false,
    [FACETS.ITEM_STATUS]: false,
    [FACETS.EFFECTIVE_LOCATION]: false,
    [FACETS.HOLDINGS_PERMANENT_LOCATION]: false,
    [FACETS.MATERIAL_TYPE]: false,
    [FACETS.ITEMS_DISCOVERY_SUPPRESS]: false,
    [FACETS.ITEMS_TAGS]: false,
    [FACETS.ITEMS_STATISTICAL_CODE_IDS]: false,
  };

  const segmentOptions = {
    [FACETS_OPTIONS.SHARED_OPTIONS]: [],
    [FACETS_OPTIONS.HELD_BY_OPTIONS]: [],
    [FACETS_OPTIONS.ITEMS_STATUSES_OPTIONS]: [],
    [FACETS_OPTIONS.EFFECTIVE_LOCATION_OPTIONS]: [],
    [FACETS_OPTIONS.HOLDINGS_PERMANENT_LOCATION_OPTIONS]: [],
    [FACETS_OPTIONS.MATERIAL_TYPES_OPTIONS]: [],
    [FACETS_OPTIONS.ITEMS_DISCOVERY_SUPPRESS_OPTIONS]: [],
    [FACETS_OPTIONS.ITEMS_TAGS_OPTIONS]: [],
    [FACETS_OPTIONS.STATISTICAL_CODES_OPTIONS]: [],
  };

  const selectedFacetFilters = {
    [FACETS.SHARED]: activeFilters[FACETS.SHARED],
    [FACETS.HELD_BY]: activeFilters[FACETS.HELD_BY],
    [FACETS.ITEM_STATUS]: activeFilters[FACETS.ITEM_STATUS],
    [FACETS.EFFECTIVE_LOCATION]: activeFilters[FACETS.EFFECTIVE_LOCATION],
    [FACETS.HOLDINGS_PERMANENT_LOCATION]: activeFilters[FACETS.HOLDINGS_PERMANENT_LOCATION],
    [FACETS.MATERIAL_TYPE]: activeFilters[FACETS.MATERIAL_TYPE],
    [FACETS.ITEMS_DISCOVERY_SUPPRESS]: activeFilters[FACETS.ITEMS_DISCOVERY_SUPPRESS],
    [FACETS.ITEMS_TAGS]: activeFilters[FACETS.ITEMS_TAGS],
    [FACETS.ITEMS_STATISTICAL_CODE_IDS]: activeFilters[FACETS.ITEMS_STATISTICAL_CODE_IDS],
  };

  const getNewRecords = (records) => {
    return _.reduce(FACETS_SETTINGS, (accum, name, recordName) => {
      if (records[recordName]) {
        const recordValues = records[recordName].values;
        const commonProps = [recordValues, accum, name];

        switch (recordName) {
          case FACETS_CQL.SHARED:
            accum[name] = getSharedOptions(activeFilters[FACETS.SHARED], recordValues);
            break;
          case FACETS_CQL.HELD_BY:
            processFacetOptions(activeFilters[FACETS.HELD_BY], consortiaTenants, ...commonProps);
            break;
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
          case FACETS_CQL.ITEMS_STATISTICAL_CODE_IDS:
            processStatisticalCodes(activeFilters[FACETS.ITEMS_STATISTICAL_CODE_IDS], statisticalCodes, ...commonProps);
            break;
          case FACETS_CQL.ITEMS_DISCOVERY_SUPPRESS:
            accum[name] = getSuppressedOptions(activeFilters[FACETS.ITEMS_DISCOVERY_SUPPRESS], recordValues);
            break;
          case FACETS_CQL.ITEMS_TAGS:
            accum[name] = getSourceOptions(activeFilters[FACETS.ITEMS_TAGS], recordValues);
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

  const isUserInMemberTenant = checkIfUserInMemberTenant(stripes);

  return (
    <AccordionSet accordionStatus={accordions} onToggle={onToggleSection}>
      {isUserInMemberTenant && (
        <Accordion
          label={<FormattedMessage id={`ui-inventory.filters.${FACETS.SHARED}`} />}
          id={FACETS.SHARED}
          name={FACETS.SHARED}
          separator={false}
          header={FilterAccordionHeader}
          displayClearButton={activeFilters[FACETS.SHARED]?.length > 0}
          onClearFilter={() => onClear(FACETS.SHARED)}
        >
          <CheckboxFacet
            name={FACETS.SHARED}
            dataOptions={facetsOptions[FACETS_OPTIONS.SHARED_OPTIONS]}
            selectedValues={activeFilters[FACETS.SHARED]}
            isPending={getIsPending(FACETS.SHARED)}
            onChange={onChange}
          />
        </Accordion>
      )}
      <HeldByFacet
        name={FACETS.HELD_BY}
        facetsOptions={facetsOptions}
        selectedValues={activeFilters[FACETS.HELD_BY]}
        onChange={onChange}
        onClear={onClear}
        onFetchFacets={handleFetchFacets}
        onFilterSearch={handleFilterSearch}
        onGetIsPending={getIsPending}
      />
      <Accordion
        label={<FormattedMessage id="ui-inventory.item.status" />}
        id={FACETS.ITEM_STATUS}
        name={FACETS.ITEM_STATUS}
        header={FilterAccordionHeader}
        displayClearButton={!_.isEmpty(activeFilters[FACETS.ITEM_STATUS])}
        onClearFilter={() => onClear(FACETS.ITEM_STATUS)}
        separator={false}
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
      <Accordion
        label={<FormattedMessage id="ui-inventory.statisticalCode" />}
        id={FACETS.ITEMS_STATISTICAL_CODE_IDS}
        name={FACETS.ITEMS_STATISTICAL_CODE_IDS}
        closedByDefault
        header={FilterAccordionHeader}
        displayClearButton={activeFilters[FACETS.ITEMS_STATISTICAL_CODE_IDS]?.length > 0}
        onClearFilter={() => onClear(FACETS.ITEMS_STATISTICAL_CODE_IDS)}
      >
        <CheckboxFacet
          name={FACETS.ITEMS_STATISTICAL_CODE_IDS}
          dataOptions={facetsOptions[FACETS_OPTIONS.STATISTICAL_CODES_OPTIONS]}
          selectedValues={activeFilters[FACETS.ITEMS_STATISTICAL_CODE_IDS]}
          onChange={onChange}
          onSearch={handleFilterSearch}
          isFilterable
          isPending={getIsPending(FACETS.ITEMS_STATISTICAL_CODE_IDS)}
          onFetch={handleFetchFacets}
        />
      </Accordion>
      <Accordion
        label={<FormattedMessage id={`ui-inventory.${FACETS.CREATED_DATE}`} />}
        id={FACETS.ITEMS_CREATED_DATE}
        name={FACETS.ITEMS_CREATED_DATE}
        closedByDefault
        header={FilterAccordionHeader}
        displayClearButton={activeFilters[FACETS.ITEMS_CREATED_DATE]?.length > 0}
        onClearFilter={() => onClear(FACETS.ITEMS_CREATED_DATE)}
      >
        <DateRangeFilter
          name={FACETS.ITEMS_CREATED_DATE}
          dateFormat={DATE_FORMAT}
          selectedValues={retrieveDatesFromDateRangeFilterString(activeFilters[FACETS.ITEMS_CREATED_DATE]?.[0])}
          onChange={onChange}
          makeFilterString={makeDateRangeFilterString}
        />
      </Accordion>
      <Accordion
        label={<FormattedMessage id={`ui-inventory.${FACETS.UPDATED_DATE}`} />}
        id={FACETS.ITEMS_UPDATED_DATE}
        name={FACETS.ITEMS_UPDATED_DATE}
        closedByDefault
        header={FilterAccordionHeader}
        displayClearButton={activeFilters[FACETS.ITEMS_UPDATED_DATE]?.length > 0}
        onClearFilter={() => onClear(FACETS.ITEMS_UPDATED_DATE)}
      >
        <DateRangeFilter
          name={FACETS.ITEMS_UPDATED_DATE}
          dateFormat={DATE_FORMAT}
          selectedValues={retrieveDatesFromDateRangeFilterString(activeFilters[FACETS.ITEMS_UPDATED_DATE]?.[0])}
          onChange={onChange}
          makeFilterString={makeDateRangeFilterString}
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
  activeFilters: PropTypes.object,
  onChange: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
  data: PropTypes.object,
};

ItemFilters.defaultProps = {
  activeFilters: {},
};

export default ItemFilters;
