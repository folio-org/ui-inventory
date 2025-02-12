import PropTypes from 'prop-types';
import queryString from 'query-string';
import {
  memo,
  useCallback,
  useContext,
} from 'react';
import {
  useLocation,
} from 'react-router-dom';

import { useNamespace } from '@folio/stripes/core';
import {
  MCLPagingTypes,
  MultiColumnList,
} from '@folio/stripes/components';
import { useItemToView } from '@folio/stripes-acq-components';

import { BROWSE_RESULTS_COUNT } from '../../constants';
import { DataContext } from '../../contexts';
import {
  COLUMNS_MAPPING,
  COLUMNS_WIDTHS,
  VISIBLE_COLUMNS_MAP,
} from './constants';
import { isRowPreventsClick } from './utils';
import getBrowseResultsFormatter from './getBrowseResultsFormatter';

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
  const [namespace] = useNamespace();
  const data = useContext(DataContext);
  const { search } = useLocation();
  const {
    itemToView,
    setItemToView,
    deleteItemToView,
  } = useItemToView('browse');

  const browseOption = queryString.parse(search).qindex;
  const listId = `browse-results-list-${browseOption}`;

  const isSelected = useCallback(({ item, rowIndex }) => {
    if (isRowPreventsClick(item, browseOption)) return false;

    const itemIndex = itemToView?.selector && getItemToViewIndex(itemToView.selector);

    return itemIndex === rowIndex;
  }, [browseOption, itemToView]);

  return (
    <MultiColumnList
      key={listId}
      id={listId}
      totalCount={totalRecords}
      contentData={browseData}
      formatter={getBrowseResultsFormatter({ data, browseOption, filters, namespace })}
      visibleColumns={VISIBLE_COLUMNS_MAP[browseOption]}
      isEmptyMessage={isEmptyMessage}
      isSelected={isSelected}
      columnMapping={COLUMNS_MAPPING}
      columnWidths={COLUMNS_WIDTHS[browseOption]}
      loading={isLoading}
      autosize
      virtualize={false}
      hasMargin
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
