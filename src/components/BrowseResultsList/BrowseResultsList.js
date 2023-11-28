import PropTypes from 'prop-types';
import queryString from 'query-string';
import {
  memo,
  useCallback,
  useContext,
  useState,
} from 'react';
import {
  useLocation,
} from 'react-router-dom';

import { useNamespace } from '@folio/stripes/core';
import {
  MCLPagingTypes,
  MultiColumnList,
} from '@folio/stripes/components';
import {
  useItemToView,
} from '@folio/stripes-acq-components';

import {
  BROWSE_RESULTS_COUNT,
} from '../../constants';
import { DataContext } from '../../contexts';
import {
  COLUMNS_MAPPING,
  COLUMNS_WIDTHS,
  VISIBLE_COLUMNS_MAP,
} from './constants';
import { isRowPreventsClick } from './utils';
import getBrowseResultsFormatter from './getBrowseResultsFormatter';
import {
  getItem,
  removeItem,
  setItem,
} from '../../storage';
import { useDidUpdate } from '../../hooks';

import css from './BrowseResultsList.css';

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
  filters,
}) => {
  const data = useContext(DataContext);
  const [namespace] = useNamespace();
  const { search } = useLocation();
  const {
    itemToView,
    setItemToView,
    deleteItemToView,
  } = useItemToView('browse');
  const selectedRowPersistKey = `${namespace}/browse.selectedRow`;

  const [selectedRow, setSelectedRow] = useState(getItem(selectedRowPersistKey));

  const handleRowClick = (e, row) => {
    setItem(selectedRowPersistKey, row);
    setSelectedRow(row);
  };

  const removeRowSelection = () => {
    removeItem(selectedRowPersistKey);
    setSelectedRow(null);
  };

  const handlePagination = (...params) => {
    removeRowSelection();
    onNeedMoreData(...params);
  };

  const browseOption = queryString.parse(search).qindex;
  const listId = `browse-results-list-${browseOption}`;

  const isSelected = useCallback(({ item, rowIndex, criteria }) => {
    if (isRowPreventsClick(item, browseOption)) return false;

    if (!criteria) {
      return false;
    }

    const itemIndex = itemToView?.selector && getItemToViewIndex(itemToView.selector);

    return itemIndex === rowIndex;
  }, [browseOption, itemToView]);

  useDidUpdate(() => {
    removeRowSelection();
  }, [search]);

  return (
    <MultiColumnList
      key={listId}
      id={listId}
      totalCount={totalRecords}
      contentData={browseData}
      formatter={getBrowseResultsFormatter({ data, browseOption, filters })}
      visibleColumns={VISIBLE_COLUMNS_MAP[browseOption]}
      isEmptyMessage={isEmptyMessage}
      isSelected={isSelected}
      onRowClick={handleRowClick}
      selectedRow={selectedRow}
      columnMapping={COLUMNS_MAPPING}
      columnWidths={COLUMNS_WIDTHS[browseOption]}
      loading={isLoading}
      autosize
      virtualize={false}
      hasMargin
      onNeedMoreData={handlePagination}
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
  browseData: PropTypes.arrayOf(PropTypes.object),
  filters: PropTypes.object.isRequired,
  isEmptyMessage: PropTypes.node.isRequired,
  isLoading: PropTypes.bool,
  pagination: PropTypes.shape({
    hasPrevPage: PropTypes.bool,
    hasNextPage: PropTypes.bool,
    onNeedMoreData: PropTypes.func.isRequired,
    pageConfig: PropTypes.arrayOf(
      PropTypes.number,
      PropTypes.string,
      PropTypes.string,
    ),
  }).isRequired,
  totalRecords: PropTypes.number,
};

export default memo(BrowseResultsList);
