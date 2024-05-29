import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import _ from 'lodash';

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
  FACETS_CQL,
  FACETS_OPTIONS,
  FACETS_SETTINGS,
  HeldByFacet,
  CheckboxFacet,
  browseModeOptions,
  browseCallNumberOptions,
  browseClassificationOptions,
} from '@folio/stripes-inventory-components';

import { MultiSelectionFacet } from '../../MultiSelectionFacet';
import {
  getSharedOptions,
  processFacetOptions,
} from '../../../facetUtils';
import { useFacets } from '../../../common/hooks';

const InstanceFiltersBrowse = props => {
  const {
    activeFilters,
    data: {
      locations,
      browseType,
      contributorNameTypes,
      consortiaTenants,
    },
    onChange,
    onClear,
  } = props;

  const stripes = useStripes();
  const intl = useIntl();

  const isUserInMemberTenant = checkIfUserInMemberTenant(stripes);

  const segmentAccordions = {
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

  const segmentOptions = {
    [FACETS_OPTIONS.SHARED_OPTIONS]: [],
    [FACETS_OPTIONS.HELD_BY_OPTIONS]: [],
    [FACETS_OPTIONS.EFFECTIVE_LOCATION_OPTIONS]: [],
    [FACETS_OPTIONS.NAME_TYPE_OPTIONS]: [],
  };

  const selectedFacetFilters = {
    [FACETS.SHARED]: activeFilters[FACETS.SHARED],
    [FACETS.CALL_NUMBERS_HELD_BY]: activeFilters[FACETS.CALL_NUMBERS_HELD_BY],
    [FACETS.CONTRIBUTORS_SHARED]: activeFilters[FACETS.CONTRIBUTORS_SHARED],
    [FACETS.CONTRIBUTORS_HELD_BY]: activeFilters[FACETS.CONTRIBUTORS_HELD_BY],
    [FACETS.CLASSIFICATION_SHARED]: activeFilters[FACETS.CLASSIFICATION_SHARED],
    [FACETS.SUBJECTS_SHARED]: activeFilters[FACETS.SUBJECTS_SHARED],
    [FACETS.SUBJECTS_HELD_BY]: activeFilters[FACETS.SUBJECTS_HELD_BY],
    [FACETS.EFFECTIVE_LOCATION]: activeFilters[FACETS.EFFECTIVE_LOCATION],
    [FACETS.NAME_TYPE]: activeFilters[FACETS.NAME_TYPE],
  };

  // When a facet option is selected, and then another one is selected from another facet, the first selected
  // facet option may become with count 0, and it should still be visible and moved to the bottom of the
  // provided options. The `sharedFacetMap` helps to get the correct facet name using the selected search option.
  const sharedFacetMap = {
    [browseModeOptions.CLASSIFICATION_ALL]: FACETS.CLASSIFICATION_SHARED,
    [browseModeOptions.DEWEY_CLASSIFICATION]: FACETS.CLASSIFICATION_SHARED,
    [browseModeOptions.LC_CLASSIFICATION]: FACETS.CLASSIFICATION_SHARED,
    [browseModeOptions.CONTRIBUTORS]: FACETS.CONTRIBUTORS_SHARED,
    [browseModeOptions.SUBJECTS]: FACETS.SUBJECTS_SHARED,
  };

  const heldByFacetMap = {
    [browseModeOptions.CONTRIBUTORS]: FACETS.CONTRIBUTORS_HELD_BY,
    [browseModeOptions.SUBJECTS]: FACETS.SUBJECTS_HELD_BY,
  };

  const getNewRecords = (records) => {
    return _.reduce(FACETS_SETTINGS, (accum, name, recordName) => {
      if (records[recordName]) {
        const recordValues = records[recordName].values;
        const commonProps = [recordValues, accum, name];

        if (recordName === FACETS_CQL.EFFECTIVE_LOCATION) {
          processFacetOptions(activeFilters[FACETS.EFFECTIVE_LOCATION], locations, ...commonProps);
        }
        if (recordName === FACETS_CQL.NAME_TYPE) {
          processFacetOptions(activeFilters[FACETS.NAME_TYPE], contributorNameTypes, ...commonProps);
        }
        if (recordName === FACETS_CQL.INSTANCES_SHARED) {
          const facetName = sharedFacetMap[browseType];

          accum[name] = getSharedOptions(activeFilters[facetName], recordValues);
        }
        if (recordName === FACETS_CQL.INSTANCES_HELD_BY) {
          const facetName = heldByFacetMap[browseType];

          processFacetOptions(activeFilters[facetName], consortiaTenants, ...commonProps);
        }
        if (recordName === FACETS_CQL.SHARED) {
          accum[name] = getSharedOptions(activeFilters[FACETS.SHARED], recordValues);
        }
        if (recordName === FACETS_CQL.HELD_BY) {
          processFacetOptions(activeFilters[FACETS.CALL_NUMBERS_HELD_BY], consortiaTenants, ...commonProps);
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
    onUnregisterAccordion,
  ] = useFacets(
    segmentAccordions,
    segmentOptions,
    selectedFacetFilters,
    getNewRecords,
    props.data,
    false,
  );

  return (
    <AccordionSet
      accordionStatus={accordions}
      onToggle={onToggleSection}
      onUnregisterAccordion={onUnregisterAccordion}
    >
      {Object.values(browseClassificationOptions).includes(browseType) && (
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
              dataOptions={facetsOptions[FACETS_OPTIONS.SHARED_OPTIONS] || []}
              selectedValues={activeFilters[FACETS.CLASSIFICATION_SHARED]}
              isPending={getIsPending(FACETS.CLASSIFICATION_SHARED)}
              onChange={onChange}
            />
          </Accordion>
        )
      )}
      {Object.values(browseCallNumberOptions).includes(browseType) && (
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
                dataOptions={facetsOptions[FACETS_OPTIONS.SHARED_OPTIONS] || []}
                selectedValues={activeFilters[FACETS.SHARED]}
                isPending={getIsPending(FACETS.SHARED)}
                onChange={onChange}
              />
            </Accordion>
          )}
          <HeldByFacet
            name={FACETS.CALL_NUMBERS_HELD_BY}
            facetsOptions={facetsOptions}
            selectedValues={activeFilters[FACETS.CALL_NUMBERS_HELD_BY]}
            onChange={onChange}
            onClear={onClear}
            onFetchFacets={handleFetchFacets}
            onFilterSearch={handleFilterSearch}
            onGetIsPending={getIsPending}
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
              dataOptions={facetsOptions[FACETS_OPTIONS.EFFECTIVE_LOCATION_OPTIONS]}
              selectedValues={activeFilters[FACETS.EFFECTIVE_LOCATION]}
              onChange={onChange}
              onSearch={handleFilterSearch}
              isFilterable
              isPending={getIsPending(FACETS.EFFECTIVE_LOCATION)}
              onFetch={handleFetchFacets}
            />
          </Accordion>
        </>
      )}
      {browseType === browseModeOptions.CONTRIBUTORS && (
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
                dataOptions={facetsOptions[FACETS_OPTIONS.SHARED_OPTIONS] || []}
                selectedValues={activeFilters[FACETS.CONTRIBUTORS_SHARED]}
                isPending={getIsPending(FACETS.CONTRIBUTORS_SHARED)}
                onChange={onChange}
              />
            </Accordion>
          )}
          {/* Hide Held by facet for contributors and subjects browse until back-end requirements and implementation are done */}
          {/* <HeldByFacet
            name={FACETS.CONTRIBUTORS_HELD_BY}
            facetsOptions={facetsOptions}
            selectedValues={activeFilters[FACETS.CONTRIBUTORS_HELD_BY]}
            onChange={onChange}
            onClear={onClear}
            onFetchFacets={handleFetchFacets}
            onFilterSearch={handleFilterSearch}
            onGetIsPending={getIsPending}
          /> */}
          <MultiSelectionFacet
            id={FACETS.NAME_TYPE}
            label={intl.formatMessage({ id: `ui-inventory.filters.${FACETS.NAME_TYPE}` })}
            name={FACETS.NAME_TYPE}
            closedByDefault
            options={facetsOptions[FACETS_OPTIONS.NAME_TYPE_OPTIONS]}
            selectedValues={activeFilters[FACETS.NAME_TYPE]}
            onFilterChange={onChange}
            onClearFilter={() => onClear(FACETS.NAME_TYPE)}
            displayClearButton={!!activeFilters[FACETS.NAME_TYPE]?.length}
            isPending={getIsPending(FACETS.NAME_TYPE)}
          />
        </>
      )}
      {browseType === browseModeOptions.SUBJECTS && (
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
                dataOptions={facetsOptions[FACETS_OPTIONS.SHARED_OPTIONS] || []}
                selectedValues={activeFilters[FACETS.SUBJECTS_SHARED]}
                isPending={getIsPending(FACETS.SUBJECTS_SHARED)}
                onChange={onChange}
              />
            </Accordion>
          )}
          {/* Hide Held by facet for contributors and subjects browse until back-end requirements and implementation are done */}
          {/* <HeldByFacet
            name={FACETS.SUBJECTS_HELD_BY}
            facetsOptions={facetsOptions}
            selectedValues={activeFilters[FACETS.SUBJECTS_HELD_BY]}
            onChange={onChange}
            onClear={onClear}
            onFetchFacets={handleFetchFacets}
            onFilterSearch={handleFilterSearch}
            onGetIsPending={getIsPending}
          /> */}
        </>
      )}
    </AccordionSet>
  );
};

export default InstanceFiltersBrowse;

InstanceFiltersBrowse.propTypes = {
  activeFilters: PropTypes.object,
  onChange: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
  data: PropTypes.object,
};

InstanceFiltersBrowse.defaultProps = {
  activeFilters: {},
};
