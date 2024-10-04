import PropTypes from 'prop-types';

import {
  checkIfUserInMemberTenant,
  useStripes,
} from '@folio/stripes/core';
import {
  FACETS,
  HeldByFacet,
  browseModeOptions,
  browseCallNumberOptions,
  browseClassificationOptions,
  useFacets,
  SharedFacet,
  EffectiveLocationFacet,
  NameTypeFacet,
  isConsortiaEnv,
} from '@folio/stripes-inventory-components';

const InstanceFiltersBrowse = props => {
  const {
    data,
    query,
    onChange,
  } = props;

  const stripes = useStripes();
  const qindex = query.qindex;

  const initialFacetStates = {
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

  const {
    accordionsStatus,
    activeFilters,
    facetOptions,
    onToggleAccordion,
    getIsLoading,
  } = useFacets({
    initialAccordionStates: initialFacetStates,
    query,
    data,
    isBrowseLookup: true,
  });

  const renderSharedFacet = (name) => (
    <SharedFacet
      name={name}
      accordionsStatus={accordionsStatus}
      activeFilters={activeFilters}
      getIsLoading={getIsLoading}
      facetOptions={facetOptions}
      onChange={onChange}
      onToggle={onToggleAccordion}
    />
  );

  const renderHeldByFacet = (name) => (
    <HeldByFacet
      name={name}
      accordionsStatus={accordionsStatus}
      activeFilters={activeFilters}
      facetOptions={facetOptions}
      onChange={onChange}
      onToggle={onToggleAccordion}
    />
  );

  return (
    <>
      {Object.values(browseClassificationOptions).includes(qindex) && (
        renderSharedFacet(FACETS.CLASSIFICATION_SHARED)
      )}
      {Object.values(browseCallNumberOptions).includes(qindex) && (
        <>
          {renderSharedFacet(FACETS.SHARED)}
          {renderHeldByFacet(FACETS.CALL_NUMBERS_HELD_BY)}
          <EffectiveLocationFacet
            name={FACETS.EFFECTIVE_LOCATION}
            accordionsStatus={accordionsStatus}
            facetOptions={facetOptions}
            separator={isConsortiaEnv(stripes)}
            activeFilters={activeFilters}
            onChange={onChange}
            onToggle={onToggleAccordion}
          />
        </>
      )}
      {qindex === browseModeOptions.CONTRIBUTORS && (
        <>
          {renderSharedFacet(FACETS.CONTRIBUTORS_SHARED)}
          {/* Hide Held by facet for contributors and subjects browse until back-end requirements and implementation are done */}
          {/* {renderHeldByFacet(FACETS.CONTRIBUTORS_HELD_BY)} */}
          <NameTypeFacet
            name={FACETS.NAME_TYPE}
            accordionsStatus={accordionsStatus}
            activeFilters={activeFilters}
            separator={checkIfUserInMemberTenant(stripes)}
            facetOptions={facetOptions}
            onChange={onChange}
            onToggle={onToggleAccordion}
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
    </>
  );
};

export default InstanceFiltersBrowse;

InstanceFiltersBrowse.propTypes = {
  onChange: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  query: PropTypes.object.isRequired,
};
