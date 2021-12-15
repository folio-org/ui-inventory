import '../../test/jest/__mock__';

import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';

import DuplicateItemRoute from './DuplicateItemRoute';

jest.mock('../Item', () => ({
  ...jest.requireActual('../Item'),
  DuplicateItem: jest.fn().mockReturnValue('DuplicateItem')
}));

const wrapper = ({ children }) => (
  <MemoryRouter>
    {children}
  </MemoryRouter>
);

const renderDuplicateItemRoute = (props = {}) => render(
  <DuplicateItemRoute
    {...props}
  />,
  { wrapper },
);

describe('DuplicateItemRoute', () => {
  it('should render DuplicateItem component', () => {
    renderDuplicateItemRoute();

    expect(screen.getByText('DuplicateItem')).toBeInTheDocument();
  });
});
