import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import _ from 'lodash';

import {
  Accordion,
  FilterAccordionHeader,
} from '@folio/stripes/components';
import { AccordionSet } from '@folio/stripes-components';

import TagsFilter from '../TagsFilter';
import CheckboxFacet from '../CheckboxFacet';
import { useFacets } from '../../common/hooks';
import {
  getSuppressedOptions,
  processFacetOptions,
} from '../../facetUtils';
import {
  FACETS,
  FACETS_OPTIONS,
  FACETS_CQL,
  FACETS_SETTINGS,
} from '../../constants';

const HoldingsRecordFilters = (props) => {
  const {
    activeFilters,
    data: {
      locations,
      tagsRecords,
    },
    onChange,
    onClear,
  } = props;

  const segmentAccordions = {
    [FACETS.EFFECTIVE_LOCATION]: false,
    [FACETS.HOLDINGS_PERMANENT_LOCATION]: false,
    [FACETS.HOLDINGS_DISCOVERY_SUPPRESS]: false,
    [FACETS.HOLDINGS_TAGS]: false,
  };

  const segmentOptions = {
    [FACETS_OPTIONS.EFFECTIVE_LOCATION_OPTIONS]: [],
    [FACETS_OPTIONS.HOLDINGS_PERMANENT_LOCATION_OPTIONS]: [],
    [FACETS_OPTIONS.HOLDINGS_DISCOVERY_SUPPRESS_OPTIONS]: [],
    [FACETS_OPTIONS.HOLDINGS_TAGS_OPTIONS]: [],
  };

  const selectedFacetFilters = {
    [FACETS.EFFECTIVE_LOCATION]: activeFilters[FACETS.EFFECTIVE_LOCATION],
    [FACETS.HOLDINGS_PERMANENT_LOCATION]: activeFilters[FACETS.HOLDINGS_PERMANENT_LOCATION],
    [FACETS.HOLDINGS_DISCOVERY_SUPPRESS]: activeFilters[FACETS.HOLDINGS_DISCOVERY_SUPPRESS],
    [FACETS.HOLDINGS_TAGS]: activeFilters[FACETS.HOLDINGS_TAGS],
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
          case FACETS_CQL.HOLDINGS_PERMANENT_LOCATION:
            processFacetOptions(activeFilters[FACETS.HOLDINGS_PERMANENT_LOCATION], locations, ...commonProps);
            break;
          case FACETS_CQL.HOLDINGS_DISCOVERY_SUPPRESS:
            accum[name] = getSuppressedOptions(activeFilters[FACETS.HOLDINGS_DISCOVERY_SUPPRESS], recordValues);
            break;
          case FACETS_CQL.HOLDINGS_TAGS:
            processFacetOptions(activeFilters[FACETS.HOLDINGS_TAGS], tagsRecords, ...commonProps, 'label');
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
          onFetch={handleFetchFacets}
          onSearch={handleFilterSearch}
          isPending={getIsPending(FACETS.EFFECTIVE_LOCATION)}
          isFilterable
        />
      </Accordion>
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
          dataOptions={facetsOptions[FACETS_OPTIONS.HOLDINGS_PERMANENT_LOCATION_OPTIONS]}
          selectedValues={activeFilters[FACETS.HOLDINGS_PERMANENT_LOCATION]}
          onChange={onChange}
          onFetch={handleFetchFacets}
          onSearch={handleFilterSearch}
          isPending={getIsPending(FACETS.HOLDINGS_PERMANENT_LOCATION)}
          isFilterable
        />
      </Accordion>
      <Accordion
        data-test-filter-holding-discovery-suppress
        label={<FormattedMessage id="ui-inventory.discoverySuppress" />}
        id={FACETS.HOLDINGS_DISCOVERY_SUPPRESS}
        name={FACETS.HOLDINGS_DISCOVERY_SUPPRESS}
        closedByDefault
        header={FilterAccordionHeader}
        displayClearButton={activeFilters[FACETS.HOLDINGS_DISCOVERY_SUPPRESS]?.length > 0}
        onClearFilter={() => onClear(FACETS.HOLDINGS_DISCOVERY_SUPPRESS)}
      >
        <CheckboxFacet
          data-test-filter-holdings-discovery-suppress
          name={FACETS.HOLDINGS_DISCOVERY_SUPPRESS}
          dataOptions={facetsOptions[FACETS_OPTIONS.HOLDINGS_DISCOVERY_SUPPRESS_OPTIONS]}
          isPending={getIsPending(FACETS.HOLDINGS_DISCOVERY_SUPPRESS)}
          selectedValues={activeFilters[FACETS.HOLDINGS_DISCOVERY_SUPPRESS]}
          onChange={onChange}
        />
      </Accordion>
      <TagsFilter
        id={FACETS.HOLDINGS_TAGS}
        name={FACETS.HOLDINGS_TAGS}
        onChange={onChange}
        onFetch={handleFetchFacets}
        onSearch={handleFilterSearch}
        onClear={onClear}
        selectedValues={activeFilters[FACETS.HOLDINGS_TAGS]}
        tagsRecords={facetsOptions[FACETS_OPTIONS.HOLDINGS_TAGS_OPTIONS]}
        isPending={getIsPending(FACETS.HOLDINGS_TAGS)}
      />
    </AccordionSet>
  );
};

HoldingsRecordFilters.propTypes = {
  activeFilters: PropTypes.objectOf(PropTypes.array),
  onChange: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
  data: PropTypes.object,
};

HoldingsRecordFilters.defaultProps = {
  activeFilters: {},
};

export default HoldingsRecordFilters;
