import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

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
  FACETS,
  HeldByFacet,
  CheckboxFacet,
  browseModeOptions,
  browseCallNumberOptions,
  browseClassificationOptions,
  useFacets,
  FACETS_TO_REQUEST,
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

  const stripes = useStripes();
  const intl = useIntl();
  const qindex = query.qindex;

  const isUserInMemberTenant = checkIfUserInMemberTenant(stripes);

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

  return (
    <AccordionSet
      accordionStatus={accordionStatus}
      onToggle={onToggleAccordion}
    >
      {Object.values(browseClassificationOptions).includes(qindex) && (
        isUserInMemberTenant && (
          <Accordion
            closedByDefault
            label={intl.formatMessage({ id: 'ui-inventory.filters.shared' })}
            id={FACETS.CLASSIFICATION_SHARED}
            name={FACETS.CLASSIFICATION_SHARED}
            separator={false}
            header={FilterAccordionHeader}
            displayClearButton={activeFilters[FACETS.CLASSIFICATION_SHARED]?.length > 0}
            onClearFilter={() => onClear(FACETS.CLASSIFICATION_SHARED)}
          >
            <CheckboxFacet
              name={FACETS.CLASSIFICATION_SHARED}
              dataOptions={facetOptions[FACETS_TO_REQUEST[FACETS.CLASSIFICATION_SHARED]]}
              selectedValues={activeFilters[FACETS.CLASSIFICATION_SHARED]}
              isPending={getIsLoading(FACETS.CLASSIFICATION_SHARED)}
              onChange={onChange}
            />
          </Accordion>
        )
      )}
      {Object.values(browseCallNumberOptions).includes(qindex) && (
        <>
          {isUserInMemberTenant && (
            <Accordion
              closedByDefault
              label={intl.formatMessage({ id: `ui-inventory.filters.${FACETS.SHARED}` })}
              id={FACETS.SHARED}
              name={FACETS.SHARED}
              separator={false}
              header={FilterAccordionHeader}
              displayClearButton={activeFilters[FACETS.SHARED]?.length > 0}
              onClearFilter={() => onClear(FACETS.SHARED)}
            >
              <CheckboxFacet
                name={FACETS.SHARED}
                dataOptions={facetOptions[FACETS_TO_REQUEST[FACETS.SHARED]]}
                selectedValues={activeFilters[FACETS.SHARED]}
                isPending={getIsLoading(FACETS.SHARED)}
                onChange={onChange}
              />
            </Accordion>
          )}
          <HeldByFacet
            name={FACETS.CALL_NUMBERS_HELD_BY}
            facetOptions={facetOptions}
            selectedValues={activeFilters[FACETS.CALL_NUMBERS_HELD_BY]}
            getIsLoading={getIsLoading}
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
              isPending={getIsLoading(FACETS.EFFECTIVE_LOCATION)}
              onFetch={onInputFocusAndMoreClick}
            />
          </Accordion>
        </>
      )}
      {qindex === browseModeOptions.CONTRIBUTORS && (
        <>
          {isUserInMemberTenant && (
            <Accordion
              label={intl.formatMessage({ id: `ui-inventory.filters.${FACETS.SHARED}` })}
              id={FACETS.CONTRIBUTORS_SHARED}
              name={FACETS.CONTRIBUTORS_SHARED}
              separator={false}
              header={FilterAccordionHeader}
              displayClearButton={activeFilters[FACETS.CONTRIBUTORS_SHARED]?.length > 0}
              onClearFilter={() => onClear(FACETS.CONTRIBUTORS_SHARED)}
            >
              <CheckboxFacet
                name={FACETS.CONTRIBUTORS_SHARED}
                dataOptions={facetOptions[FACETS_TO_REQUEST[FACETS.CONTRIBUTORS_SHARED]]}
                selectedValues={activeFilters[FACETS.CONTRIBUTORS_SHARED]}
                isPending={getIsLoading(FACETS.CONTRIBUTORS_SHARED)}
                onChange={onChange}
              />
            </Accordion>
          )}
          {/* Hide Held by facet for contributors and subjects browse until back-end requirements and implementation are done */}
          {/* <HeldByFacet
            name={FACETS.CONTRIBUTORS_HELD_BY}
            facetOptions={facetOptions}
            selectedValues={activeFilters[FACETS.CONTRIBUTORS_HELD_BY]}
            getIsLoading={getIsLoading}
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
            isPending={getIsLoading(FACETS.NAME_TYPE)}
          />
        </>
      )}
      {qindex === browseModeOptions.SUBJECTS && (
        <>
          {isUserInMemberTenant && (
            <Accordion
              label={intl.formatMessage({ id: `ui-inventory.filters.${FACETS.SHARED}` })}
              id={FACETS.SUBJECTS_SHARED}
              name={FACETS.SUBJECTS_SHARED}
              separator={false}
              header={FilterAccordionHeader}
              displayClearButton={activeFilters[FACETS.SUBJECTS_SHARED]?.length > 0}
              onClearFilter={() => onClear(FACETS.SUBJECTS_SHARED)}
            >
              <CheckboxFacet
                name={FACETS.SUBJECTS_SHARED}
                dataOptions={facetOptions[FACETS_TO_REQUEST[FACETS.SUBJECTS_SHARED]] || []}
                selectedValues={activeFilters[FACETS.SUBJECTS_SHARED]}
                isPending={getIsLoading(FACETS.SUBJECTS_SHARED)}
                onChange={onChange}
              />
            </Accordion>
          )}
          {/* Hide Held by facet for contributors and subjects browse until back-end requirements and implementation are done */}
          {/* <HeldByFacet
            name={FACETS.SUBJECTS_HELD_BY}
            facetOptions={facetOptions}
            selectedValues={activeFilters[FACETS.SUBJECTS_HELD_BY]}
            getIsLoading={getIsLoading}
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
