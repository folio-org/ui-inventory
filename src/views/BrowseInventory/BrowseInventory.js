import {
  useNamespace,
} from '@folio/stripes/core';
import {
  PersistedPaneset,
} from '@folio/stripes-smart-components';
import {
  FiltersPane,
  useFiltersToogle,
} from '@folio/stripes-acq-components';

import {
  BrowseResultsPane,
  SearchModeNavigation,
} from '../../components';

const BrowseInventory = () => {
  const [namespace] = useNamespace();
  const { isFiltersOpened, toggleFilters } = useFiltersToogle(`${namespace}/filters`);

  return (
    <PersistedPaneset
      appId={namespace}
      id="browse-inventory"
    >
      {isFiltersOpened && (
        <FiltersPane
          id="browse-inventory-filters-pane"
          toggleFilters={toggleFilters}
        >
          <SearchModeNavigation />
          <>TODO: filters</>
        </FiltersPane>
      )}

      <BrowseResultsPane
        isFiltersOpened={isFiltersOpened}
        toggleFiltersPane={toggleFilters}
      />
    </PersistedPaneset>
  );
};

export default BrowseInventory;
