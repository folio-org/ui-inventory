import { MemoryRouter } from 'react-router-dom';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';
import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';

import { useInstance } from '../../common/hooks';
import HoldingsForm from '../../edit/holdings/HoldingsForm';
import CreateHolding from './CreateHolding';

jest.mock('../../hooks', () => ({
  ...jest.requireActual('../../hooks'),
  useCallout: () => ({ sendCallout: jest.fn() }),
}));

jest.mock('../../common/hooks', () => ({
  ...jest.requireActual('../../common/hooks'),
  useInstance: jest.fn().mockReturnValue({ instance: {}, isLoading: false }),
}));

jest.mock('../../edit/holdings/HoldingsForm', () => jest.fn().mockReturnValue('HoldingsForm'));

const onPostMock = jest.fn(() => Promise.resolve({ hrid: 'holdingHRID' }));

const defaultProps = {
  instanceId: 'testInstanceId',
  referenceData: { holdingsSourcesByName: { FOLIO: { id: 'testId' } } },
  mutator: { holding: { POST: onPostMock } },
  history: { push: jest.fn() },
};

const queryClient = new QueryClient();

const wrapper = ({ children }) => (
  <MemoryRouter>
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  </MemoryRouter>
);

const renderCreateHolding = (props = {}) => render(
  <CreateHolding
    {...defaultProps}
    {...props}
  />,
  { wrapper },
);

describe('CreateHolding component', () => {
  it('should render HoldingsForm', () => {
    renderCreateHolding();

    expect(screen.getByText('HoldingsForm')).toBeInTheDocument();
  });

  it('should render LoadingView if page is loading', () => {
    useInstance.mockReturnValue({ isLoading: true });

    renderCreateHolding();

    expect(screen.getByText('LoadingView')).toBeInTheDocument();
  });

  describe('when the holding form is submitted', () => {
    it('should call function to save the changes', () => {
      renderCreateHolding();

      HoldingsForm.mock.calls[0][0].onSubmit();

      expect(onPostMock).toHaveBeenCalled();
    });
  });
});
