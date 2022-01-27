import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import _ from 'lodash';

import {
  Accordion,
  AccordionSet,
  FilterAccordionHeader,
} from '@folio/stripes/components';

import CheckboxFacet from '../CheckboxFacet';
import { processFacetOptions } from '../../facetUtils';
import {
  FACETS,
  FACETS_OPTIONS,
  FACETS_SETTINGS,
  FACETS_CQL,
} from '../../constants';
import { useFacets } from '../../common/hooks';

const InstanceFiltersBrowse = props => {
  const {
    activeFilters,
    data: {
      locations,
    },
    onChange,
    onClear,
  } = props;

  const segmentAccordions = {
    [FACETS.EFFECTIVE_LOCATION]: false,
  };

  const segmentOptions = {
    [FACETS_OPTIONS.EFFECTIVE_LOCATION_OPTIONS]: [],
  };

  const selectedFacetFilters = {
    [FACETS.EFFECTIVE_LOCATION]: activeFilters[FACETS.EFFECTIVE_LOCATION],
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

  // eslint-disable-next-line no-return-assign
  facetsOptions[FACETS_OPTIONS.EFFECTIVE_LOCATION_OPTIONS].map(el => el.count = null);

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
    </AccordionSet>
  );
};

export default InstanceFiltersBrowse;

InstanceFiltersBrowse.propTypes = {
  activeFilters: PropTypes.objectOf(PropTypes.array),
  onChange: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
  data: PropTypes.object,
};

InstanceFiltersBrowse.defaultProps = {
  activeFilters: {},
};
