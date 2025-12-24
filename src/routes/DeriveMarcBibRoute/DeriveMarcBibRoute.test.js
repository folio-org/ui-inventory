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

import { DeriveMarcBibRoute } from './DeriveMarcBibRoute';
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
      <button type="button" onClick={() => onCreateAndKeepEditing('id')}>Save and Keep editing</button>
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

const renderDeriveMarcBibRoute = (props = {}) => render(
  <DeriveMarcBibRoute {...props} />,
  { wrapper },
);

describe('DeriveMarcBibRoute', () => {
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
    renderDeriveMarcBibRoute();

    expect(useInstanceQuery).toHaveBeenCalledWith('id', { tenantId: '' });
  });

  it('should render Pluggable component', () => {
    renderDeriveMarcBibRoute();

    expect(screen.getByText('Pluggable')).toBeInTheDocument();
  });

  describe('when handling save and keep editing', () => {
    it('should redirect to marc bib edit route', () => {
      renderDeriveMarcBibRoute();

      fireEvent.click(screen.getByText('Save and Keep editing'));
      expect(mockPush).toHaveBeenCalledWith('/inventory/quick-marc/edit-bibliographic/id');
    });
  });

  describe('when handling save', () => {
    it('should redirect to instance record', () => {
      renderDeriveMarcBibRoute();

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
      renderDeriveMarcBibRoute();

      fireEvent.click(screen.getByText('Close'));
      expect(mockPush).toHaveBeenCalledWith({
        pathname: '/inventory/view/id',
        search: '',
        state: { isClosingFocused: true },
      });
    });
  });
});
