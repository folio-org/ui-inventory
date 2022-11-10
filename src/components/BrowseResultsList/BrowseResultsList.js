import PropTypes from 'prop-types';
import queryString from 'query-string';
import {
  memo,
  useCallback,
  useContext,
} from 'react';
import {
  useHistory,
  useLocation,
} from 'react-router-dom';

import {
  MCLPagingTypes,
  MultiColumnList,
} from '@folio/stripes/components';
import {
  useItemToView,
} from '@folio/stripes-acq-components';

import {
  browseModeOptions,
  BROWSE_RESULTS_COUNT,
  FACETS,
  INVENTORY_ROUTE,
  queryIndexes,
} from '../../constants';
import { DataContext } from '../../contexts';
import {
  COLUMNS_MAPPING,
  COLUMNS_WIDTHS,
  VISIBLE_COLUMNS_MAP,
} from './constants';
import getBrowseResultsFormatter from './getBrowseResultsFormatter';

import css from './BrowseResultsList.css';

const getSearchParams = (row, qindex) => {
  const optionsMap = {
    [browseModeOptions.CALL_NUMBERS]: {
      qindex: queryIndexes.CALL_NUMBER,
      query: row.shelfKey,
    },
    [browseModeOptions.CONTRIBUTORS]: {
      qindex: queryIndexes.CONTRIBUTOR,
      query: row.name,
      filters: `${FACETS.SEARCH_CONTRIBUTORS}.${row.contributorNameTypeId}`,
    },
    [browseModeOptions.SUBJECTS]: {
      qindex: queryIndexes.SUBJECT,
      query: row.subject,
    },
  };

  return optionsMap[qindex];
};

const getItemToViewIndex = (selector) => {
  const match = selector.match(/^\[aria-rowindex="(\d+)"\]$/);

  return match
    ? Number(match[1]) - 2
    : null;
};

const BrowseResultsList = ({
  browseData = [],
  isEmptyMessage,
  isLoading,
  pagination: {
    hasNextPage,
    hasPrevPage,
    onNeedMoreData,
  },
  totalRecords,
}) => {
  const data = useContext(DataContext);
  const history = useHistory();
  const { search } = useLocation();
  const {
    itemToView,
    setItemToView,
    deleteItemToView,
  } = useItemToView('browse');

  const browseOption = queryString.parse(search).qindex;
  const listId = `browse-results-list-${browseOption}`;

  const isRowPreventsClick = useCallback((row) => {
    return row.isAnchor && (
      (browseOption === browseModeOptions.CALL_NUMBERS && !row.instance) ||
      (browseOption === browseModeOptions.CONTRIBUTORS && !row.contributorNameTypeId) ||
      (browseOption === browseModeOptions.SUBJECTS && !row.totalRecords)
    );
  }, [browseOption]);

  const isSelected = useCallback(({ item, rowIndex }) => {
    if (isRowPreventsClick(item)) return false;

    const itemIndex = itemToView?.selector && getItemToViewIndex(itemToView.selector);

    return itemIndex === rowIndex;
  }, [isRowPreventsClick, itemToView]);

  const onRowClick = useCallback(({ target }, row) => {
    const isAuthorityAppLink = target.dataset?.link === 'authority-app' ||
      target.getAttribute('class')?.includes('authorityIcon');

    if (isAuthorityAppLink || isRowPreventsClick(row)) return;

    history.push({
      pathname: INVENTORY_ROUTE,
      search: queryString.stringify({
        selectedBrowseResult: true,
        ...getSearchParams(row, browseOption),
      }),
      state: {
        browseSearch: search,
      }
    });
  }, [browseOption, history, isRowPreventsClick, search]);

  return (
    <MultiColumnList
      key={listId}
      id={listId}
      totalCount={totalRecords}
      contentData={browseData}
      formatter={getBrowseResultsFormatter(data, browseOption)}
      visibleColumns={VISIBLE_COLUMNS_MAP[browseOption]}
      isEmptyMessage={isEmptyMessage}
      isSelected={isSelected}
      columnMapping={COLUMNS_MAPPING}
      columnWidths={COLUMNS_WIDTHS[browseOption]}
      loading={isLoading}
      autosize
      virtualize={false}
      hasMargin
      onRowClick={onRowClick}
      onNeedMoreData={onNeedMoreData}
      pageAmount={BROWSE_RESULTS_COUNT}
      pagingType={MCLPagingTypes.PREV_NEXT}
      getCellClass={(defaultCellStyle) => `${defaultCellStyle} ${css.cellAlign}`}
      onMarkPosition={setItemToView}
      onMarkReset={deleteItemToView}
      itemToView={itemToView}
      hidePageIndices
      pagingCanGoNext={hasNextPage && !isLoading}
      pagingCanGoPrevious={hasPrevPage && !isLoading}
    />
  );
};

BrowseResultsList.propTypes = {
  browseData: PropTypes.arrayOf(PropTypes.object).isRequired,
  isEmptyMessage: PropTypes.node.isRequired,
  isLoading: PropTypes.bool,
  pagination: PropTypes.shape({
    hasPrevPage: PropTypes.bool,
    hasNextPage: PropTypes.bool,
    onNeedMoreData: PropTypes.func.isRequired,
  }).isRequired,
  totalRecords: PropTypes.number,
};

export default memo(BrowseResultsList);
