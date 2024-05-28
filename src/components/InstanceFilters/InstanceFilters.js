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
} from '@folio/stripes-inventory-components';

import TagsFilter from '../TagsFilter';
import DateRangeFilter from '../DateRangeFilter';
import {
  DATE_FORMAT,
  USER_TOUCHED_STAFF_SUPPRESS_STORAGE_KEY,
} from '../../constants';
import {
  getCurrentFilters,
  makeDateRangeFilterString,
  retrieveDatesFromDateRangeFilterString,
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
      <Accordion
        label={intl.formatMessage({ id: `ui-inventory.filters.${FACETS.EFFECTIVE_LOCATION}` })}
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
          onSearch={onFacetOptionSearch}
          isFilterable
          isPending={getIsLoading(FACETS.EFFECTIVE_LOCATION)}
          onFetch={onInputFocusAndMoreClick}
        />
      </Accordion>
      <Accordion
        label={intl.formatMessage({ id: `ui-inventory.instances.${FACETS.LANGUAGE}` })}
        id={FACETS.LANGUAGE}
        name={FACETS.LANGUAGE}
        closedByDefault
        header={FilterAccordionHeader}
        displayClearButton={activeFilters[FACETS.LANGUAGE]?.length > 0}
        onClearFilter={() => onClear(FACETS.LANGUAGE)}
      >
        <CheckboxFacet
          name={FACETS.LANGUAGE}
          dataOptions={facetOptions[FACETS_TO_REQUEST[FACETS.LANGUAGE]]}
          selectedValues={activeFilters[FACETS.LANGUAGE]}
          onChange={onChange}
          onSearch={onFacetOptionSearch}
          isFilterable
          isPending={getIsLoading(FACETS.LANGUAGE)}
          onFetch={onInputFocusAndMoreClick}
        />
      </Accordion>
      <Accordion
        label={intl.formatMessage({ id: 'ui-inventory.instances.resourceType' })}
        id={FACETS.RESOURCE}
        name={FACETS.RESOURCE}
        closedByDefault
        header={FilterAccordionHeader}
        displayClearButton={activeFilters[FACETS.RESOURCE]?.length > 0}
        onClearFilter={() => onClear(FACETS.RESOURCE)}
      >
        <CheckboxFacet
          name={FACETS.RESOURCE}
          dataOptions={facetOptions[FACETS_TO_REQUEST[FACETS.RESOURCE]]}
          selectedValues={activeFilters[FACETS.RESOURCE]}
          onChange={onChange}
          onSearch={onFacetOptionSearch}
          isFilterable
          isPending={getIsLoading(FACETS.RESOURCE)}
          onFetch={onInputFocusAndMoreClick}
        />
      </Accordion>
      <Accordion
        label={intl.formatMessage({ id: 'ui-inventory.instanceFormat' })}
        id={FACETS.FORMAT}
        name={FACETS.FORMAT}
        closedByDefault
        header={FilterAccordionHeader}
        displayClearButton={activeFilters[FACETS.FORMAT]?.length > 0}
        onClearFilter={() => onClear(FACETS.FORMAT)}
      >
        <CheckboxFacet
          name={FACETS.FORMAT}
          dataOptions={facetOptions[FACETS_TO_REQUEST[FACETS.FORMAT]]}
          selectedValues={activeFilters[FACETS.FORMAT]}
          onChange={onChange}
          onSearch={onFacetOptionSearch}
          isFilterable
          isPending={getIsLoading(FACETS.FORMAT)}
          onFetch={onInputFocusAndMoreClick}
        />
      </Accordion>
      <Accordion
        label={intl.formatMessage({ id: 'ui-inventory.modeOfIssuance' })}
        id={FACETS.MODE}
        name={FACETS.MODE}
        closedByDefault
        header={FilterAccordionHeader}
        displayClearButton={activeFilters[FACETS.MODE]?.length > 0}
        onClearFilter={() => onClear(FACETS.MODE)}
      >
        <CheckboxFacet
          name={FACETS.MODE}
          dataOptions={facetOptions[FACETS_TO_REQUEST[FACETS.MODE]]}
          selectedValues={activeFilters[FACETS.MODE]}
          onChange={onChange}
          onSearch={onFacetOptionSearch}
          isFilterable
          isPending={getIsLoading(FACETS.MODE)}
          onFetch={onInputFocusAndMoreClick}
        />
      </Accordion>
      <Accordion
        label={intl.formatMessage({ id: 'ui-inventory.natureOfContentTerms' })}
        id={FACETS.NATURE_OF_CONTENT}
        name={FACETS.NATURE_OF_CONTENT}
        closedByDefault
        header={FilterAccordionHeader}
        displayClearButton={activeFilters[FACETS.NATURE_OF_CONTENT]?.length > 0}
        onClearFilter={() => onClear(FACETS.NATURE_OF_CONTENT)}
      >
        <CheckboxFacet
          name={FACETS.NATURE_OF_CONTENT}
          dataOptions={facetOptions[FACETS_TO_REQUEST[FACETS.NATURE_OF_CONTENT]]}
          selectedValues={activeFilters[FACETS.NATURE_OF_CONTENT]}
          onChange={onChange}
          onSearch={onFacetOptionSearch}
          isFilterable
          isPending={getIsLoading(FACETS.NATURE_OF_CONTENT)}
          onFetch={onInputFocusAndMoreClick}
        />
      </Accordion>
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
      <Accordion
        label={intl.formatMessage({ id: `ui-inventory.${FACETS.CREATED_DATE}` })}
        id={FACETS.CREATED_DATE}
        name={FACETS.CREATED_DATE}
        closedByDefault
        header={FilterAccordionHeader}
        displayClearButton={activeFilters[FACETS.CREATED_DATE]?.length > 0}
        onClearFilter={() => onClear(FACETS.CREATED_DATE)}
      >
        <DateRangeFilter
          name={FACETS.CREATED_DATE}
          dateFormat={DATE_FORMAT}
          selectedValues={retrieveDatesFromDateRangeFilterString(activeFilters[FACETS.CREATED_DATE]?.[0])}
          onChange={onChange}
          makeFilterString={makeDateRangeFilterString}
        />
      </Accordion>
      <Accordion
        label={intl.formatMessage({ id: `ui-inventory.${FACETS.UPDATED_DATE}` })}
        id={FACETS.UPDATED_DATE}
        name={FACETS.UPDATED_DATE}
        closedByDefault
        header={FilterAccordionHeader}
        displayClearButton={activeFilters[FACETS.UPDATED_DATE]?.length > 0}
        onClearFilter={() => onClear(FACETS.UPDATED_DATE)}
      >
        <DateRangeFilter
          name={FACETS.UPDATED_DATE}
          dateFormat={DATE_FORMAT}
          selectedValues={retrieveDatesFromDateRangeFilterString(activeFilters[FACETS.UPDATED_DATE]?.[0])}
          onChange={onChange}
          makeFilterString={makeDateRangeFilterString}
        />
      </Accordion>
      <Accordion
        label={intl.formatMessage({ id: 'ui-inventory.instanceStatusShort' })}
        id={FACETS.STATUS}
        name={FACETS.STATUS}
        closedByDefault
        header={FilterAccordionHeader}
        displayClearButton={activeFilters[FACETS.STATUS]?.length > 0}
        onClearFilter={() => onClear(FACETS.STATUS)}
      >
        <CheckboxFacet
          data-test-filter-instance-source
          name={FACETS.STATUS}
          dataOptions={facetOptions[FACETS_TO_REQUEST[FACETS.STATUS]]}
          selectedValues={activeFilters[FACETS.STATUS]}
          isPending={getIsLoading(FACETS.STATUS)}
          onChange={onChange}
          isFilterable
          onSearch={onFacetOptionSearch}
          onFetch={onInputFocusAndMoreClick}
        />
      </Accordion>
      <Accordion
        label={intl.formatMessage({ id: `ui-inventory.${FACETS.SOURCE}` })}
        id={FACETS.SOURCE}
        name={FACETS.SOURCE}
        closedByDefault
        header={FilterAccordionHeader}
        displayClearButton={activeFilters[FACETS.SOURCE]?.length > 0}
        onClearFilter={() => onClear(FACETS.SOURCE)}
      >
        <CheckboxFacet
          data-test-filter-instance-source
          name={FACETS.SOURCE}
          dataOptions={facetOptions[FACETS_TO_REQUEST[FACETS.SOURCE]]}
          selectedValues={activeFilters[FACETS.SOURCE]}
          isPending={getIsLoading(FACETS.SOURCE)}
          onChange={onChange}
        />
      </Accordion>
      <TagsFilter
        id={FACETS.INSTANCES_TAGS}
        name={FACETS.INSTANCES_TAGS}
        onChange={onChange}
        onClear={onClear}
        selectedValues={activeFilters[FACETS.INSTANCES_TAGS]}
        isPending={getIsLoading(FACETS.INSTANCES_TAGS)}
        tagsRecords={facetOptions[FACETS_TO_REQUEST[FACETS.INSTANCES_TAGS]]}
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
