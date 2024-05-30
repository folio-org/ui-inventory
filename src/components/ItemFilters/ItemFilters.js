import _, { get } from 'lodash';
import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Accordion,
  AccordionSet,
  FilterAccordionHeader,
} from '@folio/stripes/components';
import {
  HeldByFacet,
  FACETS,
  CheckboxFacet,
  useFacets,
  FACETS_TO_REQUEST,
  SharedFacet,
  EffectiveLocationFacet,
  DateRange,
  StatusFacet,
  TagsFacet,
  DiscoverySuppressFacet,
  StatisticalCodeFacet,
  PermanentLocationFacet,
} from '@folio/stripes-inventory-components';

import {
  getCurrentFilters,
} from '../../utils';

const ItemFilters = (props) => {
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
    [FACETS.ITEM_STATUS]: false,
    [FACETS.EFFECTIVE_LOCATION]: false,
    [FACETS.HOLDINGS_PERMANENT_LOCATION]: false,
    [FACETS.MATERIAL_TYPE]: false,
    [FACETS.ITEMS_DISCOVERY_SUPPRESS]: false,
    [FACETS.ITEMS_TAGS]: false,
    [FACETS.ITEMS_STATISTICAL_CODE_IDS]: false,
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
      <StatusFacet
        name={FACETS.ITEM_STATUS}
        facetOptions={facetOptions}
        activeFilters={activeFilters}
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
      <PermanentLocationFacet
        name={FACETS.HOLDINGS_PERMANENT_LOCATION}
        facetOptions={facetOptions}
        activeFilters={activeFilters}
        getIsLoading={getIsLoading}
        onChange={onChange}
        onClear={onClear}
        onFetch={onInputFocusAndMoreClick}
        onSearch={onFacetOptionSearch}
      />
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
          dataOptions={facetOptions[FACETS_TO_REQUEST[FACETS.MATERIAL_TYPE]]}
          selectedValues={activeFilters[FACETS.MATERIAL_TYPE]}
          onChange={onChange}
          onSearch={onFacetOptionSearch}
          onFetch={onInputFocusAndMoreClick}
          isPending={getIsLoading(FACETS.MATERIAL_TYPE)}
          isFilterable
        />
      </Accordion>
      <DiscoverySuppressFacet
        name={FACETS.ITEMS_DISCOVERY_SUPPRESS}
        facetOptions={facetOptions}
        activeFilters={activeFilters}
        getIsLoading={getIsLoading}
        onChange={onChange}
        onClear={onClear}
        onFetch={onInputFocusAndMoreClick}
        onSearch={onFacetOptionSearch}
      />
      <StatisticalCodeFacet
        name={FACETS.ITEMS_STATISTICAL_CODE_IDS}
        facetOptions={facetOptions}
        activeFilters={activeFilters}
        getIsLoading={getIsLoading}
        onChange={onChange}
        onClear={onClear}
        onFetch={onInputFocusAndMoreClick}
        onSearch={onFacetOptionSearch}
      />
      <DateRange
        name={FACETS.ITEMS_CREATED_DATE}
        activeFilters={activeFilters}
        onChange={onChange}
        onClear={onClear}
      />
      <DateRange
        name={FACETS.ITEMS_UPDATED_DATE}
        activeFilters={activeFilters}
        onChange={onChange}
        onClear={onClear}
      />
      <TagsFacet
        name={FACETS.ITEMS_TAGS}
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

ItemFilters.propTypes = {
  filterConfig: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
  data: PropTypes.object,
};

export default ItemFilters;
