import '../../../test/jest/__mock__';

import { MemoryRouter } from 'react-router-dom';
import { screen } from '@testing-library/react';

import {
  renderWithIntl,
  translationsProperties,
} from '../../../test/jest/helpers';

import BrowseRoute from './BrowseRoute';

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

    expect(screen.getByText('Browse inventory')).toBeInTheDocument();
  });
});
