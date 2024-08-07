import { fireEvent, screen } from '@folio/jest-config-stripes/testing-library/react';
import {
  MemoryRouter,
  useRouteMatch,
} from 'react-router-dom';

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

const mockPush = jest.fn();
const mockOnSearchModeSwitch = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useRouteMatch: jest.fn(),
  useHistory: () => ({
    push: mockPush,
  }),
}));

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
      search=""
      onSearchModeSwitch={mockOnSearchModeSwitch}
      {...props}
    />
  </MemoryRouter>,
  translationsProperties,
);

describe('SearchModeNavigation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useRouteMatch.mockReturnValue({ path: '/inventory/browse' });
  });

  it('should render search mode navigation buttons', () => {
    renderSearchModeNavigation();

    expect(screen.getByText('Search')).toBeInTheDocument();
    expect(screen.getByText('Browse')).toBeInTheDocument();
  });

  describe('when current segment is browse', () => {
    it('should keep browse query in url in browse button', async () => {
      renderSearchModeNavigation();

      const browseButton = await screen.findByRole('button', { name: 'Browse' });
      fireEvent.click(browseButton);

      expect(mockPush).toHaveBeenCalledWith({
        pathname: BROWSE_INVENTORY_ROUTE,
        search: initialSearch,
      });
    });

    it('should keep set search query in url in search button', async () => {
      const search = '?query=test';

      renderSearchModeNavigation({
        search,
      });

      const browseButton = await screen.findByRole('button', { name: 'Search' });
      fireEvent.click(browseButton);

      expect(mockPush).toHaveBeenCalledWith({
        pathname: INVENTORY_ROUTE,
        search,
      });
    });
  });

  describe('when current segment is search', () => {
    const pathname = `${INVENTORY_ROUTE}/view/UUID`;
    const search = '?query=test';

    beforeEach(() => {
      useRouteMatch.mockReturnValue({ path: INVENTORY_ROUTE });
      renderSearchModeNavigation({ search }, pathname);
    });

    it('should style the Search button as active', async () => {
      const searchButton = await screen.findByRole('button', { name: 'Search' });
      const browseButton = await screen.findByRole('button', { name: 'Browse' });

      expect(searchButton.className).toContain('primary');
      expect(browseButton.className).toContain('default');
    });

    it('should keep the current search query in the href for the Search button', async () => {
      const searchButton = await screen.findByRole('button', { name: 'Search' });

      fireEvent.click(searchButton);

      expect(mockPush).toHaveBeenCalledWith({
        pathname,
        search: initialSearch,
      });
    });

    it('should keep the last browse query in the href for the Browse button', async () => {
      const browseButton = await screen.findByRole('button', { name: 'Browse' });

      fireEvent.click(browseButton);

      expect(mockPush).toHaveBeenCalledWith({
        pathname: BROWSE_INVENTORY_ROUTE,
        search,
      });
    });
  });

  describe('when pressing the current lookup mode', () => {
    it('should not fire onSearchModeSwitch', () => {
      useRouteMatch.mockReturnValue({ path: INVENTORY_ROUTE });

      const { getByRole } = renderSearchModeNavigation({}, {
        initialRoute: INVENTORY_ROUTE,
      });

      fireEvent.click(getByRole('button', { name: 'Search' }));

      expect(mockOnSearchModeSwitch).not.toHaveBeenCalled();
    });
  });

  describe('when clicking another lookup mode', () => {
    it('should fire onSearchModeSwitch', () => {
      useRouteMatch.mockReturnValue({ path: INVENTORY_ROUTE });

      const { getByRole } = renderSearchModeNavigation({}, {
        initialRoute: INVENTORY_ROUTE,
      });

      fireEvent.click(getByRole('button', { name: 'Browse' }));

      expect(mockOnSearchModeSwitch).toHaveBeenCalled();
    });
  });
});
