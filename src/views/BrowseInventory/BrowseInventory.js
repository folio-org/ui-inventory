import React, { useCallback, useState, useEffect, useMemo, useRef } from 'react';
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
  useLocationFilters,
} from '@folio/stripes-acq-components';

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
import { INDEXES_WITH_CALL_NUMBER_TYPE_PARAM } from '../../constants';
import css from './BrowseInventory.css';

const BrowseInventory = () => {
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
  const [pageConfig, setPageConfig] = useState(getLastBrowseOffset());
  const hasFocusedSearchOptionOnMount = useRef(false);
  const inputRef = useRef();
  const indexRef = useRef();
  const paneTitleRef = useRef();

  const { search } = location;

  useEffect(() => {
    storeLastBrowse(search);
    storeLastBrowseOffset(pageConfig);
  }, [search, pageConfig]);

  const [
    filters,
    searchQuery,
    applyFilters,
    applySearch,
    changeSearch,
    resetFilters,
    changeSearchIndex,
    searchIndex,
  ] = useLocationFilters(location, history, () => {
    setPageConfig(INIT_PAGE_CONFIG);
  });

  const withExtraFilters = useMemo(() => {
    if (filters.query && INDEXES_WITH_CALL_NUMBER_TYPE_PARAM.includes(filters.qindex)) {
      return {
        ...filters,
        callNumberType: filters.qindex,
      };
    }

    return filters;
  }, [filters]);

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
      applySearch();
      paneTitleRef.current.focus();
    }
  }, [searchQuery, filters]);

  const onChangeSearchIndex = useCallback((e) => {
    resetFilters();
    changeSearchIndex(e);
  }, []);

  const onReset = useCallback(() => {
    resetFilters();
    inputRef.current.focus();
  }, [inputRef.current]);

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
        pagination={pagination}
        paneTitleRef={paneTitleRef}
        toggleFiltersPane={toggleFilters}
        totalRecords={totalRecords}
      />
    </PersistedPaneset>
  );
};

export default BrowseInventory;
