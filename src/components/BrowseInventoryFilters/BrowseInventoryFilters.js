import PropTypes from 'prop-types';
import {
  useCallback,
  useContext,
} from 'react';

import { DataContext } from '../../contexts';
import InstanceFiltersBrowse from '../InstanceFiltersBrowse';

const BrowseInventoryFilters = ({
  query,
  applyFilters,
}) => {
  const data = useContext(DataContext);

  const handleChange = useCallback(({ name, values }) => {
    applyFilters(name, values);
  }, [applyFilters]);

  return (
    <InstanceFiltersBrowse
      data={data}
      query={query}
      onChange={handleChange}
    />
  );
};

BrowseInventoryFilters.propTypes = {
  query: PropTypes.object.isRequired,
  applyFilters: PropTypes.func.isRequired,
};

export default BrowseInventoryFilters;
