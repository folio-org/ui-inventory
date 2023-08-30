import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import _ from 'lodash';

import {
  Accordion,
  AccordionSet,
  FilterAccordionHeader,
} from '@folio/stripes/components';

import CheckboxFacet from '../../CheckboxFacet';
import { MultiSelectionFacet } from '../../MultiSelectionFacet';
import { processFacetOptions } from '../../../facetUtils';
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
    },
    onChange,
    onClear,
  } = props;

  const segmentAccordions = {
    [FACETS.EFFECTIVE_LOCATION]: false,
    [FACETS.NAME_TYPE]: false,
  };

  const segmentOptions = {
    [FACETS_OPTIONS.EFFECTIVE_LOCATION_OPTIONS]: [],
    [FACETS_OPTIONS.NAME_TYPE_OPTIONS]: [],
  };

  const selectedFacetFilters = {
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
      {
      Object.values(browseCallNumberOptions).includes(browseType) && (
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
      )}
      {
      browseType === browseModeOptions.CONTRIBUTORS && (
      <MultiSelectionFacet
        id={FACETS.NAME_TYPE}
        label={<FormattedMessage id={`ui-inventory.filters.${FACETS.NAME_TYPE}`} />}
        name={FACETS.NAME_TYPE}
        closedByDefault
        options={facetsOptions[FACETS_OPTIONS.NAME_TYPE_OPTIONS]}
        selectedValues={activeFilters[FACETS.NAME_TYPE]}
        onFilterChange={onChange}
        onClearFilter={() => onClear(FACETS.NAME_TYPE)}
        displayClearButton={!!activeFilters[FACETS.NAME_TYPE]?.length}
        isPending={getIsPending(FACETS.NAME_TYPE)}
      />
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
