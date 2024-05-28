import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
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
} from '@folio/stripes-inventory-components';

import DateRangeFilter from '../DateRangeFilter';
import TagsFilter from '../TagsFilter';

import {
  DATE_FORMAT,
} from '../../constants';
import {
  getCurrentFilters,
  makeDateRangeFilterString,
  retrieveDatesFromDateRangeFilterString,
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

  const intl = useIntl();

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
          dataOptions={facetOptions[FACETS_TO_REQUEST[FACETS.EFFECTIVE_LOCATION]]}
          selectedValues={activeFilters[FACETS.EFFECTIVE_LOCATION]}
          onChange={onChange}
          onFetch={onInputFocusAndMoreClick}
          onSearch={onFacetOptionSearch}
          isPending={getIsLoading(FACETS.EFFECTIVE_LOCATION)}
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
          dataOptions={facetOptions[FACETS_TO_REQUEST[FACETS.HOLDINGS_DISCOVERY_SUPPRESS]]}
          isPending={getIsLoading(FACETS.HOLDINGS_DISCOVERY_SUPPRESS)}
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
          dataOptions={facetOptions[FACETS_TO_REQUEST[FACETS.HOLDINGS_STATISTICAL_CODE_IDS]]}
          selectedValues={activeFilters[FACETS.HOLDINGS_STATISTICAL_CODE_IDS]}
          onChange={onChange}
          onSearch={onFacetOptionSearch}
          isFilterable
          isPending={getIsLoading(FACETS.HOLDINGS_STATISTICAL_CODE_IDS)}
          onFetch={onInputFocusAndMoreClick}
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
        label={intl.formatMessage({ id: 'ui-inventory.updatedDate' })}
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
        label={intl.formatMessage({ id: 'ui-inventory.source' })}
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
          dataOptions={facetOptions[FACETS_TO_REQUEST[FACETS.HOLDINGS_SOURCE]]}
          selectedValues={activeFilters[FACETS.HOLDINGS_SOURCE]}
          isPending={getIsLoading(FACETS.HOLDINGS_SOURCE)}
          onChange={onChange}
        />
      </Accordion>
      <TagsFilter
        id={FACETS.HOLDINGS_TAGS}
        name={FACETS.HOLDINGS_TAGS}
        onChange={onChange}
        onFetch={onInputFocusAndMoreClick}
        onSearch={onFacetOptionSearch}
        onClear={onClear}
        selectedValues={activeFilters[FACETS.HOLDINGS_TAGS]}
        tagsRecords={facetOptions[FACETS_TO_REQUEST[FACETS.HOLDINGS_TAGS]]}
        isPending={getIsLoading(FACETS.HOLDINGS_TAGS)}
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
