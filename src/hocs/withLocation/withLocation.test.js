import React from 'react';
import { cleanup, render, waitFor, fireEvent } from '@folio/jest-config-stripes/testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import withLocation from './withLocation';

const mockPush = jest.fn();
const mockReplace = jest.fn();
const location = {
  pathname: '/testPathName',
  search: '?filters=test1&query=test2&sort=test3&qindex=test'
};
const history = createMemoryHistory();
history.location = location;
history.push = mockPush;
history.replace = mockReplace;
const newParams = {
  _path: '/newTestPath'
};
const options = { replace: true };
const path = '/gotoTestPath';
const params = 'testParams';
let result;
const TestComponent = (props) => {
  const { updateLocation, goTo, getParams, getSearchParams } = props;
  return (
    <div>
      <div>
        <button type="button" onClick={() => updateLocation(newParams, options)}>updateLocation</button>
      </div>
      <div>
        <button type="button" onClick={() => updateLocation(newParams)}>updateLocation_with_newParams</button>
      </div>
      <div>
        <button type="button" onClick={() => goTo(path, params)}>goTo</button>
      </div>
      <div>
        <button type="button" onClick={() => goTo(path)}>goTo_with_path</button>
      </div>
      <div>
        <button type="button" onClick={() => { result = getParams(); }}>getParams</button>
      </div>
      <div>
        <button type="button" onClick={() => { result = getSearchParams(); }}>getSearchParams</button>
      </div>
    </div>
  );
};

const WrappedComponent = withLocation(TestComponent);

describe('withLocation', () => {
  afterEach(() => {
    cleanup();
  });
  it('updateLocation with newParams and options, history.replace should be called', async () => {
    const { getByText } = render(<Router history={history}><WrappedComponent /></Router>);
    fireEvent.click(getByText('updateLocation'));
    await waitFor(() => {
      expect(mockReplace).toBeCalledWith('/newTestPath?filters=test1&qindex=test&query=test2&sort=test3');
    });
  });
  it('updateLocation with only newParams, history.push should be called', async () => {
    const { getByText } = render(<Router history={history}><WrappedComponent /></Router>);
    fireEvent.click(getByText('updateLocation_with_newParams'));
    await waitFor(() => {
      expect(mockPush).toBeCalledWith('/testPathName?filters=test1&qindex=test&query=test2&sort=test3');
    });
  });
  it('goTo funtion to be called', async () => {
    const { getByText } = render(<Router history={history}><WrappedComponent /></Router>);
    fireEvent.click(getByText('goTo'));
    await waitFor(() => {
      expect(mockPush).toBeCalledWith('/gotoTestPath?0=t&1=e&2=s&3=t&4=P&5=a&6=r&7=a&8=m&9=s');
    });
  });
  it('goTo funtion with only path to be called', async () => {
    const { getByText } = render(<Router history={history}><WrappedComponent /></Router>);
    fireEvent.click(getByText('goTo_with_path'));
    await waitFor(() => {
      expect(mockPush).toBeCalledWith('/gotoTestPath');
    });
  });
  it('getParams funtion to be called', () => {
    const { getByText } = render(<Router history={history}><WrappedComponent /></Router>);
    fireEvent.click(getByText('getParams'));
    expect(result).toMatchObject({ 'filters': 'test1', 'qindex': 'test', 'query': 'test2', 'sort': 'test3' });
  });
  it('getSearchParams funtion to be called', () => {
    const { getByText } = render(<Router history={history}><WrappedComponent /></Router>);
    fireEvent.click(getByText('getSearchParams'));
    expect(result).toBe('filters=test1&qindex=test&query=test2&sort=test3');
  });
});
