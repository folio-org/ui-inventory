import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  ButtonGroup,
  Button,
} from '@folio/stripes/components';

import { segments } from '../../constants';

const FiltersNavigation = ({ segment }) => (
  <ButtonGroup
    fullWidth
    data-test-filters-panel
  >
    {
      Object.keys(segments).map(name => (
        <Button
          key={`${name}`}
          to={`/inventory?segment=${name}`}
          buttonStyle={`${segment === name ? 'primary' : 'default'}`}
        >
          <FormattedMessage id={`ui-inventory.filters.${name}`} />
        </Button>
      ))
    }
  </ButtonGroup>
);

FiltersNavigation.propTypes = {
  segment: PropTypes.string,
};

FiltersNavigation.defaultProps = {
  segment: segments.instances,
};

export default FiltersNavigation;
