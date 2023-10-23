import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
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

import TagsFilter from '../TagsFilter';
import CheckboxFacet from '../CheckboxFacet';
import HeldByFacet from '../HeldByFacet';
import DateRangeFilter from '../DateRangeFilter';
import {
  getSourceOptions,
  getSharedOptions,
  getSuppressedOptions,
  processFacetOptions,
  processStatisticalCodes,
} from '../../facetUtils';
import {
  DATE_FORMAT,
  FACETS,
  FACETS_OPTIONS,
  FACETS_SETTINGS,
  FACETS_CQL,
} from '../../constants';
import { useFacets } from '../../common/hooks';
import { languageOptionsES } from './languages';
import {
  makeDateRangeFilterString,
  retrieveDatesFromDateRangeFilterString,
} from '../../utils';


const InstanceFilters = props => {
  const {
    activeFilters,
    data: {
      locations,
      resourceTypes,
      instanceFormats,
      instanceStatuses,
      modesOfIssuance,
      statisticalCodes,
      natureOfContentTerms,
      consortiaTenants,
    },
    onChange,
    onClear,
  } = props;

  const stripes = useStripes();
  const intl = useIntl();

  const segmentAccordions = {
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

  const segmentOptions = {
    [FACETS_OPTIONS.SHARED_OPTIONS]: [],
    [FACETS_OPTIONS.HELD_BY_OPTIONS]: [],
    [FACETS_OPTIONS.EFFECTIVE_LOCATION_OPTIONS]: [],
    [FACETS_OPTIONS.LANG_OPTIONS]: [],
    [FACETS_OPTIONS.RESOURCE_TYPE_OPTIONS]: [],
    [FACETS_OPTIONS.FORMAT_OPTIONS]: [],
    [FACETS_OPTIONS.MODE_OF_ISSUANCE_OPTIONS]: [],
    [FACETS_OPTIONS.NATURE_OF_CONTENT_OPTIONS]: [],
    [FACETS_OPTIONS.SUPPRESSED_OPTIONS]: [],
    [FACETS_OPTIONS.INSTANCES_DISCOVERY_SUPPRESS_OPTIONS]: [],
    [FACETS_OPTIONS.SOURCE_OPTIONS]: [],
    [FACETS_OPTIONS.STATUSES_OPTIONS]: [],
    [FACETS_OPTIONS.INSTANCES_TAGS_OPTIONS]: [],
    [FACETS_OPTIONS.STATISTICAL_CODES_OPTIONS]: [],
  };

  const selectedFacetFilters = {
    [FACETS.SHARED]: activeFilters[FACETS.SHARED],
    [FACETS.HELD_BY]: activeFilters[FACETS.HELD_BY],
    [FACETS.EFFECTIVE_LOCATION]: activeFilters[FACETS.EFFECTIVE_LOCATION],
    [FACETS.LANGUAGE]: activeFilters[FACETS.LANGUAGE],
    [FACETS.RESOURCE]: activeFilters[FACETS.RESOURCE],
    [FACETS.FORMAT]: activeFilters[FACETS.FORMAT],
    [FACETS.MODE]: activeFilters[FACETS.MODE],
    [FACETS.NATURE_OF_CONTENT]: activeFilters[FACETS.NATURE_OF_CONTENT],
    [FACETS.STAFF_SUPPRESS]: activeFilters[FACETS.STAFF_SUPPRESS],
    [FACETS.INSTANCES_DISCOVERY_SUPPRESS]: activeFilters[FACETS.INSTANCES_DISCOVERY_SUPPRESS],
    [FACETS.CREATED_DATE]: activeFilters[FACETS.CREATED_DATE],
    [FACETS.UPDATED_DATE]: activeFilters[FACETS.UPDATED_DATE],
    [FACETS.SOURCE]: activeFilters[FACETS.SOURCE],
    [FACETS.STATUS]: activeFilters[FACETS.STATUS],
    [FACETS.INSTANCES_TAGS]: activeFilters[FACETS.INSTANCES_TAGS],
    [FACETS.STATISTICAL_CODE_IDS]: activeFilters[FACETS.STATISTICAL_CODE_IDS],
  };

  const getNewRecords = (records) => {
    return _.reduce(FACETS_SETTINGS, (accum, name, recordName) => {
      if (records[recordName]) {
        const recordValues = records[recordName].values;
        const commonProps = [recordValues, accum, name];

        switch (recordName) {
          case FACETS_CQL.SHARED:
            accum[name] = getSharedOptions(activeFilters[FACETS.SHARED], recordValues);
            break;
          case FACETS_CQL.HELD_BY:
            processFacetOptions(activeFilters[FACETS.HELD_BY], consortiaTenants, ...commonProps);
            break;
          case FACETS_CQL.EFFECTIVE_LOCATION:
            processFacetOptions(activeFilters[FACETS.EFFECTIVE_LOCATION], locations, ...commonProps);
            break;
          case FACETS_CQL.LANGUAGES:
            accum[name] = languageOptionsES(activeFilters[FACETS.LANGUAGE], intl, recordValues);
            break;
          case FACETS_CQL.INSTANCE_TYPE:
            processFacetOptions(activeFilters[FACETS.RESOURCE], resourceTypes, ...commonProps);
            break;
          case FACETS_CQL.INSTANCE_FORMAT:
            processFacetOptions(activeFilters[FACETS.FORMAT], instanceFormats, ...commonProps);
            break;
          case FACETS_CQL.MODE_OF_ISSUANCE:
            processFacetOptions(activeFilters[FACETS.MODE], modesOfIssuance, ...commonProps);
            break;
          case FACETS_CQL.NATURE_OF_CONTENT:
            processFacetOptions(activeFilters[FACETS.NATURE_OF_CONTENT], natureOfContentTerms, ...commonProps);
            break;
          case FACETS_CQL.STAFF_SUPPRESS:
            accum[name] = getSuppressedOptions(activeFilters[FACETS.STAFF_SUPPRESS], recordValues);
            break;
          case FACETS_CQL.INSTANCES_DISCOVERY_SUPPRESS:
            accum[name] = getSuppressedOptions(activeFilters[FACETS.INSTANCES_DISCOVERY_SUPPRESS], recordValues);
            break;
          case FACETS_CQL.SOURCE:
            accum[name] = getSourceOptions(activeFilters[FACETS.SOURCE], recordValues);
            break;
          case FACETS_CQL.STATUS:
            processFacetOptions(activeFilters[FACETS.STATUS], instanceStatuses, ...commonProps);
            break;
          case FACETS_CQL.STATISTICAL_CODE_IDS:
            processStatisticalCodes(activeFilters[FACETS.STATISTICAL_CODE_IDS], statisticalCodes, ...commonProps);
            break;
          case FACETS_CQL.INSTANCES_TAGS:
            accum[name] = getSourceOptions(activeFilters[FACETS.INSTANCES_TAGS], recordValues);
            break;
          default:
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
  ] = useFacets(
    segmentAccordions,
    segmentOptions,
    selectedFacetFilters,
    getNewRecords,
    props.data
  );

  const isUserInMemberTenant = checkIfUserInMemberTenant(stripes);

  return (
    <AccordionSet accordionStatus={accordions} onToggle={onToggleSection}>
      {isUserInMemberTenant && (
        <Accordion
          label={<FormattedMessage id={`ui-inventory.filters.${FACETS.SHARED}`} />}
          id={FACETS.SHARED}
          name={FACETS.SHARED}
          separator={false}
          header={FilterAccordionHeader}
          displayClearButton={activeFilters[FACETS.SHARED]?.length > 0}
          onClearFilter={() => onClear(FACETS.SHARED)}
        >
          <CheckboxFacet
            data-test-filter-item-shared
            name={FACETS.SHARED}
            dataOptions={facetsOptions[FACETS_OPTIONS.SHARED_OPTIONS]}
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
        name={FACETS.HELD_BY}
        onChange={onChange}
        onClear={onClear}
        onFetchFacets={handleFetchFacets}
        onFilterSearch={handleFilterSearch}
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
          dataOptions={facetsOptions[FACETS_OPTIONS.EFFECTIVE_LOCATION_OPTIONS]}
          selectedValues={activeFilters[FACETS.EFFECTIVE_LOCATION]}
          onChange={onChange}
          onSearch={handleFilterSearch}
          isFilterable
          isPending={getIsPending(FACETS.EFFECTIVE_LOCATION)}
          onFetch={handleFetchFacets}
        />
      </Accordion>
      <Accordion
        label={<FormattedMessage id={`ui-inventory.instances.${FACETS.LANGUAGE}`} />}
        id={FACETS.LANGUAGE}
        name={FACETS.LANGUAGE}
        closedByDefault
        header={FilterAccordionHeader}
        displayClearButton={activeFilters[FACETS.LANGUAGE]?.length > 0}
        onClearFilter={() => onClear(FACETS.LANGUAGE)}
      >
        <CheckboxFacet
          name={FACETS.LANGUAGE}
          dataOptions={facetsOptions[FACETS_OPTIONS.LANG_OPTIONS]}
          selectedValues={activeFilters[FACETS.LANGUAGE]}
          onChange={onChange}
          onSearch={handleFilterSearch}
          isFilterable
          isPending={getIsPending(FACETS.LANGUAGE)}
          onFetch={handleFetchFacets}
        />
      </Accordion>
      <Accordion
        label={<FormattedMessage id="ui-inventory.instances.resourceType" />}
        id={FACETS.RESOURCE}
        name={FACETS.RESOURCE}
        closedByDefault
        header={FilterAccordionHeader}
        displayClearButton={activeFilters[FACETS.RESOURCE]?.length > 0}
        onClearFilter={() => onClear(FACETS.RESOURCE)}
      >
        <CheckboxFacet
          name={FACETS.RESOURCE}
          dataOptions={facetsOptions[FACETS_OPTIONS.RESOURCE_TYPE_OPTIONS]}
          selectedValues={activeFilters[FACETS.RESOURCE]}
          onChange={onChange}
          onSearch={handleFilterSearch}
          isFilterable
          isPending={getIsPending(FACETS.RESOURCE)}
          onFetch={handleFetchFacets}
        />
      </Accordion>
      <Accordion
        label={<FormattedMessage id="ui-inventory.instanceFormat" />}
        id={FACETS.FORMAT}
        name={FACETS.FORMAT}
        closedByDefault
        header={FilterAccordionHeader}
        displayClearButton={activeFilters[FACETS.FORMAT]?.length > 0}
        onClearFilter={() => onClear(FACETS.FORMAT)}
      >
        <CheckboxFacet
          name={FACETS.FORMAT}
          dataOptions={facetsOptions[FACETS_OPTIONS.FORMAT_OPTIONS]}
          selectedValues={activeFilters[FACETS.FORMAT]}
          onChange={onChange}
          onSearch={handleFilterSearch}
          isFilterable
          isPending={getIsPending(FACETS.FORMAT)}
          onFetch={handleFetchFacets}
        />
      </Accordion>
      <Accordion
        label={<FormattedMessage id="ui-inventory.modeOfIssuance" />}
        id={FACETS.MODE}
        name={FACETS.MODE}
        closedByDefault
        header={FilterAccordionHeader}
        displayClearButton={activeFilters[FACETS.MODE]?.length > 0}
        onClearFilter={() => onClear(FACETS.MODE)}
      >
        <CheckboxFacet
          name={FACETS.MODE}
          dataOptions={facetsOptions[FACETS_OPTIONS.MODE_OF_ISSUANCE_OPTIONS]}
          selectedValues={activeFilters[FACETS.MODE]}
          onChange={onChange}
          onSearch={handleFilterSearch}
          isFilterable
          isPending={getIsPending(FACETS.MODE)}
          onFetch={handleFetchFacets}
        />
      </Accordion>
      <Accordion
        label={<FormattedMessage id="ui-inventory.natureOfContentTerms" />}
        id={FACETS.NATURE_OF_CONTENT}
        name={FACETS.NATURE_OF_CONTENT}
        closedByDefault
        header={FilterAccordionHeader}
        displayClearButton={activeFilters[FACETS.NATURE_OF_CONTENT]?.length > 0}
        onClearFilter={() => onClear(FACETS.NATURE_OF_CONTENT)}
      >
        <CheckboxFacet
          name={FACETS.NATURE_OF_CONTENT}
          dataOptions={facetsOptions[FACETS_OPTIONS.NATURE_OF_CONTENT_OPTIONS]}
          selectedValues={activeFilters[FACETS.NATURE_OF_CONTENT]}
          onChange={onChange}
          onSearch={handleFilterSearch}
          isFilterable
          isPending={getIsPending(FACETS.NATURE_OF_CONTENT)}
          onFetch={handleFetchFacets}
        />
      </Accordion>
      <Accordion
        label={<FormattedMessage id={`ui-inventory.${FACETS.STAFF_SUPPRESS}`} />}
        id={FACETS.STAFF_SUPPRESS}
        name={FACETS.STAFF_SUPPRESS}
        closedByDefault
        header={FilterAccordionHeader}
        displayClearButton={activeFilters[FACETS.STAFF_SUPPRESS]?.length > 0}
        onClearFilter={() => onClear(FACETS.STAFF_SUPPRESS)}
      >
        <CheckboxFacet
          name={FACETS.STAFF_SUPPRESS}
          dataOptions={facetsOptions[FACETS_OPTIONS.SUPPRESSED_OPTIONS]}
          selectedValues={activeFilters[FACETS.STAFF_SUPPRESS]}
          isPending={getIsPending(FACETS.STAFF_SUPPRESS)}
          onChange={onChange}
        />
      </Accordion>
      <Accordion
        label={<FormattedMessage id="ui-inventory.discoverySuppress" />}
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
          dataOptions={facetsOptions[FACETS_OPTIONS.INSTANCES_DISCOVERY_SUPPRESS_OPTIONS]}
          selectedValues={activeFilters[FACETS.INSTANCES_DISCOVERY_SUPPRESS]}
          isPending={getIsPending(FACETS.INSTANCES_DISCOVERY_SUPPRESS)}
          onChange={onChange}
        />
      </Accordion>
      <Accordion
        label={<FormattedMessage id="ui-inventory.statisticalCode" />}
        id={FACETS.STATISTICAL_CODE_IDS}
        name={FACETS.STATISTICAL_CODE_IDS}
        closedByDefault
        header={FilterAccordionHeader}
        displayClearButton={activeFilters[FACETS.STATISTICAL_CODE_IDS]?.length > 0}
        onClearFilter={() => onClear(FACETS.STATISTICAL_CODE_IDS)}
      >
        <CheckboxFacet
          name={FACETS.STATISTICAL_CODE_IDS}
          dataOptions={facetsOptions[FACETS_OPTIONS.STATISTICAL_CODES_OPTIONS]}
          selectedValues={activeFilters[FACETS.STATISTICAL_CODE_IDS]}
          onChange={onChange}
          onSearch={handleFilterSearch}
          isFilterable
          isPending={getIsPending(FACETS.STATISTICAL_CODE_IDS)}
          onFetch={handleFetchFacets}
        />
      </Accordion>
      <Accordion
        label={<FormattedMessage id={`ui-inventory.${FACETS.CREATED_DATE}`} />}
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
        label={<FormattedMessage id={`ui-inventory.${FACETS.UPDATED_DATE}`} />}
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
        label={<FormattedMessage id="ui-inventory.instanceStatusShort" />}
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
          dataOptions={facetsOptions[FACETS_OPTIONS.STATUSES_OPTIONS]}
          selectedValues={activeFilters[FACETS.STATUS]}
          isPending={getIsPending(FACETS.STATUS)}
          onChange={onChange}
          isFilterable
          onSearch={handleFilterSearch}
          onFetch={handleFetchFacets}
        />
      </Accordion>
      <Accordion
        label={<FormattedMessage id={`ui-inventory.${FACETS.SOURCE}`} />}
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
          dataOptions={facetsOptions[FACETS_OPTIONS.SOURCE_OPTIONS]}
          selectedValues={activeFilters[FACETS.SOURCE]}
          isPending={getIsPending(FACETS.SOURCE)}
          onChange={onChange}
        />
      </Accordion>
      <TagsFilter
        id={FACETS.INSTANCES_TAGS}
        name={FACETS.INSTANCES_TAGS}
        onChange={onChange}
        onClear={onClear}
        selectedValues={activeFilters[FACETS.INSTANCES_TAGS]}
        isPending={getIsPending(FACETS.INSTANCES_TAGS)}
        tagsRecords={facetsOptions[FACETS_OPTIONS.INSTANCES_TAGS_OPTIONS]}
        onFetch={handleFetchFacets}
        onSearch={handleFilterSearch}
      />
    </AccordionSet>
  );
};

export default InstanceFilters;

InstanceFilters.propTypes = {
  activeFilters: PropTypes.object,
  onChange: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
  data: PropTypes.object,
};

InstanceFilters.defaultProps = {
  activeFilters: {},
};
