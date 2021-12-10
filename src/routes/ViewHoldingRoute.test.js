import '../../test/jest/__mock__';

import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';

import ViewHoldingRoute from './ViewHoldingRoute';

jest.mock('../ViewHoldingsRecord', () => jest.fn().mockReturnValue('ViewHoldingsRecord'));

const wrapper = ({children}) => (
  <MemoryRouter>
    {children}
  </MemoryRouter>
)

const renderViewHoldingRoute = (props = {}) => render(
  <ViewHoldingRoute
    {...props}
  />,
  { wrapper },
)

describe('ViewHoldingRoute', () => {
  it('should render ViewHoldingsRecord component', () => {
    renderViewHoldingRoute();

    expect(screen.getByText('ViewHoldingsRecord')).toBeInTheDocument();
  });
});
