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
    {
      Object.keys(availableFilters).map(name => (
        <Button
          key={`${name}`}
          to={`/inventory/${name}`}
          buttonStyle={`${filter === name ? 'primary' : 'default'}`}
        >
          <FormattedMessage id={`ui-inventory.filters.${name}`} />
        </Button>
      ))
    }
  </ButtonGroup>
);

FiltersPanel.propTypes = {
  filter: PropTypes.string,
};

FiltersPanel.defaultProps = {
  filter: availableFilters.instances,
};

export default FiltersPanel;
