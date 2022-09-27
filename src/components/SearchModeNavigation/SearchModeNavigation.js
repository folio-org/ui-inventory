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

const SearchModeNavigation = () => {
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
            to={searchModeRoutesMap[segment]}
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

export default SearchModeNavigation;
