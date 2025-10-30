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
  checkIfUserInMemberTenant,
  useStripes,
} from '@folio/stripes/core';
import { PersistedPaneset } from '@folio/stripes/smart-components';
import {
  FiltersPane,
  ResetButton,
  SingleSearchForm,
  useFiltersToogle,
  useItemToView,
  useLocationFilters,
} from '@folio/stripes-acq-components';
import {
  browseCallNumberOptions,
  FACETS,
} from '@folio/stripes-inventory-components';

import {
  BrowseInventoryFilters,
  BrowseResultsPane,
  SearchModeNavigation,
} from '../../components';
import { browseInstanceIndexes } from '../../filterConfig';
import {
  useBrowseValidation,
  useInventoryBrowse,
  useLastSearchTerms,
} from '../../hooks';
import { INIT_PAGE_CONFIG } from '../../hooks/useInventoryBrowse';

import css from './BrowseInventory.css';

const isCallNumberBrowseOption = option => Object.values(browseCallNumberOptions).includes(option);

const BrowseInventory = () => {
  const stripes = useStripes();
  const history = useHistory();
  const location = useLocation();
  const intl = useIntl();
  const [namespace] = useNamespace();
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
    applyLocationFiltersAsync,
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

  const searchableOptions = browseInstanceIndexes.map((searchableIndex) => {
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

  const getIndexGroupForIndex = (index) => {
    return browseInstanceIndexes.find(indexGroup => !!indexGroup.subIndexes?.find(subIndex => subIndex.value === index) || indexGroup.value === index);
  };

  const onChangeSearchIndex = useCallback((e) => {
    deleteItemToView();
    /*
      useLocationFilters hook returns `resetLocationFilters` function, but it also resets search index and query, which we want to avoid in our case
      it really should be called `resetAll` ¯\_(ツ)_/¯
      as a work-around we can call `clearFilters` to clear filters only
    */
    changeSearchIndex(e);

    const currentIndexGroup = getIndexGroupForIndex(withExtraFilters.qindex);
    const newIndexGroup = getIndexGroupForIndex(e.target.value);

    // if current is from, for example, Call Numbers and new index is from Classification
    // they could have incompatible facets selected so we should clear selected filters
    const isNewIndexFromDifferentBrowseGroup = newIndexGroup !== currentIndexGroup;

    if (isNewIndexFromDifferentBrowseGroup) {
      clearFilters();
    }

    if (isCallNumberBrowseOption(e.target.value) && checkIfUserInMemberTenant(stripes)) {
      // we want to applyFilters without writing the value to the url because it will trigger a search
      applyLocationFiltersAsync(FACETS.CALL_NUMBERS_HELD_BY, [stripes.okapi.tenant], false);
    }
  }, [deleteItemToView, clearFilters, changeSearchIndex, applyLocationFiltersAsync]);

  const onReset = useCallback(() => {
    resetAll();
    inputRef.current.focus();
  }, [inputRef.current, resetAll]);

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
        // we can use an empty index as a check that a user hasn't performed a browse
        // if a user only has default facet selection - then we shouldn't show the empty results message
        // for that we can pass an empty object when qindex is empty, i.e user hasn't clicked "Search"
        filters={withExtraFilters.qindex ? withExtraFilters : {}}
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
