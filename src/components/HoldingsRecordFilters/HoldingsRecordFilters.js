import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { reduce } from 'lodash';

import {
  Accordion,
  FilterAccordionHeader,
  AccordionSet,
} from '@folio/stripes/components';
import {
  checkIfUserInMemberTenant,
  useStripes,
} from '@folio/stripes/core';

import DateRangeFilter from '../DateRangeFilter';
import TagsFilter from '../TagsFilter';
import CheckboxFacet from '../CheckboxFacet';
import { useFacets } from '../../common/hooks';
import {
  getSourceOptions,
  getSharedOptions,
  getSuppressedOptions,
  processFacetOptions,
  processStatisticalCodes,
} from '../../facetUtils';
import {
  DATE_FORMAT,
  FACETS,
  FACETS_OPTIONS,
  FACETS_CQL,
  FACETS_SETTINGS,
} from '../../constants';
import {
  makeDateRangeFilterString,
  retrieveDatesFromDateRangeFilterString,
} from '../../utils';

const HoldingsRecordFilters = (props) => {
  const {
    activeFilters,
    data: {
      locations,
      statisticalCodes,
      holdingsSources,
      holdingsTypes,
      consortiaTenants,
    },
    onChange,
    onClear,
  } = props;

  const stripes = useStripes();

  const segmentAccordions = {
    [FACETS.SHARED]: false,
    [FACETS.HELD_BY]: false,
    [FACETS.EFFECTIVE_LOCATION]: false,
    [FACETS.HOLDINGS_PERMANENT_LOCATION]: false,
    [FACETS.HOLDINGS_DISCOVERY_SUPPRESS]: false,
    [FACETS.HOLDINGS_TAGS]: false,
    [FACETS.HOLDINGS_CREATED_DATE]: false,
    [FACETS.HOLDINGS_UPDATED_DATE]: false,
    [FACETS.HOLDINGS_STATISTICAL_CODE_IDS]: false,
    [FACETS.HOLDINGS_SOURCE]: false,
    [FACETS.HOLDINGS_TYPE]: false,
  };

  const segmentOptions = {
    [FACETS_OPTIONS.SHARED_OPTIONS]: [],
    [FACETS_OPTIONS.HELD_BY_OPTIONS]: [],
    [FACETS_OPTIONS.EFFECTIVE_LOCATION_OPTIONS]: [],
    [FACETS_OPTIONS.HOLDINGS_PERMANENT_LOCATION_OPTIONS]: [],
    [FACETS_OPTIONS.HOLDINGS_DISCOVERY_SUPPRESS_OPTIONS]: [],
    [FACETS_OPTIONS.HOLDINGS_TAGS_OPTIONS]: [],
    [FACETS_OPTIONS.STATISTICAL_CODES_OPTIONS]: [],
    [FACETS_OPTIONS.HOLDINGS_SOURCE_OPTIONS]: [],
    [FACETS_OPTIONS.HOLDINGS_TYPE_OPTIONS]: [],
  };

  const selectedFacetFilters = {
    [FACETS.SHARED]: activeFilters[FACETS.SHARED],
    [FACETS.HELD_BY]: activeFilters[FACETS.HELD_BY],
    [FACETS.EFFECTIVE_LOCATION]: activeFilters[FACETS.EFFECTIVE_LOCATION],
    [FACETS.HOLDINGS_PERMANENT_LOCATION]: activeFilters[FACETS.HOLDINGS_PERMANENT_LOCATION],
    [FACETS.HOLDINGS_DISCOVERY_SUPPRESS]: activeFilters[FACETS.HOLDINGS_DISCOVERY_SUPPRESS],
    [FACETS.HOLDINGS_TAGS]: activeFilters[FACETS.HOLDINGS_TAGS],
    [FACETS.HOLDINGS_STATISTICAL_CODE_IDS]: activeFilters[FACETS.HOLDINGS_STATISTICAL_CODE_IDS],
    [FACETS.HOLDINGS_SOURCE]: activeFilters[FACETS.HOLDINGS_SOURCE],
    [FACETS.HOLDINGS_TYPE]: activeFilters[FACETS.HOLDINGS_TYPE],
  };

  const getNewRecords = (records) => {
    return reduce(FACETS_SETTINGS, (accum, name, recordName) => {
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
          case FACETS_CQL.EFFECTIVE_LOCATION:
            processFacetOptions(activeFilters[FACETS.EFFECTIVE_LOCATION], locations, ...commonProps);
            break;
          case FACETS_CQL.HOLDINGS_PERMANENT_LOCATION:
            processFacetOptions(activeFilters[FACETS.HOLDINGS_PERMANENT_LOCATION], locations, ...commonProps);
            break;
          case FACETS_CQL.HOLDINGS_DISCOVERY_SUPPRESS:
            accum[name] = getSuppressedOptions(activeFilters[FACETS.HOLDINGS_DISCOVERY_SUPPRESS], recordValues);
            break;
          case FACETS_CQL.HOLDINGS_STATISTICAL_CODE_IDS:
            processStatisticalCodes(activeFilters[FACETS.HOLDINGS_STATISTICAL_CODE_IDS], statisticalCodes, ...commonProps);
            break;
          case FACETS_CQL.HOLDINGS_SOURCE:
            processFacetOptions(activeFilters[FACETS.HOLDINGS_SOURCE], holdingsSources, ...commonProps);
            break;
          case FACETS_CQL.HOLDINGS_TAGS:
            accum[name] = getSourceOptions(activeFilters[FACETS.HOLDINGS_TAGS], recordValues);
            break;
          case FACETS_CQL.HOLDINGS_TYPE:
            processFacetOptions(activeFilters[FACETS.HOLDINGS_TYPE], holdingsTypes, ...commonProps);
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
            data-test-filter-holdings-shared
            name={FACETS.SHARED}
            dataOptions={facetsOptions[FACETS_OPTIONS.SHARED_OPTIONS]}
            selectedValues={activeFilters[FACETS.SHARED]}
            isPending={getIsPending(FACETS.SHARED)}
            onChange={onChange}
          />
        </Accordion>
      )}
      {isUserInMemberTenant && (
        <Accordion
          label={<FormattedMessage id={`ui-inventory.filters.${FACETS.HELD_BY}`} />}
          id={FACETS.HELD_BY}
          name={FACETS.HELD_BY}
          separator={false}
          header={FilterAccordionHeader}
          displayClearButton={activeFilters[FACETS.HELD_BY]?.length > 0}
          onClearFilter={() => onClear(FACETS.HELD_BY)}
        >
          <CheckboxFacet
            data-test-filter-holdings-held-by
            name={FACETS.HELD_BY}
            dataOptions={facetsOptions[FACETS_OPTIONS.HELD_BY_OPTIONS]}
            selectedValues={activeFilters[FACETS.HELD_BY]}
            isPending={getIsPending(FACETS.HELD_BY)}
            onChange={onChange}
          />
        </Accordion>
      )}
      <Accordion
        label={<FormattedMessage id={`ui-inventory.filters.${FACETS.EFFECTIVE_LOCATION}`} />}
        id={FACETS.EFFECTIVE_LOCATION}
        name={FACETS.EFFECTIVE_LOCATION}
        separator={false}
        header={FilterAccordionHeader}
        displayClearButton={activeFilters[FACETS.EFFECTIVE_LOCATION]?.length > 0}
        onClearFilter={() => onClear(FACETS.EFFECTIVE_LOCATION)}
      >
        <CheckboxFacet
          name={FACETS.EFFECTIVE_LOCATION}
          dataOptions={facetsOptions[FACETS_OPTIONS.EFFECTIVE_LOCATION_OPTIONS]}
          selectedValues={activeFilters[FACETS.EFFECTIVE_LOCATION]}
          onChange={onChange}
          onFetch={handleFetchFacets}
          onSearch={handleFilterSearch}
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
          onFetch={handleFetchFacets}
          onSearch={handleFilterSearch}
          isPending={getIsPending(FACETS.HOLDINGS_PERMANENT_LOCATION)}
          isFilterable
        />
      </Accordion>
      <Accordion
        label={<FormattedMessage id="ui-inventory.holdingsType" />}
        id={FACETS.HOLDINGS_TYPE}
        name={FACETS.HOLDINGS_TYPE}
        closedByDefault
        header={FilterAccordionHeader}
        displayClearButton={activeFilters[FACETS.HOLDINGS_TYPE]?.length > 0}
        onClearFilter={() => onClear(FACETS.HOLDINGS_TYPE)}
      >
        <CheckboxFacet
          name={FACETS.HOLDINGS_TYPE}
          dataOptions={facetsOptions[FACETS_OPTIONS.HOLDINGS_TYPE_OPTIONS]}
          selectedValues={activeFilters[FACETS.HOLDINGS_TYPE]}
          onChange={onChange}
          onFetch={handleFetchFacets}
          onSearch={handleFilterSearch}
          isPending={getIsPending(FACETS.HOLDINGS_TYPE)}
          isFilterable
        />
      </Accordion>
      <Accordion
        data-test-filter-holding-discovery-suppress
        label={<FormattedMessage id="ui-inventory.discoverySuppress" />}
        id={FACETS.HOLDINGS_DISCOVERY_SUPPRESS}
        name={FACETS.HOLDINGS_DISCOVERY_SUPPRESS}
        closedByDefault
        header={FilterAccordionHeader}
        displayClearButton={activeFilters[FACETS.HOLDINGS_DISCOVERY_SUPPRESS]?.length > 0}
        onClearFilter={() => onClear(FACETS.HOLDINGS_DISCOVERY_SUPPRESS)}
      >
        <CheckboxFacet
          data-test-filter-holdings-discovery-suppress
          name={FACETS.HOLDINGS_DISCOVERY_SUPPRESS}
          dataOptions={facetsOptions[FACETS_OPTIONS.HOLDINGS_DISCOVERY_SUPPRESS_OPTIONS]}
          isPending={getIsPending(FACETS.HOLDINGS_DISCOVERY_SUPPRESS)}
          selectedValues={activeFilters[FACETS.HOLDINGS_DISCOVERY_SUPPRESS]}
          onChange={onChange}
        />
      </Accordion>
      <Accordion
        label={<FormattedMessage id="ui-inventory.statisticalCode" />}
        id={FACETS.HOLDINGS_STATISTICAL_CODE_IDS}
        name={FACETS.HOLDINGS_STATISTICAL_CODE_IDS}
        closedByDefault
        header={FilterAccordionHeader}
        displayClearButton={activeFilters[FACETS.HOLDINGS_STATISTICAL_CODE_IDS]?.length > 0}
        onClearFilter={() => onClear(FACETS.HOLDINGS_STATISTICAL_CODE_IDS)}
      >
        <CheckboxFacet
          name={FACETS.HOLDINGS_STATISTICAL_CODE_IDS}
          dataOptions={facetsOptions[FACETS_OPTIONS.STATISTICAL_CODES_OPTIONS]}
          selectedValues={activeFilters[FACETS.HOLDINGS_STATISTICAL_CODE_IDS]}
          onChange={onChange}
          onSearch={handleFilterSearch}
          isFilterable
          isPending={getIsPending(FACETS.HOLDINGS_STATISTICAL_CODE_IDS)}
          onFetch={handleFetchFacets}
        />
      </Accordion>
      <Accordion
        label={<FormattedMessage id={`ui-inventory.${FACETS.CREATED_DATE}`} />}
        id={FACETS.HOLDINGS_CREATED_DATE}
        name={FACETS.HOLDINGS_CREATED_DATE}
        closedByDefault
        header={FilterAccordionHeader}
        displayClearButton={activeFilters[FACETS.HOLDINGS_CREATED_DATE]?.length > 0}
        onClearFilter={() => onClear(FACETS.HOLDINGS_CREATED_DATE)}
      >
        <DateRangeFilter
          name={FACETS.HOLDINGS_CREATED_DATE}
          dateFormat={DATE_FORMAT}
          selectedValues={retrieveDatesFromDateRangeFilterString(activeFilters[FACETS.HOLDINGS_CREATED_DATE]?.[0])}
          onChange={onChange}
          makeFilterString={makeDateRangeFilterString}
        />
      </Accordion>
      <Accordion
        label={<FormattedMessage id={`ui-inventory.${FACETS.UPDATED_DATE}`} />}
        id={FACETS.HOLDINGS_UPDATED_DATE}
        name={FACETS.HOLDINGS_UPDATED_DATE}
        closedByDefault
        header={FilterAccordionHeader}
        displayClearButton={activeFilters[FACETS.HOLDINGS_UPDATED_DATE]?.length > 0}
        onClearFilter={() => onClear(FACETS.HOLDINGS_UPDATED_DATE)}
      >
        <DateRangeFilter
          name={FACETS.HOLDINGS_UPDATED_DATE}
          dateFormat={DATE_FORMAT}
          selectedValues={retrieveDatesFromDateRangeFilterString(activeFilters[FACETS.HOLDINGS_UPDATED_DATE]?.[0])}
          onChange={onChange}
          makeFilterString={makeDateRangeFilterString}
        />
      </Accordion>
      <Accordion
        label={<FormattedMessage id={`ui-inventory.${FACETS.SOURCE}`} />}
        id={FACETS.HOLDINGS_SOURCE}
        name={FACETS.HOLDINGS_SOURCE}
        closedByDefault
        header={FilterAccordionHeader}
        displayClearButton={activeFilters[FACETS.HOLDINGS_SOURCE]?.length > 0}
        onClearFilter={() => onClear(FACETS.HOLDINGS_SOURCE)}
      >
        <CheckboxFacet
          data-test-filter-instance-source
          name={FACETS.HOLDINGS_SOURCE}
          dataOptions={facetsOptions[FACETS_OPTIONS.HOLDINGS_SOURCE_OPTIONS]}
          selectedValues={activeFilters[FACETS.HOLDINGS_SOURCE]}
          isPending={getIsPending(FACETS.HOLDINGS_SOURCE)}
          onChange={onChange}
        />
      </Accordion>
      <TagsFilter
        id={FACETS.HOLDINGS_TAGS}
        name={FACETS.HOLDINGS_TAGS}
        onChange={onChange}
        onFetch={handleFetchFacets}
        onSearch={handleFilterSearch}
        onClear={onClear}
        selectedValues={activeFilters[FACETS.HOLDINGS_TAGS]}
        tagsRecords={facetsOptions[FACETS_OPTIONS.HOLDINGS_TAGS_OPTIONS]}
        isPending={getIsPending(FACETS.HOLDINGS_TAGS)}
      />
    </AccordionSet>
  );
};

HoldingsRecordFilters.propTypes = {
  activeFilters: PropTypes.object,
  onChange: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
  data: PropTypes.object,
};

HoldingsRecordFilters.defaultProps = {
  activeFilters: {},
};

export default HoldingsRecordFilters;
