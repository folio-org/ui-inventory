import { screen } from '@folio/jest-config-stripes/testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import '../../../test/jest/__mock__';

import {
  renderWithIntl,
  translationsProperties,
} from '../../../test/jest/helpers';
import SearchModeNavigation from './SearchModeNavigation';
import {
  INVENTORY_ROUTE,
  BROWSE_INVENTORY_ROUTE,
} from '../../constants';

const initialSearch = '?qindex=contributors&query=test';

const renderSearchModeNavigation = (
  props = {},
  initialRoute = BROWSE_INVENTORY_ROUTE,
) => renderWithIntl(
  <MemoryRouter
    initialEntries={[{
      pathname: initialRoute,
      search: initialSearch,
    }]}
  >
    <SearchModeNavigation
      {...props}
    />
  </MemoryRouter>,
  translationsProperties,
);

describe('SearchModeNavigation', () => {
  it('should render search mode navigation buttons', () => {
    renderSearchModeNavigation();

    expect(screen.getByText('Search')).toBeInTheDocument();
    expect(screen.getByText('Browse')).toBeInTheDocument();
  });

  describe('when current segment is browse', () => {
    it('should keep browse query in url in browse button', async () => {
      renderSearchModeNavigation();

      const browseButton = await screen.findByRole('button', { name: 'Browse' });

      expect(browseButton.href.includes(`${BROWSE_INVENTORY_ROUTE}${initialSearch}`)).toBeTruthy();
    });

    it('should keep set search query in url in search button', async () => {
      const search = '?query=test';

      renderSearchModeNavigation({
        search,
      });

      const browseButton = await screen.findByRole('button', { name: 'Search' });

      expect(browseButton.href.includes(`${INVENTORY_ROUTE}${search}`)).toBeTruthy();
    });
  });
});
