import PropTypes from 'prop-types';
import { useContext } from 'react';

import { DataContext } from '../../contexts';
import InstanceFiltersBrowse from '../InstanceFiltersBrowse';

const BrowseInventoryFilters = ({
  query,
  applyFilters,
}) => {
  const data = useContext(DataContext);

  return (
    <InstanceFiltersBrowse
      data={data}
      query={query}
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
