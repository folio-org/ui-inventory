import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { get } from 'lodash';

import {
  Accordion,
  FilterAccordionHeader,
  AccordionSet,
} from '@folio/stripes/components';
import {
  FACETS,
  HeldByFacet,
  CheckboxFacet,
  useFacets,
  FACETS_TO_REQUEST,
  SharedFacet,
  EffectiveLocationFacet,
  DateRange,
  TagsFacet,
  SourceFacet,
  DiscoverySuppressFacet,
  StatisticalCodeFacet,
} from '@folio/stripes-inventory-components';

import {
  getCurrentFilters,
} from '../../utils';

const HoldingsRecordFilters = (props) => {
  const {
    filterConfig,
    data: {
      query,
    },
    onChange,
    onClear,
  } = props;

  const initialAccordionStates = {
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

  const activeFilters = useMemo(() => getCurrentFilters(get(query, 'filters', '')) || {}, [query]);

  const {
    accordionStatus,
    facetOptions,
    onToggleAccordion,
    onInputFocusAndMoreClick,
    onFacetOptionSearch,
    getIsLoading,
  } = useFacets({
    initialAccordionStates,
    query,
    filterConfig,
    activeFilters,
    data: props.data,
  });

  return (
    <AccordionSet accordionStatus={accordionStatus} onToggle={onToggleAccordion}>
      <SharedFacet
        name={FACETS.SHARED}
        activeFilters={activeFilters}
        facetOptions={facetOptions}
        onChange={onChange}
        onClear={onClear}
        getIsLoading={getIsLoading}
      />
      <HeldByFacet
        name={FACETS.HELD_BY}
        activeFilters={activeFilters}
        facetOptions={facetOptions}
        getIsLoading={getIsLoading}
        onChange={onChange}
        onClear={onClear}
        onFetch={onInputFocusAndMoreClick}
        onSearch={onFacetOptionSearch}
      />
      <EffectiveLocationFacet
        name={FACETS.EFFECTIVE_LOCATION}
        facetOptions={facetOptions}
        activeFilters={activeFilters}
        getIsLoading={getIsLoading}
        onChange={onChange}
        onClear={onClear}
        onFetch={onInputFocusAndMoreClick}
        onSearch={onFacetOptionSearch}
      />
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
          dataOptions={facetOptions[FACETS_TO_REQUEST[FACETS.HOLDINGS_PERMANENT_LOCATION]]}
          selectedValues={activeFilters[FACETS.HOLDINGS_PERMANENT_LOCATION]}
          onChange={onChange}
          onFetch={onInputFocusAndMoreClick}
          onSearch={onFacetOptionSearch}
          isPending={getIsLoading(FACETS.HOLDINGS_PERMANENT_LOCATION)}
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
          dataOptions={facetOptions[FACETS_TO_REQUEST[FACETS.HOLDINGS_TYPE]]}
          selectedValues={activeFilters[FACETS.HOLDINGS_TYPE]}
          onChange={onChange}
          onFetch={onInputFocusAndMoreClick}
          onSearch={onFacetOptionSearch}
          isPending={getIsLoading(FACETS.HOLDINGS_TYPE)}
          isFilterable
        />
      </Accordion>
      <DiscoverySuppressFacet
        name={FACETS.HOLDINGS_DISCOVERY_SUPPRESS}
        facetOptions={facetOptions}
        activeFilters={activeFilters}
        getIsLoading={getIsLoading}
        onChange={onChange}
        onClear={onClear}
        onFetch={onInputFocusAndMoreClick}
        onSearch={onFacetOptionSearch}
      />
      <StatisticalCodeFacet
        name={FACETS.HOLDINGS_STATISTICAL_CODE_IDS}
        facetOptions={facetOptions}
        activeFilters={activeFilters}
        getIsLoading={getIsLoading}
        onChange={onChange}
        onClear={onClear}
        onFetch={onInputFocusAndMoreClick}
        onSearch={onFacetOptionSearch}
      />
      <DateRange
        name={FACETS.HOLDINGS_CREATED_DATE}
        activeFilters={activeFilters}
        onChange={onChange}
        onClear={onClear}
      />
      <DateRange
        name={FACETS.HOLDINGS_UPDATED_DATE}
        activeFilters={activeFilters}
        onChange={onChange}
        onClear={onClear}
      />
      <SourceFacet
        name={FACETS.HOLDINGS_SOURCE}
        facetOptions={facetOptions}
        activeFilters={activeFilters}
        getIsLoading={getIsLoading}
        onChange={onChange}
        onClear={onClear}
        onFetch={onInputFocusAndMoreClick}
        onSearch={onFacetOptionSearch}
      />
      <TagsFacet
        name={FACETS.HOLDINGS_TAGS}
        facetOptions={facetOptions}
        activeFilters={activeFilters}
        getIsLoading={getIsLoading}
        onChange={onChange}
        onClear={onClear}
        onFetch={onInputFocusAndMoreClick}
        onSearch={onFacetOptionSearch}
      />
    </AccordionSet>
  );
};

HoldingsRecordFilters.propTypes = {
  filterConfig: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
  data: PropTypes.object,
};

export default HoldingsRecordFilters;
