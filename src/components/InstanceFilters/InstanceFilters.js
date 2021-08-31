import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import _ from 'lodash';

import {
  Accordion,
  AccordionSet,
  FilterAccordionHeader,
} from '@folio/stripes/components';

import TagsFilter from '../TagsFilter';
import CheckboxFacet from '../CheckboxFacet';
import {
  getSourceOptions,
  getSuppressedOptions,
  processFacetOptions
} from '../../facetUtils';
import {
  FACETS,
  FACETS_OPTIONS,
  FACETS_SETTINGS,
  FACETS_CQL,
} from '../../constants';
import { useFacets } from '../../common/hooks';
import { languageOptionsES } from './languages';

const InstanceFilters = props => {
  const {
    activeFilters,
    data: {
      locations,
      resourceTypes,
      instanceFormats,
      modesOfIssuance,
      natureOfContentTerms,
      tagsRecords,
    },
    onChange,
    onClear,
  } = props;

  const intl = useIntl();

  const segmentAccordions = {
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
    [FACETS.INSTANCES_TAGS]: false,
  };

  const segmentOptions = {
    [FACETS_OPTIONS.EFFECTIVE_LOCATION_OPTIONS]: [],
    [FACETS_OPTIONS.LANG_OPTIONS]: [],
    [FACETS_OPTIONS.RESOURCE_TYPE_OPTIONS]: [],
    [FACETS_OPTIONS.FORMAT_OPTIONS]: [],
    [FACETS_OPTIONS.MODE_OF_ISSUANCE_OPTIONS]: [],
    [FACETS_OPTIONS.NATURE_OF_CONTENT_OPTIONS]: [],
    [FACETS_OPTIONS.SUPPRESSED_OPTIONS]: [],
    [FACETS_OPTIONS.INSTANCES_DISCOVERY_SUPPRESS_OPTIONS]: [],
    [FACETS_OPTIONS.SOURCE_OPTIONS]: [],
    [FACETS_OPTIONS.INSTANCES_TAGS_OPTIONS]: [],
  };

  const selectedFacetFilters = {
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
    [FACETS.INSTANCES_TAGS]: activeFilters[FACETS.INSTANCES_TAGS],
  };

  const getNewRecords = (records) => {
    return _.reduce(FACETS_SETTINGS, (accum, name, recordName) => {
      if (records[recordName]) {
        const recordValues = records[recordName].values;
        const commonProps = [recordValues, accum, name];

        switch (recordName) {
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
          case FACETS_CQL.INSTANCES_TAGS:
            processFacetOptions(activeFilters[FACETS.INSTANCES_TAGS], tagsRecords, ...commonProps, 'label');
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

  return (
    <AccordionSet accordionStatus={accordions} onToggle={onToggleSection}>
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
        separator={false}
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
      {
        // uncomment when BE side is ready

        /*
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
        */
      }
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
  activeFilters: PropTypes.objectOf(PropTypes.array),
  onChange: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
  data: PropTypes.object,
};

InstanceFilters.defaultProps = {
  activeFilters: {},
};
