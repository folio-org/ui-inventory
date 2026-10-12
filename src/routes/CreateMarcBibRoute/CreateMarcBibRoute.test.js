import {
  MemoryRouter,
  useHistory,
} from 'react-router';

import {
  fireEvent,
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';

import { CreateMarcBibRoute } from './CreateMarcBibRoute';

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useHistory: jest.fn().mockReturnValue({}),
  useLocation: jest.fn().mockReturnValue({}),
}));

jest.mock('@folio/stripes/core', () => ({
  Pluggable: jest.fn().mockImplementation(({ onCreateAndKeepEditing, onClose, onSave }) => (
    <>
      Pluggable
      <button type="button" onClick={() => onCreateAndKeepEditing('id')}>Save and Keep editing</button>
      <button type="button" onClick={() => onClose('id')}>Close</button>
      <button type="button" onClick={() => onSave('id')}>Save</button>
    </>
  ))
}));

const wrapper = ({ children }) => (
  <MemoryRouter>
    {children}
  </MemoryRouter>
);

const renderCreateMarcBibRoute = (props = {}) => render(
  <CreateMarcBibRoute {...props} />,
  { wrapper },
);

describe('CreateMarcBibRoute', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    useHistory.mockClear().mockReturnValue({
      push: mockPush,
    });
  });

  it('should render Pluggable component', () => {
    renderCreateMarcBibRoute();

    expect(screen.getByText('Pluggable')).toBeInTheDocument();
  });

  describe('when handling save and keep editing', () => {
    it('should redirect to marc bib edit route', () => {
      renderCreateMarcBibRoute();

      fireEvent.click(screen.getByText('Save and Keep editing'));
      expect(mockPush).toHaveBeenCalledWith('edit-bibliographic/id');
    });
  });

  describe('when handling save', () => {
    it('should redirect to instance record', () => {
      renderCreateMarcBibRoute();

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
      renderCreateMarcBibRoute();

      fireEvent.click(screen.getByText('Close'));
      expect(mockPush).toHaveBeenCalledWith({
        pathname: '/inventory/view/id',
        search: '',
        state: { isClosingFocused: true },
      });
    });
  });
});
