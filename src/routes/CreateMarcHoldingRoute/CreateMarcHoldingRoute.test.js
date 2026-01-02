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

import { CreateMarcHoldingRoute } from './CreateMarcHoldingRoute';
import { useInstanceQuery } from '../../common';

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useHistory: jest.fn().mockReturnValue({}),
  useLocation: jest.fn().mockReturnValue({}),
}));

jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  Pluggable: jest.fn().mockImplementation(({ onCreateAndKeepEditing, onClose, onSave }) => (
    <>
      Pluggable
      <button type="button" onClick={() => onCreateAndKeepEditing('instanceId/holdingsId')}>Save and Keep editing</button>
      <button type="button" onClick={() => onClose('instanceId/holdingsId')}>Close</button>
      <button type="button" onClick={() => onSave('instanceId/holdingsId')}>Save</button>
    </>
  ))
}));

jest.mock('../../common', () => ({
  useInstanceQuery: jest.fn(),
}));

const wrapper = ({ children }) => (
  <MemoryRouter initialEntries={['/create-holdings/instanceId']}>
    <Route
      path="/create-holdings/:instanceId"
      render={() => children}
    />
  </MemoryRouter>
);

const renderCreateMarcHoldingRoute = (props = {}) => render(
  <CreateMarcHoldingRoute {...props} />,
  { wrapper },
);

describe('CreateMarcHoldingsRoute', () => {
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
    renderCreateMarcHoldingRoute();

    expect(useInstanceQuery).toHaveBeenCalledWith('instanceId', { tenantId: '' });
  });

  it('should render Pluggable component', () => {
    renderCreateMarcHoldingRoute();

    expect(screen.getByText('Pluggable')).toBeInTheDocument();
  });

  describe('when handling save and keep editing', () => {
    it('should redirect to marc bib edit route', () => {
      renderCreateMarcHoldingRoute();

      fireEvent.click(screen.getByText('Save and Keep editing'));
      expect(mockPush).toHaveBeenCalledWith('edit-holdings/instanceId/holdingsId');
    });
  });

  describe('when handling save', () => {
    it('should redirect to instance record', () => {
      renderCreateMarcHoldingRoute();

      fireEvent.click(screen.getByText('Save'));
      expect(mockPush).toHaveBeenCalledWith({
        pathname: '/inventory/view/instanceId/holdingsId',
        search: '',
        state: { isClosingFocused: true },
      });
    });
  });

  describe('when handling close', () => {
    it('should redirect to instance record', () => {
      renderCreateMarcHoldingRoute();

      fireEvent.click(screen.getByText('Close'));
      expect(mockPush).toHaveBeenCalledWith({
        pathname: '/inventory/view/instanceId/holdingsId',
        search: '',
        state: { isClosingFocused: true },
      });
    });
  });
});
