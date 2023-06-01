import '../../test/jest/__mock__';

import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

import EditHoldingRoute from './EditHoldingRoute';

jest.mock('../Holding', () => ({
  ...jest.requireActual('../Holding'),
  EditHolding: jest.fn().mockReturnValue('EditHolding')
}));

const wrapper = ({ children }) => (
  <MemoryRouter>
    {children}
  </MemoryRouter>
);

const renderEditHoldingRoute = (props = {}) => render(
  <EditHoldingRoute
    {...props}
  />,
  { wrapper },
);

describe('DuplicateHoldingRoute', () => {
  it('should render EditHolding component', () => {
    renderEditHoldingRoute();

    expect(screen.getByText('EditHolding')).toBeInTheDocument();
  });
});
