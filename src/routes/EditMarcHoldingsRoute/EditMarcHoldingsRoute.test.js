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

import { EditMarcHoldingsRoute } from './EditMarcHoldingsRoute';
import { useHoldingQuery } from '../../common';

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
      <button type="button" onClick={() => onClose('instanceId/holdingId')}>Close</button>
      <button type="button" onClick={() => onSave('instanceId/holdingId')}>Save</button>
    </>
  ))
}));

jest.mock('../../common', () => ({
  useHoldingQuery: jest.fn(),
}));

const wrapper = ({ children }) => (
  <MemoryRouter initialEntries={['/edit-holdings/instanceId/holdingId']}>
    <Route
      path="/edit-holdings/:instanceId/:externalId"
      render={() => children}
    />
  </MemoryRouter>
);

const renderEditMarcHoldingsRoute = (props = {}) => render(
  <EditMarcHoldingsRoute {...props} />,
  { wrapper },
);

describe('EditMarcHoldingsRoute', () => {
  const mockPush = jest.fn();
  const mockRefetchInstance = jest.fn();

  beforeEach(() => {
    useHistory.mockClear().mockReturnValue({
      push: mockPush,
    });

    useHoldingQuery.mockClear().mockReturnValue({
      refetch: mockRefetchInstance,
    });
  });

  it('should fetch an instance', () => {
    renderEditMarcHoldingsRoute();

    expect(useHoldingQuery).toHaveBeenCalledWith('holdingId');
  });

  it('should render Pluggable component', () => {
    renderEditMarcHoldingsRoute();

    expect(screen.getByText('Pluggable')).toBeInTheDocument();
  });

  describe('when handling save', () => {
    it('should redirect to instance record', () => {
      renderEditMarcHoldingsRoute();

      fireEvent.click(screen.getByText('Save'));
      expect(mockPush).toHaveBeenCalledWith({
        pathname: '/inventory/view/instanceId/holdingId',
        search: '',
        state: { isClosingFocused: true },
      });
    });
  });

  describe('when handling close', () => {
    it('should redirect to instance record', () => {
      renderEditMarcHoldingsRoute();

      fireEvent.click(screen.getByText('Close'));
      expect(mockPush).toHaveBeenCalledWith({
        pathname: '/inventory/view/instanceId/holdingId',
        search: '',
        state: { isClosingFocused: true },
      });
    });
  });
});
