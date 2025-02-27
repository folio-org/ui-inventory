import '../../test/jest/__mock__';

import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

import CreateItemRoute from './CreateItemRoute';

jest.mock('@folio/service-interaction', () => ({
  NumberGeneratorModalButton: () => <div>NumberGeneratorModalButton</div>
}));

jest.mock('../Item', () => ({
  ...jest.requireActual('../Item'),
  CreateItem: jest.fn().mockReturnValue('CreateItem')
}));

const wrapper = ({ children }) => (
  <MemoryRouter>
    {children}
  </MemoryRouter>
);

const renderCreateItemRoute = (props = {}) => render(
  <CreateItemRoute
    {...props}
  />,
  { wrapper },
);

describe('CreateItemRoute', () => {
  it('should render CreateItem component', () => {
    renderCreateItemRoute();

    expect(screen.getByText('CreateItem')).toBeInTheDocument();
  });
});
