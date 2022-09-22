import PropTypes from 'prop-types';
import { useMemo } from 'react';
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
} from '@folio/stripes-smart-components';
import {
  getFiltersCount,
} from '@folio/stripes-acq-components';

const BrowseResultsPane = ({
  filters = {},
  isFiltersOpened,
  toggleFiltersPane,
}) => {
  const [namespace] = useNamespace();

  const paneSub = <FormattedMessage id="ui-inventory.title.subTitle.browseCall" />;

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
  ), [isFiltersOpened, toggleFiltersPane]);

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
      <>TODO: Browse List</>
    </Pane>
  );
}

BrowseResultsPane.propTypes = {
  filters: PropTypes.object.isRequired,
  isFiltersOpened: PropTypes.bool.isRequired,
  toggleFiltersPane: PropTypes.func.isRequired,
}

export default BrowseResultsPane;
