import { useCallback, useState } from 'react';
import { useIntl } from 'react-intl';
import { useHistory, useLocation } from 'react-router-dom';

import {
  useNamespace,
} from '@folio/stripes/core';
import {
  PersistedPaneset,
} from '@folio/stripes/smart-components';
import {
  FiltersPane,
  ResetButton,
  SingleSearchForm,
  useFiltersToogle,
  useItemToView,
  useLocalStorageFilters,
} from '@folio/stripes-acq-components';

import {
  BrowseInventoryFilters,
  BrowseResultsPane,
  SearchModeNavigation,
} from '../../components';
import { browseInstanceIndexes } from '../../filterConfig';
import { removeItem } from '../../storage';
import {
  useBrowseValidation,
  useInventoryBrowse,
} from '../../hooks';
import { INIT_PAGE_CONFIG } from '../../hooks/useInventoryBrowse';

const BrowseInventory = () => {
  const history = useHistory();
  const location = useLocation();
  const intl = useIntl();
  const [namespace] = useNamespace();
  const { isFiltersOpened, toggleFilters } = useFiltersToogle(`${namespace}/filters`);
  const { deleteItemToView } = useItemToView('browse');
  const [pageConfig, setPageConfig] = useState(INIT_PAGE_CONFIG);
  const pageConfigKey = `${namespace}/browse.pageConfig`;

  const [
    filters,
    searchQuery,
    applyFilters,
    applySearch,
    changeSearch,
    resetFilters,
    changeSearchIndex,
    searchIndex,
  ] = useLocalStorageFilters(`${namespace}/browse.params`, location, history, () => {
    removeItem(pageConfigKey);
    setPageConfig(INIT_PAGE_CONFIG);
  });

  const {
    data,
    isFetching,
    isLoading,
    pagination,
    totalRecords,
  } = useInventoryBrowse({
    pageConfigKey,
    filters,
    pageParams: { pageConfig, setPageConfig },
    options: { onSettled: deleteItemToView },
  });

  const { validateDataQuery } = useBrowseValidation(searchIndex);

  const searchableIndexesPlaceholder = intl.formatMessage({ id: 'ui-inventory.browse.searchableIndexesPlaceholder' });
  const isResetButtonDisabled = !location.search && !searchQuery;

  const formattedSearchableIndexes = browseInstanceIndexes.map(({ label, ...rest }) => ({
    label: intl.formatMessage({ id: label }),
    ...rest,
  }));

  const onApplySearch = useCallback(() => {
    const isSearchQueryValid = validateDataQuery(searchQuery);

    if (isSearchQueryValid) applySearch();
  }, [searchQuery, filters]);

  const onChangeSearchIndex = useCallback((e) => {
    resetFilters();
    changeSearchIndex(e);
  }, []);

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
          <SearchModeNavigation
            search="?selectedSearchMode=true"
          />

          <SingleSearchForm
            applySearch={onApplySearch}
            changeSearch={changeSearch}
            disabled={!searchIndex}
            searchQuery={searchQuery}
            isLoading={isFetching}
            ariaLabelId="ui-inventory.browse"
            searchableIndexes={formattedSearchableIndexes}
            changeSearchIndex={onChangeSearchIndex}
            selectedIndex={searchIndex}
            searchableIndexesPlaceholder={searchableIndexesPlaceholder}
          />

          <ResetButton
            reset={resetFilters}
            disabled={isResetButtonDisabled}
          />

          <BrowseInventoryFilters
            activeFilters={filters}
            applyFilters={applyFilters}
            searchIndex={searchIndex}
          />
        </FiltersPane>
      )}

      <BrowseResultsPane
        browseData={data}
        filters={filters}
        isFetching={isFetching}
        isFiltersOpened={isFiltersOpened}
        isLoading={isLoading}
        pagination={pagination}
        toggleFiltersPane={toggleFilters}
        totalRecords={totalRecords}
      />
    </PersistedPaneset>
  );
};

export default BrowseInventory;
