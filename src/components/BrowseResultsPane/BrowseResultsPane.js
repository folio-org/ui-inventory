import PropTypes from 'prop-types';
import { memo, useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import { omit } from 'lodash';

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
  isLoading,
  isFiltersOpened,
  pagination,
  toggleFiltersPane,
  totalRecords,
}) => {
  const [namespace] = useNamespace();

  const paneSub = getFiltersCount(filters) === 0
    ? <FormattedMessage id="ui-inventory.title.subTitle.browseCall" />
    : null;

  const isEmptyMessage = useMemo(() => (
    <NoResultsMessage
      filters={omit(filters || {}, ['qindex', 'query'])}
      isFiltersOpened={isFiltersOpened}
      isLoading={isLoading}
      notLoadedMessage={<FormattedMessage id="ui-inventory.notLoadedMessage.browseCall" />}
      toggleFilters={toggleFiltersPane}
    />
  ), [
    filters,
    isFiltersOpened,
    isLoading,
    toggleFiltersPane,
  ]);

  const firstMenu = useMemo(() => (
    isFiltersOpened
      ? null
      : (
        <PaneMenu>
          <ExpandFilterPaneButton
            filterCount={getFiltersCount(filters)}
            onClick={toggleFiltersPane}
          />
        </PaneMenu>
      )
  ), [
    filters,
    isFiltersOpened,
    toggleFiltersPane,
  ]);

  return (
    <Pane
      data-testid="browse-results-pane"
      id="browse-inventory-results-pane"
      padContent={false}
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
      />
    </Pane>
  );
};

BrowseResultsPane.propTypes = {
  browseData: PropTypes.arrayOf(PropTypes.object).isRequired,
  filters: PropTypes.object.isRequired,
  isFetching: PropTypes.bool,
  isFiltersOpened: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool,
  pagination: PropTypes.shape({
    hasPrevPage: PropTypes.bool,
    hasNextPage: PropTypes.bool,
  }).isRequired,
  toggleFiltersPane: PropTypes.func.isRequired,
  totalRecords: PropTypes.number,
};

export default memo(BrowseResultsPane);
