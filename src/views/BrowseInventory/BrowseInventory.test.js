import '../../../test/jest/__mock__';

import { MemoryRouter } from 'react-router-dom';
import { screen } from '@testing-library/react';

import {
  renderWithIntl,
  translationsProperties,
} from '../../../test/jest/helpers';

import BrowseInventory from './BrowseInventory';

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

    expect(screen.getByText('Search & filter')).toBeInTheDocument();
    expect(screen.getByText('Browse inventory')).toBeInTheDocument();
  });
});
