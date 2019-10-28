import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  ButtonGroup,
  Button,
} from '@folio/stripes/components';

import { availableFilters } from '../../constants';

const FiltersPanel = ({ filter }) => (
  <ButtonGroup
    fullWidth
    data-test-filters-panel
  >
    <Button
      to="/inventory"
      buttonStyle={`${filter === availableFilters.instances ? 'primary' : 'default'}`}
    >
      <FormattedMessage id="ui-inventory.instances" />
    </Button>
    <Button
      to="/inventory/holdings"
      buttonStyle={`${filter === availableFilters.holdings ? 'primary' : 'default'}`}
      data-test-holdings-filter
    >
      <FormattedMessage id="ui-inventory.holdings" />
    </Button>
    <Button
      to="/inventory/items"
      buttonStyle={`${filter === availableFilters.items ? 'primary' : 'default'}`}
      data-test-holdings-filter
    >
      <FormattedMessage id="ui-inventory.items" />
    </Button>
  </ButtonGroup>
);

FiltersPanel.propTypes = {
  filter: PropTypes.string,
};

FiltersPanel.defaultProps = {
  filter: availableFilters.instances,
};

export default FiltersPanel;
