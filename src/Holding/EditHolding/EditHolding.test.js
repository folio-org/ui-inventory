import '../../../test/jest/__mock__';

import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';

import { instance } from '../../../test/fixtures/instance';
import { useInstance } from '../../common/hooks';
import HoldingsForm from '../../edit/holdings/HoldingsForm';
import EditHolding from './EditHolding';

jest.mock('../../edit/holdings/HoldingsForm', () => jest.fn().mockReturnValue('HoldingsForm'));
jest.mock('../../hooks/useHoldingItemsQuery', () => (
  jest.fn().mockReturnValue({ totalRecords: 1, isLoading: false })
));
jest.mock('../../hooks/useCallout', () => jest.fn().mockReturnValue({ sendCallout: jest.fn() }));
jest.mock('../../common/hooks', () => ({
  ...jest.requireActual('../../common/hooks'),
  useInstance: jest.fn().mockReturnValue({ instance: {}, isLoading: false })
}));

const defaultProps = {
  goTo: jest.fn(),
  instanceId: instance.id,
  holdingId: 'holdingId',
  referenceTables: { holdingsSources: [{ id: 'sourceId' }] },
  resources: {
    holding: { records: [{ sourceId: 'sourceId' }] },
  },
  mutator: {
    holding: {
      PUT: jest.fn(() => Promise.resolve({ hrid: 'hrid' })),
    }
  }
};

const wrapper = ({ children }) => (
  <MemoryRouter>
    {children}
  </MemoryRouter>
);

const renderEditHolding = (props = {}) => render(
  <EditHolding
    {...defaultProps}
    {...props}
  />,
  { wrapper },
);

describe('EditHolding', () => {
  beforeEach(() => {
    useInstance.mockClear();
  });

  it('should render HoldingsForm', () => {
    renderEditHolding();

    expect(screen.getByText('HoldingsForm')).toBeInTheDocument();
  });

  it('should render LoadingView if page is loading', () => {
    useInstance.mockReturnValue({ isLoading: true });

    renderEditHolding();

    expect(screen.getByText('LoadingView')).toBeInTheDocument();
  });

  it('should call PUT when the holding form is submitted', () => {
    renderEditHolding();

    HoldingsForm.mock.calls[0][0].onSubmit({
      permanentLocationId: '',
      temporaryLocationId: '',
    });

    expect(defaultProps.mutator.holding.PUT).toHaveBeenCalled();
  });
});
