import '../test/jest/__mock__';
import { MemoryRouter } from 'react-router';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import withLocation from './withLocation';

const mockGoto = jest.fn();
const mockUpdateLocation = jest.fn();
const mockGetParams = jest.fn();
const mockGetSearchParams = jest.fn();
const defaultProps = {
  location: {
    search: '?filters=test1&query=test2&sort=test3&qindex=test',
    pathname: '/testPathName',
  },
  history: {
    push: jest.fn()
  },
  updateLocation: mockUpdateLocation,
  goTo: mockGoto,
  getParams: mockGetParams,
  getSearchParams: mockGetSearchParams
};
const newParams = {
  _path: '/newTestPath'
};
const options = {};
const path = '/gotoTestPath';
const params = 'testParams';
describe('withLocation', () => {
  beforeEach(() => {
    const WrappedComponent = (props = defaultProps) => {
      return (
        <div>
          WrappedComponent
          <button type="button" data-testid="updateLocation" onClick={() => props.updateLocation(newParams, options)}>updateLocation</button>
          <button type="button" data-testid="goTo" onClick={() => props.goTo(path, params)}>goTo</button>
          <button type="button" data-testid="getSearchParams" onClick={() => props.getSearchParams()}>getSearchParams</button>
        </div>
      );
    };
    const Location = withLocation(WrappedComponent, { ...defaultProps });
    render(<MemoryRouter><Location /></MemoryRouter>);
  });
  afterEach(() => {
    cleanup();
  });
  it('updateLocation should be called', async () => {
    const button = screen.getByTestId('updateLocation');
    expect(fireEvent.click(button)).toBe(true);
  });
  it('goTo should be called', () => {
    const button = screen.getByTestId('goTo');
    expect(fireEvent.click(button)).toBe(true);
  });
  it('getSearchParams should be called', () => {
    const button = screen.getByTestId('getSearchParams');
    expect(fireEvent.click(button)).toBe(true);
  });
});
