import PropTypes from 'prop-types';
import { useCallback } from 'react';
import { FormattedMessage } from 'react-intl';
import { useRouteMatch } from 'react-router-dom';

import {
  Button,
  ButtonGroup,
} from '@folio/stripes/components';

import {
  searchModeRoutesMap,
  searchModeSegments,
} from '../../constants';

const SearchModeNavigation = ({ search }) => {
  const { path } = useRouteMatch();

  const checkIsButtonActive = useCallback((segment) => (
    path === searchModeRoutesMap[segment] ? 'primary' : 'default'
  ), [path]);

  return (
    <ButtonGroup fullWidth>
      {
        Object.keys(searchModeSegments).map(segment => (
          <Button
            key={`${segment}`}
            to={{
              pathname: searchModeRoutesMap[segment],
              search,
            }}
            buttonStyle={checkIsButtonActive(segment)}
            id={`mode-navigation-${segment}`}
          >
            <FormattedMessage id={`ui-inventory.${segment}`} />
          </Button>
        ))
      }
    </ButtonGroup>
  );
};

SearchModeNavigation.propTypes = {
  search: PropTypes.string,
};

export default SearchModeNavigation;
