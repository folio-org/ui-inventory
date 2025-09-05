import React from 'react';
import { screen } from '@folio/jest-config-stripes/testing-library/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { DataContext } from '../../contexts';
import '../../../test/jest/__mock__';
import { renderWithIntl, translationsProperties } from '../../../test/jest/helpers';
import InstanceMovement from './InstanceMovement';

jest.mock('../../dnd/DragAndDropProvider', () => ({
  __esModule: true,
  default: () => <div>DragAndDropProvider</div>
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
    expect(screen.getByText('DragAndDropProvider')).toBeInTheDocument();
  });
});
