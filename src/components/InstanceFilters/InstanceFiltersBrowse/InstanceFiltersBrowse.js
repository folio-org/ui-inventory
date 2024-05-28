import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import {
  Accordion,
  AccordionSet,
  FilterAccordionHeader,
} from '@folio/stripes/components';
import {
  FACETS,
  HeldByFacet,
  CheckboxFacet,
  browseModeOptions,
  browseCallNumberOptions,
  browseClassificationOptions,
  useFacets,
  FACETS_TO_REQUEST,
  SharedFacet,
} from '@folio/stripes-inventory-components';

import { omit } from 'lodash';
import { MultiSelectionFacet } from '../../MultiSelectionFacet';

const InstanceFiltersBrowse = props => {
  const {
    filterConfig,
    data: {
      query,
    },
    onChange,
    onClear,
  } = props;

  const intl = useIntl();
  const qindex = query.qindex;

  const initialAccordionStates = {
    [FACETS.SHARED]: false,
    [FACETS.CALL_NUMBERS_HELD_BY]: false,
    [FACETS.CLASSIFICATION_SHARED]: false,
    [FACETS.CONTRIBUTORS_SHARED]: false,
    [FACETS.CONTRIBUTORS_HELD_BY]: false,
    [FACETS.SUBJECTS_SHARED]: false,
    [FACETS.SUBJECTS_HELD_BY]: false,
    [FACETS.EFFECTIVE_LOCATION]: false,
    [FACETS.NAME_TYPE]: false,
  };

  const activeFilters = useMemo(() => omit(query || {}, ['qindex', 'query']), [query]);

  const {
    accordionStatus,
    facetOptions,
    onIsLoading,
    onToggleAccordion,
    onInputFocusAndMoreClick,
    onFacetOptionSearch,
  } = useFacets({
    initialAccordionStates,
    query,
    isBrowseLookup: true,
    filterConfig,
    activeFilters,
    data: props.data,
  });

  const renderSharedFacet = (name) => (
    <SharedFacet
      name={name}
      activeFilters={activeFilters}
      facetOptions={facetOptions}
      onChange={onChange}
      onClear={onClear}
      onIsLoading={onIsLoading}
    />
  );

  return (
    <AccordionSet
      accordionStatus={accordionStatus}
      onToggle={onToggleAccordion}
    >
      {Object.values(browseClassificationOptions).includes(qindex) && (
        renderSharedFacet(FACETS.CLASSIFICATION_SHARED)
      )}
      {Object.values(browseCallNumberOptions).includes(qindex) && (
        <>
          {renderSharedFacet(FACETS.SHARED)}
          <HeldByFacet
            name={FACETS.CALL_NUMBERS_HELD_BY}
            facetOptions={facetOptions}
            selectedValues={activeFilters[FACETS.CALL_NUMBERS_HELD_BY]}
            onIsLoading={onIsLoading}
            onChange={onChange}
            onClear={onClear}
            onFetchFacets={onInputFocusAndMoreClick}
            onSearch={onFacetOptionSearch}
          />
          <Accordion
            closedByDefault
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
              isPending={onIsLoading(FACETS.EFFECTIVE_LOCATION)}
              onFetch={onInputFocusAndMoreClick}
            />
          </Accordion>
        </>
      )}
      {qindex === browseModeOptions.CONTRIBUTORS && (
        <>
          {renderSharedFacet(FACETS.CONTRIBUTORS_SHARED)}
          {/* Hide Held by facet for contributors and subjects browse until back-end requirements and implementation are done */}
          {/* <HeldByFacet
            name={FACETS.CONTRIBUTORS_HELD_BY}
            facetOptions={facetOptions}
            selectedValues={activeFilters[FACETS.CONTRIBUTORS_HELD_BY]}
            onIsLoading={onIsLoading}
            onChange={onChange}
            onClear={onClear}
            onFetchFacets={onInputFocusAndMoreClick}
            onSearch={onFacetOptionSearch}
          /> */}
          <MultiSelectionFacet
            id={FACETS.NAME_TYPE}
            label={intl.formatMessage({ id: `ui-inventory.filters.${FACETS.NAME_TYPE}` })}
            name={FACETS.NAME_TYPE}
            closedByDefault
            options={facetOptions[FACETS_TO_REQUEST[FACETS.NAME_TYPE]]}
            selectedValues={activeFilters[FACETS.NAME_TYPE]}
            onFilterChange={onChange}
            onClearFilter={() => onClear(FACETS.NAME_TYPE)}
            displayClearButton={!!activeFilters[FACETS.NAME_TYPE]?.length}
            isPending={onIsLoading(FACETS.NAME_TYPE)}
          />
        </>
      )}
      {qindex === browseModeOptions.SUBJECTS && (
        <>
          {renderSharedFacet(FACETS.SUBJECTS_SHARED)}
          {/* Hide Held by facet for contributors and subjects browse until back-end requirements and implementation are done */}
          {/* <HeldByFacet
            name={FACETS.SUBJECTS_HELD_BY}
            facetOptions={facetOptions}
            selectedValues={activeFilters[FACETS.SUBJECTS_HELD_BY]}
            onIsLoading={onIsLoading}
            onChange={onChange}
            onClear={onClear}
            onFetchFacets={onInputFocusAndMoreClick}
            onSearch={onFacetOptionSearch}
          /> */}
        </>
      )}
    </AccordionSet>
  );
};

export default InstanceFiltersBrowse;

InstanceFiltersBrowse.propTypes = {
  filterConfig: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
  data: PropTypes.object,
};
