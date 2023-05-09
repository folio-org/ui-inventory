import React from 'react';
import { screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { DataContext } from '../../contexts';
import '../../../test/jest/__mock__';
import { renderWithIntl, translationsProperties } from '../../../test/jest/helpers';
import InstanceMovement from './InstanceMovement';

jest.mock('../MoveHoldingContext', () => ({
  ...jest.requireActual('../MoveHoldingContext'),
  MoveHoldingContext: () => <div>MoveHoldingContext</div>
}));

const queryClient = new QueryClient();
const defaultProps = {
  onClose: jest.fn(),
  moveHoldings: jest.fn(),
};

const renderInstanceMovement = (props) => renderWithIntl(
  <QueryClientProvider client={queryClient}>
    <DataContext.Provider value={{ locationsById: {} }}>
      <InstanceMovement {...props} />
    </DataContext.Provider>
  </QueryClientProvider>,
  translationsProperties
);
describe('InstanceMovement', () => {
  it('Component should render correctly', () => {
    renderInstanceMovement(defaultProps);
    expect(screen.getByText('MoveHoldingContext')).toBeInTheDocument();
  });
});
