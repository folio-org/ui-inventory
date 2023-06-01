import '../../test/jest/__mock__';

import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

import EditItemRoute from './EditItemRoute';

jest.mock('../Item', () => ({
  ...jest.requireActual('../Item'),
  EditItem: jest.fn().mockReturnValue('EditItem')
}));

const wrapper = ({ children }) => (
  <MemoryRouter>
    {children}
  </MemoryRouter>
);

const renderEditItemRoute = (props = {}) => render(
  <EditItemRoute
    {...props}
  />,
  { wrapper },
);

describe('EditItemRoute', () => {
  it('should render EditItem component', () => {
    renderEditItemRoute();

    expect(screen.getByText('EditItem')).toBeInTheDocument();
  });
});
