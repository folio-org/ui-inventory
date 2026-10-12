import { renderHook, act } from '@folio/jest-config-stripes/testing-library/react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import useGoBack from './useGoBack';

describe('useGoBack', () => {
  it('call history.goBack when location.state.hasPrevious is true', () => {
    const history = createMemoryHistory({
      initialEntries: [{ pathname: '/', state: { hasPrevious: true } }],
    });
    history.goBack = jest.fn();
    const { result } = renderHook(() => useGoBack('/default'), {
      wrapper: ({ children }) => (<Router history={history}>{children}</Router>),
    });
    const goBack = result.current;
    act(() => {
      goBack();
    });
    expect(history.goBack).toHaveBeenCalled();
  });
  it('call history.push with the default path when location.state.hasPrevious is false', () => {
    const history = createMemoryHistory({
      initialEntries: [{ pathname: '/', search: '?page=1' }],
    });
    history.push = jest.fn();
    const { result } = renderHook(() => useGoBack('/default'), {
      wrapper: ({ children }) => (<Router history={history}>{children}</Router>),
    });
    const goBack = result.current;
    act(() => {
      goBack();
    });
    expect(history.push).toHaveBeenCalledWith({
      pathname: '/default',
      search: '?page=1',
    });
  });
});
