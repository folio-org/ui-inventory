import PropTypes from 'prop-types';
import { useCallback } from 'react';
import { FormattedMessage } from 'react-intl';
import {
  useRouteMatch,
  useLocation,
} from 'react-router-dom';

import {
  Button,
  ButtonGroup,
} from '@folio/stripes/components';

import {
  searchModeRoutesMap,
  searchModeSegments,
} from '../../constants';

const SearchModeNavigation = ({ search, state }) => {
  const { path } = useRouteMatch();
  const { search: currentSearch } = useLocation();

  const checkIsButtonActive = useCallback((segment) => (
    path === searchModeRoutesMap[segment] ? 'primary' : 'default'
  ), [path]);

  return (
    <ButtonGroup fullWidth>
      {
        Object.keys(searchModeSegments).map(segment => {
          const isCurrentSegment = path === searchModeRoutesMap[segment];

          return (
            <Button
              key={`${segment}`}
              to={{
                pathname: searchModeRoutesMap[segment],
                search: isCurrentSegment ? currentSearch : search,
                state,
              }}
              buttonStyle={checkIsButtonActive(segment)}
              id={`mode-navigation-${segment}`}
            >
              <FormattedMessage id={`ui-inventory.${segment}`} />
            </Button>
          );
        })
      }
    </ButtonGroup>
  );
};

SearchModeNavigation.propTypes = {
  search: PropTypes.string,
  state: PropTypes.any,
};

export default SearchModeNavigation;
