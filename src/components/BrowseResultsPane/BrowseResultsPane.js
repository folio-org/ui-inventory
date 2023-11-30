import PropTypes from 'prop-types';
import { memo, useMemo } from 'react';
import { FormattedMessage } from 'react-intl';

import {
  Pane,
  PaneMenu,
} from '@folio/stripes/components';
import {
  AppIcon,
  useNamespace,
} from '@folio/stripes/core';
import {
  ExpandFilterPaneButton,
} from '@folio/stripes/smart-components';
import {
  getFiltersCount,
  NoResultsMessage,
} from '@folio/stripes-acq-components';

import BrowseResultsList from '../BrowseResultsList';

const BrowseResultsPane = ({
  browseData,
  filters = {},
  isFetching,
  isFiltersOpened,
  pagination,
  paneTitleRef,
  toggleFiltersPane,
  totalRecords,
}) => {
  const [namespace] = useNamespace();

  const dehydratedFilters = useMemo(() => ({
    ...filters,
    query: filters.query || undefined,
    qindex: undefined,
  }), [filters]);

  const paneSub = getFiltersCount(dehydratedFilters) === 0
    ? <FormattedMessage id="ui-inventory.title.subTitle.browseCall" />
    : null;

  const isEmptyMessage = useMemo(() => (
    <NoResultsMessage
      filters={dehydratedFilters}
      isFiltersOpened={isFiltersOpened}
      isLoading={isFetching}
      notLoadedMessage={<FormattedMessage id="ui-inventory.notLoadedMessage.browseCall" />}
      toggleFilters={toggleFiltersPane}
    />
  ), [
    dehydratedFilters,
    isFiltersOpened,
    isFetching,
    toggleFiltersPane,
  ]);

  const firstMenu = useMemo(() => (
    isFiltersOpened
      ? null
      : (
        <PaneMenu>
          <ExpandFilterPaneButton
            filterCount={getFiltersCount(dehydratedFilters)}
            onClick={toggleFiltersPane}
          />
        </PaneMenu>
      )
  ), [
    dehydratedFilters,
    isFiltersOpened,
    toggleFiltersPane,
  ]);

  return (
    <Pane
      data-testid="browse-results-pane"
      id="browse-inventory-results-pane"
      padContent={false}
      paneTitleRef={paneTitleRef}
      defaultWidth="fill"
      appIcon={<AppIcon app={namespace} />}
      paneTitle={<FormattedMessage id="ui-inventory.title.browseCall" />}
      paneSub={paneSub}
      firstMenu={firstMenu}
      noOverflow
    >
      <BrowseResultsList
        browseData={browseData}
        isEmptyMessage={isEmptyMessage}
        isLoading={isFetching}
        pagination={pagination}
        totalRecords={totalRecords}
        filters={filters}
      />
    </Pane>
  );
};

BrowseResultsPane.propTypes = {
  browseData: PropTypes.arrayOf(PropTypes.object),
  filters: PropTypes.object.isRequired,
  isFetching: PropTypes.bool,
  isFiltersOpened: PropTypes.bool.isRequired,
  paneTitleRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  pagination: PropTypes.shape({
    hasPrevPage: PropTypes.bool,
    hasNextPage: PropTypes.bool,
  }).isRequired,
  toggleFiltersPane: PropTypes.func.isRequired,
  totalRecords: PropTypes.number,
};

export default memo(BrowseResultsPane);
