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
          onSearch={onFacetOptionSearch}
          onFetch={onInputFocusAndMoreClick}
          isPending={getIsLoading(FACETS.HOLDINGS_PERMANENT_LOCATION)}
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
          dataOptions={facetOptions[FACETS_TO_REQUEST[FACETS.MATERIAL_TYPE]]}
          selectedValues={activeFilters[FACETS.MATERIAL_TYPE]}
          onChange={onChange}
          onSearch={onFacetOptionSearch}
          onFetch={onInputFocusAndMoreClick}
          isPending={getIsLoading(FACETS.MATERIAL_TYPE)}
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
          dataOptions={facetOptions[FACETS_TO_REQUEST[FACETS.ITEMS_DISCOVERY_SUPPRESS]]}
          selectedValues={activeFilters[FACETS.ITEMS_DISCOVERY_SUPPRESS]}
          onChange={onChange}
          isPending={getIsLoading(FACETS.ITEMS_DISCOVERY_SUPPRESS)}
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
          dataOptions={facetOptions[FACETS_TO_REQUEST[FACETS.ITEMS_STATISTICAL_CODE_IDS]]}
          selectedValues={activeFilters[FACETS.ITEMS_STATISTICAL_CODE_IDS]}
          onChange={onChange}
          onSearch={onFacetOptionSearch}
          isFilterable
          isPending={getIsLoading(FACETS.ITEMS_STATISTICAL_CODE_IDS)}
          onFetch={onInputFocusAndMoreClick}
        />
      </Accordion>
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
