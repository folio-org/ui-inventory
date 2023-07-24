import '../../../test/jest/__mock__';

import { MemoryRouter } from 'react-router-dom';
import { screen } from '@testing-library/react';

import {
  renderWithIntl,
  translationsProperties,
} from '../../../test/jest/helpers';

import BrowseRoute from './BrowseRoute';

jest.mock('../../components', () => ({
  ...jest.requireActual('../../components'),
  BrowseInventoryFilters: jest.fn(() => <>BrowseInventoryFilters</>),
  BrowseResultsPane: jest.fn(() => <>BrowseResultsPane</>),
  SearchModeNavigation: jest.fn(() => <>SearchModeNavigation</>),
}));
jest.mock('../../hooks', () => ({
  ...jest.requireActual('../../hooks'),
  useLastSearchTerms: jest.fn().mockReturnValue({
    getLastSearch: jest.fn(),
    getLastBrowseOffset: jest.fn(),
    storeLastBrowse: jest.fn(),
    storeLastBrowseOffset: jest.fn(),
  }),
  useInventoryBrowse: jest.fn(() => ({}))
}));

const renderBrowseRoute = (props = {}) => renderWithIntl(
  <MemoryRouter>
    <BrowseRoute
      {...props}
    />
  </MemoryRouter>,
  translationsProperties,
);

describe('BrowseRoute', () => {
  it('should render page for inventory browsing', () => {
    renderBrowseRoute();

    expect(screen.getByText(/BrowseInventoryFilters/)).toBeInTheDocument();
    expect(screen.getByText(/BrowseResultsPane/)).toBeInTheDocument();
    expect(screen.getByText(/SearchModeNavigation/)).toBeInTheDocument();
  });
});
