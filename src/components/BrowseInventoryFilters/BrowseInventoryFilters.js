import PropTypes from 'prop-types';
import { useContext } from 'react';
import { flowRight, omit } from 'lodash';

import { stripesConnect } from '@folio/stripes-core';

import withFacets from '../../withFacets';
import { DataContext } from '../../contexts';
import { buildManifestObject } from '../../routes/buildManifestObject';
import { parseFiltersToStr } from '../../utils';
import { InstanceFiltersBrowse } from '../InstanceFilters';

const BrowseInventoryFilters = ({
  activeFilters,
  applyFilters,
  fetchFacets,
  resources,
  searchIndex,
}) => {
  const data = useContext(DataContext);

  const filters = omit(activeFilters || {}, ['qindex', 'query']);
  const filtersData = {
    ...data,
    browseType: searchIndex,
    onFetchFacets: fetchFacets(data),
    parentResources: resources,
    query: {
      query: activeFilters.query,
      filters: parseFiltersToStr(filters),
    }
  };

  return (
    <InstanceFiltersBrowse
      activeFilters={filters}
      data={filtersData}
      onChange={({ name, values }) => applyFilters(name, values)}
      onClear={(name) => applyFilters(name, [])}
    />
  );
};

BrowseInventoryFilters.manifest = Object.freeze({
  query: buildManifestObject().query,
});

BrowseInventoryFilters.propTypes = {
  activeFilters: PropTypes.object.isRequired,
  applyFilters: PropTypes.func.isRequired,
  fetchFacets: PropTypes.func.isRequired,
  resources: PropTypes.object.isRequired,
  searchIndex: PropTypes.string.isRequired,
};

export default flowRight(
  stripesConnect,
  withFacets
)(BrowseInventoryFilters);
