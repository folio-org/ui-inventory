import React, {
  useCallback,
  useState,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import { useIntl } from 'react-intl';
import {
  useHistory,
  useLocation,
} from 'react-router-dom';
import querystring from 'query-string';

import {
  TitleManager,
  useNamespace,
  useStripes,
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
  useLocationFilters,
} from '@folio/stripes-acq-components';
import { useResetFacetStates } from '@folio/stripes-inventory-components';

import {
  BrowseInventoryFilters,
  BrowseResultsPane,
  SearchModeNavigation,
} from '../../components';
import {
  newBrowseInstanceIndexes,
  browseInstanceIndexes,
} from '../../filterConfig';
import {
  useBrowseValidation,
  useInventoryBrowse,
  useLastSearchTerms,
} from '../../hooks';
import { INIT_PAGE_CONFIG } from '../../hooks/useInventoryBrowse';
import css from './BrowseInventory.css';

const BrowseInventory = () => {
  const history = useHistory();
  const location = useLocation();
  const intl = useIntl();
  const [namespace] = useNamespace();
  const stripes = useStripes();
  const resetFacetStates = useResetFacetStates(namespace);
  const {
    getLastSearch,
    getLastBrowseOffset,
    storeLastBrowse,
    storeLastBrowseOffset,
  } = useLastSearchTerms();
  const { isFiltersOpened, toggleFilters } = useFiltersToogle(`${namespace}/filters`);
  const { deleteItemToView } = useItemToView('browse');
  const [pageConfig, setPageConfig] = useState(getLastBrowseOffset());
  const hasFocusedSearchOptionOnMount = useRef(false);
  const inputRef = useRef();
  const indexRef = useRef();
  const paneTitleRef = useRef();

  const { search } = location;

  useEffect(() => {
    storeLastBrowse(search);
    storeLastBrowseOffset(pageConfig);
  }, [search, pageConfig, storeLastBrowse, storeLastBrowseOffset]);

  const [
    filters,
    searchQuery,
    applyFilters,
    applySearch,
    changeSearch,
    resetAll,
    changeSearchIndex,
    searchIndex,
    clearFilters,
  ] = useLocationFilters(location, history, () => {
    setPageConfig(INIT_PAGE_CONFIG);
  },
  { skipTrimOnChange: true });

  const withExtraFilters = useMemo(() => {
    const { qindex, query } = querystring.parse(search);

    return {
      ...filters,
      qindex,
      query,
    };
  }, [filters, search]);

  const pageTitle = useMemo(() => {
    if (!withExtraFilters.query) {
      return null;
    }

    return intl.formatMessage({ id: 'ui-inventory.documentTitle.browse' }, { query: withExtraFilters.query });
  }, [intl, withExtraFilters.query]);

  const {
    data,
    isFetched,
    isFetching,
    pagination,
    totalRecords,
  } = useInventoryBrowse({
    filters: withExtraFilters,
    pageParams: { pageConfig, setPageConfig },
  });

  const { validateDataQuery } = useBrowseValidation(searchIndex);

  const searchableIndexesPlaceholder = intl.formatMessage({ id: 'ui-inventory.browse.searchableIndexesPlaceholder' });
  const isResetButtonDisabled = !location.search && !searchQuery;

  const browseIndexes = stripes.hasInterface('browse', '1.5')
    ? newBrowseInstanceIndexes
    : browseInstanceIndexes;

  const searchableOptions = browseIndexes.map((searchableIndex) => {
    if (searchableIndex.subIndexes) {
      return (
        <optgroup
          key={searchableIndex.label}
          label={intl.formatMessage({ id: searchableIndex.label })}
          className={css.optgroup}
        >
          {searchableIndex.subIndexes.map((subOption) => (
            <option
              key={subOption.value}
              value={subOption.value}
            >
              {intl.formatMessage({ id: subOption.label })}
            </option>
          ))}
        </optgroup>
      );
    }

    return (
      <option
        key={searchableIndex.value}
        value={searchableIndex.value}
      >
        {intl.formatMessage({ id: searchableIndex.label })}
      </option>
    );
  });

  const onApplySearch = useCallback(() => {
    const isSearchQueryValid = validateDataQuery(searchQuery);

    if (isSearchQueryValid) {
      deleteItemToView();
      applySearch();
      paneTitleRef.current.focus();
    }
  }, [searchQuery, filters]);

  const onChangeSearchIndex = useCallback((e) => {
    resetFacetStates({ isBrowseLookup: true });
    deleteItemToView();
    /*
      useLocationFilters hook returns `resetLocationFilters` function, but it also resets search index and query, which we want to avoid in our case
      it really should be called `resetAll` ¯\_(ツ)_/¯
      as a work-around we can call `clearFilters` to clear filters only
    */
    changeSearchIndex(e);
    clearFilters();
  }, [deleteItemToView, clearFilters, changeSearchIndex, resetFacetStates]);

  const onReset = useCallback(() => {
    resetFacetStates({ isBrowseLookup: true });
    resetAll();
    inputRef.current.focus();
  }, [inputRef.current, resetAll, resetFacetStates]);

  useEffect(() => {
    if (hasFocusedSearchOptionOnMount.current) {
      return;
    }

    if (!search || (search && isFetched && !isFetching)) {
      indexRef.current.focus();
      hasFocusedSearchOptionOnMount.current = true;
    }
  }, [isFetched, search, isFetching]);

  return (
    <PersistedPaneset
      appId={namespace}
      id="browse-inventory"
    >
      <TitleManager page={pageTitle} />
      {isFiltersOpened && (
        <FiltersPane
          id="browse-inventory-filters-pane"
          toggleFilters={toggleFilters}
        >
          <SearchModeNavigation
            search={getLastSearch()}
          />

          <SingleSearchForm
            autoFocus={false}
            applySearch={onApplySearch}
            changeSearch={changeSearch}
            disabled={!searchIndex}
            searchQuery={searchQuery}
            isLoading={isFetching}
            ariaLabelId="ui-inventory.browse"
            searchableOptions={searchableOptions}
            changeSearchIndex={onChangeSearchIndex}
            selectedIndex={searchIndex}
            searchableIndexesPlaceholder={searchableIndexesPlaceholder}
            inputType="textarea"
            indexRef={indexRef}
            inputRef={inputRef}
          />

          <ResetButton
            reset={onReset}
            disabled={isResetButtonDisabled}
          />

          <BrowseInventoryFilters
            query={filters}
            applyFilters={applyFilters}
          />
        </FiltersPane>
      )}

      <BrowseResultsPane
        browseData={data}
        filters={filters}
        isFetching={isFetching}
        isFiltersOpened={isFiltersOpened}
        pagination={pagination}
        paneTitleRef={paneTitleRef}
        toggleFiltersPane={toggleFilters}
        totalRecords={totalRecords}
      />
    </PersistedPaneset>
  );
};

export default BrowseInventory;
