import { screen } from '@folio/jest-config-stripes/testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import '../../../test/jest/__mock__';

import {
  renderWithIntl,
  translationsProperties,
} from '../../../test/jest/helpers';
import SearchModeNavigation from './SearchModeNavigation';

const renderSearchModeNavigation = (props = {}) => renderWithIntl(
  <MemoryRouter>
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
});
