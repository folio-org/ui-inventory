import '../../test/jest/__mock__';

import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';

import DuplicateHoldingRoute from './DuplicateHoldingRoute';

jest.mock('../Holding', () => ({
  ...jest.requireActual('../Holding'),
  DuplicateHolding: jest.fn().mockReturnValue('DuplicateHolding')
}));

const wrapper = ({ children }) => (
  <MemoryRouter>
    {children}
  </MemoryRouter>
);

const renderDuplicateHoldingRoute = (props = {}) => render(
  <DuplicateHoldingRoute
    {...props}
  />,
  { wrapper },
);

describe('DuplicateHoldingRoute', () => {
  it('should render DuplicateHolding component', () => {
    renderDuplicateHoldingRoute();

    expect(screen.getByText('DuplicateHolding')).toBeInTheDocument();
  });
});
