import {
  MemoryRouter,
  useHistory,
  Route,
} from 'react-router';

import {
  fireEvent,
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';

import { EditMarcBibRoute } from './EditMarcBibRoute';
import { useInstanceQuery } from '../../common';

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useHistory: jest.fn().mockReturnValue({}),
  useLocation: jest.fn().mockReturnValue({}),
}));

jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  Pluggable: jest.fn().mockImplementation(({ onClose, onSave }) => (
    <>
      Pluggable
      <button type="button" onClick={() => onClose('id')}>Close</button>
      <button type="button" onClick={() => onSave('id')}>Save</button>
    </>
  ))
}));

jest.mock('../../common', () => ({
  useInstanceQuery: jest.fn(),
}));

const wrapper = ({ children }) => (
  <MemoryRouter initialEntries={['/edit-bibliographic/id']}>
    <Route
      path="/edit-bibliographic/:externalId"
      render={() => children}
    />
  </MemoryRouter>
);

const renderEditMarcBibRoute = (props = {}) => render(
  <EditMarcBibRoute {...props} />,
  { wrapper },
);

describe('EditMarcBibRoute', () => {
  const mockPush = jest.fn();
  const mockRefetchInstance = jest.fn();

  beforeEach(() => {
    useHistory.mockClear().mockReturnValue({
      push: mockPush,
    });

    useInstanceQuery.mockClear().mockReturnValue({
      refetch: mockRefetchInstance,
    });
  });

  it('should fetch an instance', () => {
    renderEditMarcBibRoute();

    expect(useInstanceQuery).toHaveBeenCalledWith('id', { tenantId: '' });
  });

  it('should render Pluggable component', () => {
    renderEditMarcBibRoute();

    expect(screen.getByText('Pluggable')).toBeInTheDocument();
  });

  describe('when handling save', () => {
    it('should redirect to instance record', () => {
      renderEditMarcBibRoute();

      fireEvent.click(screen.getByText('Save'));
      expect(mockPush).toHaveBeenCalledWith({
        pathname: '/inventory/view/id',
        search: '',
        state: { isClosingFocused: true },
      });
    });
  });

  describe('when handling close', () => {
    it('should redirect to instance record', () => {
      renderEditMarcBibRoute();

      fireEvent.click(screen.getByText('Close'));
      expect(mockPush).toHaveBeenCalledWith({
        pathname: '/inventory/view/id',
        search: '',
        state: { isClosingFocused: true },
      });
    });
  });
});
