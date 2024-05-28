import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import omit from 'lodash/omit';

import { AccordionSet } from '@folio/stripes/components';
import {
  FACETS,
  HeldByFacet,
  browseModeOptions,
  browseCallNumberOptions,
  browseClassificationOptions,
  useFacets,
  FACETS_TO_REQUEST,
  SharedFacet,
  EffectiveLocationFacet,
} from '@folio/stripes-inventory-components';

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
    getIsLoading,
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
      getIsLoading={getIsLoading}
    />
  );

  const renderHeldByFacet = (name) => (
    <HeldByFacet
      name={name}
      activeFilters={activeFilters}
      facetOptions={facetOptions}
      getIsLoading={getIsLoading}
      onChange={onChange}
      onClear={onClear}
      onFetch={onInputFocusAndMoreClick}
      onSearch={onFacetOptionSearch}
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
          {renderHeldByFacet(FACETS.CALL_NUMBERS_HELD_BY)}
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
        </>
      )}
      {qindex === browseModeOptions.CONTRIBUTORS && (
        <>
          {renderSharedFacet(FACETS.CONTRIBUTORS_SHARED)}
          {/* Hide Held by facet for contributors and subjects browse until back-end requirements and implementation are done */}
          {/* {renderHeldByFacet(FACETS.CONTRIBUTORS_HELD_BY)} */}
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
            isPending={getIsLoading(FACETS.NAME_TYPE)}
          />
        </>
      )}
      {qindex === browseModeOptions.SUBJECTS && (
        <>
          {renderSharedFacet(FACETS.SUBJECTS_SHARED)}
          {/* Hide Held by facet for contributors and subjects browse until back-end requirements and implementation are done */}
          {/* {renderHeldByFacet(FACETS.SUBJECTS_HELD_BY)} */}
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
