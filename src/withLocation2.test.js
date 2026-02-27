import '../test/jest/__mock__';
import { MemoryRouter } from 'react-router';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import withLocation from './withLocation';

const defaultProps = {
  location: {
    search: '?filters=test1&query=test2&sort=test3&qindex=test',
    pathname: '/testPathName'
  },
  history: {
    push: jest.fn(),
  },
  updateLocation: jest.fn(),
  goTo: jest.fn(),
  getParams: jest.fn(),
  getSearchParams: jest.fn()
};
const newParams = {
  _path: '/newTestPath'
};
const options = {};
const path = '/gotoTestPath';
const params = 'testParams';

describe('withLocation', () => {
  afterEach(() => {
    cleanup();
  });
  it('updateLocation should be called', async () => {
    const WrappedComponent = (props = defaultProps) => {
      return (
        <div>
          <button type="button" data-testid="updateLocation" onClick={() => props.updateLocation(newParams, options)}>updateLocation</button>
        </div>
      );
    };
    const Location = withLocation(WrappedComponent);
    render(<MemoryRouter><Location /></MemoryRouter>);
    userEvent.click(screen.getByRole('button', { name: 'updateLocation' }));
    

    await waitFor(() => {
      expect(userEvent.click(screen.getByRole('button', { name: 'updateLocation' }))).toBe(true);
    });



test('click', () => {
  render(
    <div>
      <label htmlFor="checkbox">Check</label>
      <input id="checkbox" type="checkbox" />
    </div>,
  )

  userEvent.click(screen.getByText('Check'))
  expect(screen.getByLabelText('Check')).toBeChecked()
})




  });
  it('goTo should be called', async () => {
    const WrappedComponent = (props = defaultProps) => {
      return (
        <div>
          <button type="button" data-testid="goTo" onClick={() => props.goTo(path, params)}>goTo</button>
        </div>
      );
    };
    const Location = withLocation(WrappedComponent);
    render(<MemoryRouter><Location /></MemoryRouter>);
    await waitFor(() => {
      expect(userEvent.click(screen.getByRole('button', { name: 'goTo' }))).toBe(true);
    });
  });
  it('getSearchParams should be called', async () => {
    const WrappedComponent = (props = defaultProps) => {
      return (
        <div>
          <button type="button" data-testid="getSearchParams" onClick={() => props.getSearchParams()}>getSearchParams</button>
        </div>
      );
    };
    const Location = withLocation(WrappedComponent);
    render(<MemoryRouter><Location /></MemoryRouter>);
    await waitFor(() => {
      expect(userEvent.click(screen.getByRole('button', { name: 'getSearchParams' }))).toBe(true);
    });
  });
});

