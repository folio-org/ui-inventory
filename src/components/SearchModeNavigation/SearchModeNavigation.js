import PropTypes from 'prop-types';
import { useCallback } from 'react';
import { FormattedMessage } from 'react-intl';
import {
  useLocation,
  useHistory,
  useRouteMatch,
} from 'react-router-dom';

import {
  Button,
  ButtonGroup,
} from '@folio/stripes/components';

import { useNamespace } from '@folio/stripes/core';
import {
  searchModeRoutesMap,
  searchModeSegments,
} from '../../constants';

const SearchModeNavigation = ({ search, state, onSearchModeSwitch }) => {
  const { path } = useRouteMatch();
  const {
    search: currentSearch,
    pathname,
  } = useLocation();
  const history = useHistory();
  const [namespace] = useNamespace();

  const checkIsButtonActive = useCallback((segment) => (
    path === searchModeRoutesMap[segment] ? 'primary' : 'default'
  ), [path]);

  const onClick = useCallback((segment) => {
    const isCurrentSegment = path === searchModeRoutesMap[segment];

    if (onSearchModeSwitch && !isCurrentSegment) {
      onSearchModeSwitch();
    }

    history.push({
      pathname: isCurrentSegment ? pathname : searchModeRoutesMap[segment],
      search: isCurrentSegment ? currentSearch : search,
      state,
    });
  }, [onSearchModeSwitch, history, path, currentSearch, search, state, namespace]);

  return (
    <ButtonGroup fullWidth>
      {
        Object.keys(searchModeSegments).map(segment => (
          <Button
            key={`${segment}`}
            buttonStyle={checkIsButtonActive(segment)}
            onClick={() => onClick(segment)}
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
  state: PropTypes.any,
  onSearchModeSwitch: PropTypes.func,
};

export default SearchModeNavigation;
