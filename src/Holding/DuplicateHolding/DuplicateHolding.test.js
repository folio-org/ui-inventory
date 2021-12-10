import '../../../test/jest/__mock__';

import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';

import { instance } from '../../../test/fixtures/instance';
import { useInstance } from '../../common/hooks';
import HoldingsForm from '../../edit/holdings/HoldingsForm';
import DuplicateHolding from './DuplicateHolding';

jest.mock('../../edit/holdings/HoldingsForm', () => jest.fn().mockReturnValue('HoldingsForm'));
jest.mock('../../hooks/useCallout', () => jest.fn().mockReturnValue({ sendCallout: jest.fn() }));
jest.mock('../../common/hooks', () => ({
  ...jest.requireActual('../../common/hooks'),
  useInstance: jest.fn().mockReturnValue({ instance: {}, isLoading: false })
}));

const defaultProps = {
  goTo: jest.fn(),
  instanceId: instance.id,
  referenceTables: {},
  mutator: {
    holding: {
      POST: jest.fn(() => Promise.resolve({ hrid: 'hrid' })),
    }
  }
}

const wrapper = ({children}) => (
  <MemoryRouter>
    {children}
  </MemoryRouter>
)

const renderDuplicateHolding = (props = {}) => render(
  <DuplicateHolding
    {...defaultProps}
    {...props}
  />,
  { wrapper },
)

describe('DuplicateHolding', () => {
  beforeEach(() => {
    useInstance.mockClear();
  })

  it('should render HoldingsForm', () => {
    renderDuplicateHolding();

    expect(screen.getByText('HoldingsForm')).toBeInTheDocument();
  });

  it('should render LoadingView if page is loading', () => {
    useInstance.mockReturnValue({ isLoading: true });
  
    renderDuplicateHolding();

    expect(screen.getByText('LoadingView')).toBeInTheDocument();
  });

  it('should call POST when the holding form is submitted', () => {
    renderDuplicateHolding();

    HoldingsForm.mock.calls[0][0].onSubmit();

    expect(defaultProps.mutator.holding.POST).toHaveBeenCalled();
  });
});
