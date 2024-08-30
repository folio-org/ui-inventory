import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import queryString from 'query-string';

import {
  ButtonGroup,
  Button,
} from '@folio/stripes/components';
import {
  handleSegmentChange,
  segments,
} from '@folio/stripes-inventory-components';

import { useLastSearchTerms } from '../../hooks';

const FilterNavigation = ({
  data,
  segment,
  onChange,
}) => {
  const { getLastSearch } = useLastSearchTerms();

  return (
    <ButtonGroup
      fullWidth
      data-test-filters-navigation
    >
      {
        Object.keys(segments).map((name) => {
          const searchParams = queryString.parse(getLastSearch(name));

          searchParams.segment = name;
          if (!searchParams.sort) searchParams.sort = data.displaySettings.defaultSort;

          return (
            <Button
              key={`${name}`}
              to={{
                pathname: '/inventory',
                search: queryString.stringify(searchParams),
              }}
              buttonStyle={`${segment === name ? 'primary' : 'default'}`}
              id={`segment-navigation-${name}`}
              onClick={() => handleSegmentChange(name, segment, onChange)}
            >
              <FormattedMessage id={`ui-inventory.filters.${name}`} />
            </Button>
          );
        })
      }
    </ButtonGroup>
  );
};

FilterNavigation.propTypes = {
  data: PropTypes.object.isRequired,
  segment: PropTypes.string,
  onChange: PropTypes.func,
};

FilterNavigation.defaultProps = {
  segment: segments.instances,
};

export default FilterNavigation;
