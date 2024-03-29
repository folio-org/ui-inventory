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

import CheckboxFacet from '../../CheckboxFacet';
import HeldByFacet from '../../HeldByFacet';
import { MultiSelectionFacet } from '../../MultiSelectionFacet';
import {
  getSharedOptions,
  processFacetOptions,
} from '../../../facetUtils';
import {
  FACETS,
  FACETS_OPTIONS,
  FACETS_SETTINGS,
  FACETS_CQL,
  browseModeOptions,
  browseCallNumberOptions,
} from '../../../constants';
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
    [FACETS.SUBJECTS_SHARED]: activeFilters[FACETS.SUBJECTS_SHARED],
    [FACETS.SUBJECTS_HELD_BY]: activeFilters[FACETS.SUBJECTS_HELD_BY],
    [FACETS.EFFECTIVE_LOCATION]: activeFilters[FACETS.EFFECTIVE_LOCATION],
    [FACETS.NAME_TYPE]: activeFilters[FACETS.NAME_TYPE],
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
          accum[name] = getSharedOptions(activeFilters[FACETS.CONTRIBUTORS_SHARED], recordValues);
        }
        if (recordName === FACETS_CQL.INSTANCES_HELD_BY) {
          processFacetOptions(activeFilters[FACETS.CONTRIBUTORS_HELD_BY], consortiaTenants, ...commonProps);
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
            activeFilters={activeFilters}
            facetsOptions={facetsOptions}
            getIsPending={getIsPending}
            name={FACETS.CALL_NUMBERS_HELD_BY}
            onChange={onChange}
            onClear={onClear}
            onFetchFacets={handleFetchFacets}
            onFilterSearch={handleFilterSearch}
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
            activeFilters={activeFilters}
            facetsOptions={facetsOptions}
            getIsPending={getIsPending}
            name={FACETS.CONTRIBUTORS_HELD_BY}
            onChange={onChange}
            onClear={onClear}
            onFetchFacets={handleFetchFacets}
            onFilterSearch={handleFilterSearch}
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
            activeFilters={activeFilters}
            facetsOptions={facetsOptions}
            getIsPending={getIsPending}
            name={FACETS.SUBJECTS_HELD_BY}
            onChange={onChange}
            onClear={onClear}
            onFetchFacets={handleFetchFacets}
            onFilterSearch={handleFilterSearch}
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
