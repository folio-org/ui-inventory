import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  ButtonGroup,
  Button,
} from '@folio/stripes/components';

import { segments } from '../../constants';

const FilterNavigation = ({ segment, onChange }) => (
  <ButtonGroup
    fullWidth
    data-test-filters-navigation
  >
    {
      Object.keys(segments).map(name => (
        <Button
          key={`${name}`}
          to={`/inventory?segment=${name}&sort=title`}
          buttonStyle={`${segment === name ? 'primary' : 'default'}`}
          id={`segment-navigation-${name}`}
          onClick={onChange}
        >
          <FormattedMessage id={`ui-inventory.filters.${name}`} />
        </Button>
      ))
    }
  </ButtonGroup>
);

FilterNavigation.propTypes = {
  segment: PropTypes.string,
  onChange: PropTypes.func,
};

FilterNavigation.defaultProps = {
  segment: segments.instances,
};

export default FilterNavigation;
