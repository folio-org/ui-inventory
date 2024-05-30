import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import get from 'lodash/get';

import {
  Accordion,
  AccordionSet,
  FilterAccordionHeader,
} from '@folio/stripes/components';
import {
  useStripes,
} from '@folio/stripes/core';
import {
  HeldByFacet,
  useFacets,
  FACETS_TO_REQUEST,
  FACETS,
  CheckboxFacet,
  SharedFacet,
  EffectiveLocationFacet,
  LanguageFacet,
  ResourceTypeFacet,
  DateRange,
  StatusFacet,
  TagsFacet,
  SourceFacet,
  FormatFacet,
  ModeIssuanceFacet,
  NatureOfContentFacet,
} from '@folio/stripes-inventory-components';

import {
  USER_TOUCHED_STAFF_SUPPRESS_STORAGE_KEY,
} from '../../constants';
import {
  getCurrentFilters,
} from '../../utils';

const InstanceFilters = props => {
  const {
    filterConfig,
    data: {
      query,
    },
    onChange,
    onClear,
  } = props;

  const stripes = useStripes();
  const intl = useIntl();

  const initialAccordionStates = {
    [FACETS.SHARED]: false,
    [FACETS.HELD_BY]: false,
    [FACETS.EFFECTIVE_LOCATION]: false,
    [FACETS.LANGUAGE]: false,
    [FACETS.RESOURCE]: false,
    [FACETS.FORMAT]: false,
    [FACETS.MODE]: false,
    [FACETS.NATURE_OF_CONTENT]: false,
    [FACETS.STAFF_SUPPRESS]: false,
    [FACETS.INSTANCES_DISCOVERY_SUPPRESS]: false,
    [FACETS.CREATED_DATE]: false,
    [FACETS.UPDATED_DATE]: false,
    [FACETS.SOURCE]: false,
    [FACETS.STATUS]: false,
    [FACETS.INSTANCES_TAGS]: false,
    [FACETS.STATISTICAL_CODE_IDS]: false,
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

  const clearStaffSuppressStorageFlag = useCallback(() => {
    sessionStorage.setItem(USER_TOUCHED_STAFF_SUPPRESS_STORAGE_KEY, true);
  }, []);

  const handleStaffSuppressChange = useCallback((...args) => {
    clearStaffSuppressStorageFlag();
    onChange(...args);
  }, [onChange]);

  const handleClearFilter = useCallback((name) => {
    clearStaffSuppressStorageFlag();
    onClear(name);
  }, [onClear]);

  const isStaffSuppressFilterAvailable = stripes.hasPerm('ui-inventory.instance.view-staff-suppressed-records');

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
      <LanguageFacet
        name={FACETS.LANGUAGE}
        facetOptions={facetOptions}
        activeFilters={activeFilters}
        getIsLoading={getIsLoading}
        onChange={onChange}
        onClear={onClear}
        onFetch={onInputFocusAndMoreClick}
        onSearch={onFacetOptionSearch}
      />
      <ResourceTypeFacet
        name={FACETS.RESOURCE}
        facetOptions={facetOptions}
        activeFilters={activeFilters}
        getIsLoading={getIsLoading}
        onChange={onChange}
        onClear={onClear}
        onFetch={onInputFocusAndMoreClick}
        onSearch={onFacetOptionSearch}
      />
      <FormatFacet
        name={FACETS.FORMAT}
        facetOptions={facetOptions}
        activeFilters={activeFilters}
        getIsLoading={getIsLoading}
        onChange={onChange}
        onClear={onClear}
        onFetch={onInputFocusAndMoreClick}
        onSearch={onFacetOptionSearch}
      />
      <ModeIssuanceFacet
        name={FACETS.MODE}
        facetOptions={facetOptions}
        activeFilters={activeFilters}
        getIsLoading={getIsLoading}
        onChange={onChange}
        onClear={onClear}
        onFetch={onInputFocusAndMoreClick}
        onSearch={onFacetOptionSearch}
      />
      <NatureOfContentFacet
        name={FACETS.NATURE_OF_CONTENT}
        facetOptions={facetOptions}
        activeFilters={activeFilters}
        getIsLoading={getIsLoading}
        onChange={onChange}
        onClear={onClear}
        onFetch={onInputFocusAndMoreClick}
        onSearch={onFacetOptionSearch}
      />
      {isStaffSuppressFilterAvailable && (
        <Accordion
          label={intl.formatMessage({ id: `ui-inventory.${FACETS.STAFF_SUPPRESS}` })}
          id={FACETS.STAFF_SUPPRESS}
          name={FACETS.STAFF_SUPPRESS}
          closedByDefault
          header={FilterAccordionHeader}
          displayClearButton={activeFilters[FACETS.STAFF_SUPPRESS]?.length > 0}
          onClearFilter={() => handleClearFilter(FACETS.STAFF_SUPPRESS)}
        >
          <CheckboxFacet
            name={FACETS.STAFF_SUPPRESS}
            dataOptions={facetOptions[FACETS_TO_REQUEST[FACETS.STAFF_SUPPRESS]]}
            selectedValues={activeFilters[FACETS.STAFF_SUPPRESS]}
            isPending={getIsLoading(FACETS.STAFF_SUPPRESS)}
            onChange={handleStaffSuppressChange}
          />
        </Accordion>
      )}
      <Accordion
        label={intl.formatMessage({ id: 'ui-inventory.discoverySuppress' })}
        id={FACETS.INSTANCES_DISCOVERY_SUPPRESS}
        name={FACETS.INSTANCES_DISCOVERY_SUPPRESS}
        closedByDefault
        header={FilterAccordionHeader}
        displayClearButton={activeFilters[FACETS.INSTANCES_DISCOVERY_SUPPRESS]?.length > 0}
        onClearFilter={() => onClear(FACETS.INSTANCES_DISCOVERY_SUPPRESS)}
      >
        <CheckboxFacet
          data-test-filter-instance-discovery-suppress
          name={FACETS.INSTANCES_DISCOVERY_SUPPRESS}
          dataOptions={facetOptions[FACETS_TO_REQUEST[FACETS.INSTANCES_DISCOVERY_SUPPRESS]]}
          selectedValues={activeFilters[FACETS.INSTANCES_DISCOVERY_SUPPRESS]}
          isPending={getIsLoading(FACETS.INSTANCES_DISCOVERY_SUPPRESS)}
          onChange={onChange}
        />
      </Accordion>
      <Accordion
        label={intl.formatMessage({ id: 'ui-inventory.statisticalCode' })}
        id={FACETS.STATISTICAL_CODE_IDS}
        name={FACETS.STATISTICAL_CODE_IDS}
        closedByDefault
        header={FilterAccordionHeader}
        displayClearButton={activeFilters[FACETS.STATISTICAL_CODE_IDS]?.length > 0}
        onClearFilter={() => onClear(FACETS.STATISTICAL_CODE_IDS)}
      >
        <CheckboxFacet
          name={FACETS.STATISTICAL_CODE_IDS}
          dataOptions={facetOptions[FACETS_TO_REQUEST[FACETS.STATISTICAL_CODE_IDS]]}
          selectedValues={activeFilters[FACETS.STATISTICAL_CODE_IDS]}
          onChange={onChange}
          onSearch={onFacetOptionSearch}
          isFilterable
          isPending={getIsLoading(FACETS.STATISTICAL_CODE_IDS)}
          onFetch={onInputFocusAndMoreClick}
        />
      </Accordion>
      <DateRange
        name={FACETS.CREATED_DATE}
        activeFilters={activeFilters}
        onChange={onChange}
        onClear={onClear}
      />
      <DateRange
        name={FACETS.UPDATED_DATE}
        activeFilters={activeFilters}
        onChange={onChange}
        onClear={onClear}
      />
      <StatusFacet
        name={FACETS.STATUS}
        facetOptions={facetOptions}
        activeFilters={activeFilters}
        getIsLoading={getIsLoading}
        onChange={onChange}
        onClear={onClear}
        onFetch={onInputFocusAndMoreClick}
        onSearch={onFacetOptionSearch}
      />
      <SourceFacet
        name={FACETS.SOURCE}
        facetOptions={facetOptions}
        activeFilters={activeFilters}
        getIsLoading={getIsLoading}
        onChange={onChange}
        onClear={onClear}
        onFetch={onInputFocusAndMoreClick}
        onSearch={onFacetOptionSearch}
      />
      <TagsFacet
        name={FACETS.INSTANCES_TAGS}
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

export default InstanceFilters;

InstanceFilters.propTypes = {
  filterConfig: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
  data: PropTypes.object,
};
