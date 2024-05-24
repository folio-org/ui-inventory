import PropTypes from 'prop-types';
import { useContext } from 'react';

import { DataContext } from '../../contexts';
import { InstanceFiltersBrowse } from '../InstanceFilters';
import { browseConfig } from '../../filterConfig';

const BrowseInventoryFilters = ({
  query,
  applyFilters,
}) => {
  const data = useContext(DataContext);

  const filtersData = {
    ...data,
    query,
  };

  return (
    <InstanceFiltersBrowse
      filterConfig={browseConfig}
      data={filtersData}
      onChange={({ name, values }) => applyFilters(name, values)}
      onClear={(name) => applyFilters(name, [])}
    />
  );
};

BrowseInventoryFilters.propTypes = {
  query: PropTypes.object.isRequired,
  applyFilters: PropTypes.func.isRequired,
};

export default BrowseInventoryFilters;
