import { Router } from 'react-router-dom';
import { renderHook, act } from '@folio/jest-config-stripes/testing-library/react';

import '../../../test/jest/__mock__';

import { createMemoryHistory } from 'history';
import useLogout from './useLogout';
import { setItem } from '../../storage';

jest.mock('../../storage');

const mockCb = jest.fn();

jest.spyOn(window, 'removeEventListener');
jest.spyOn(window, 'addEventListener');
const history = createMemoryHistory();

const wrapper = ({ children }) => (
  <Router history={history}>
    {children}
  </Router>
);

describe('useLogout', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should register listener in session storage', () => {
    renderHook(() => useLogout(), { wrapper });
    expect(setItem).toHaveBeenNthCalledWith(1, '@folio/inventory.logout-listener-registered', true);
  });

  it('should add `beforeunload` listener', () => {
    renderHook(() => useLogout(), { wrapper });
    expect(window.addEventListener).toHaveBeenCalledWith('beforeunload', expect.any(Function));
  });

  it('should call history.listen', () => {
    jest.spyOn(history, 'listen');
    renderHook(() => useLogout(mockCb), { wrapper });
    expect(history.listen).toHaveBeenCalled();
  });

  describe('when logout', () => {
    beforeEach(async () => {
      renderHook(() => useLogout(mockCb), { wrapper });
      await act(() => { history.push('/'); });
    });

    it('should call cb', () => {
      expect(mockCb).toHaveBeenCalled();
    });

    it('should reset the flag in session storage', () => {
      expect(setItem).toHaveBeenNthCalledWith(2, '@folio/inventory.logout-listener-registered', null);
    });

    it('should remove the `beforeunload` listener', () => {
      expect(window.removeEventListener).toHaveBeenCalledWith('beforeunload', expect.any(Function));
    });
  });
});
