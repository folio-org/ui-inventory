import '../../../test/jest/__mock__';

import { MemoryRouter } from 'react-router-dom';
import { screen } from '@testing-library/react';

import {
  renderWithIntl,
  translationsProperties,
} from '../../../test/jest/helpers';

import BrowseInventory from './BrowseInventory';

jest.mock('../../components', () => ({
  BrowseInventoryFilters: jest.fn(() => <>BrowseInventoryFilters</>),
  BrowseResultsPane: jest.fn(() => <>BrowseResultsPane</>),
  SearchModeNavigation: jest.fn(() => <>SearchModeNavigation</>),
}));
jest.mock('../../hooks', () => ({
  ...jest.requireActual('../../hooks'),
  useInventoryBrowse: jest.fn(() => ({}))
}));

const renderBrowseInventory = (props = {}) => renderWithIntl(
  <MemoryRouter>
    <BrowseInventory
      {...props}
    />
  </MemoryRouter>,
  translationsProperties,
);

describe('BrowseInventory', () => {
  it('should render browse filters and results panes', () => {
    renderBrowseInventory();

    expect(screen.getByText(/BrowseInventoryFilters/)).toBeInTheDocument();
    expect(screen.getByText(/BrowseResultsPane/)).toBeInTheDocument();
    expect(screen.getByText(/SearchModeNavigation/)).toBeInTheDocument();
  });
});
