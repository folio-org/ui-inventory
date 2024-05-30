import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import queryString from 'query-string';

import {
  ButtonGroup,
  Button,
} from '@folio/stripes/components';
import { segments } from '@folio/stripes-inventory-components';

import { SORTABLE_SEARCH_RESULT_LIST_COLUMNS } from '../../constants';
import { useLastSearchTerms } from '../../hooks';

const FilterNavigation = ({ segment, onChange }) => {
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
          if (!searchParams.sort) searchParams.sort = SORTABLE_SEARCH_RESULT_LIST_COLUMNS.TITLE;

          return (
            <Button
              key={`${name}`}
              to={{
                pathname: '/inventory',
                search: queryString.stringify(searchParams),
              }}
              buttonStyle={`${segment === name ? 'primary' : 'default'}`}
              id={`segment-navigation-${name}`}
              onClick={() => onChange(name)}
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
  segment: PropTypes.string,
  onChange: PropTypes.func,
};

FilterNavigation.defaultProps = {
  segment: segments.instances,
};

export default FilterNavigation;
