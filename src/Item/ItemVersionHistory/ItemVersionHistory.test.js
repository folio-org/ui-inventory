import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';
import { screen } from '@folio/jest-config-stripes/testing-library/react';

import {
  renderWithIntl,
  translationsProperties,
} from '../../../test/jest/helpers';

import { DataContext } from '../../contexts';
import ItemVersionHistory from './ItemVersionHistory';

jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  AuditLogPane: () => <div>Version history</div>,
}));

jest.mock('../../utils', () => ({
  getDateWithTime: jest.fn(date => `Formatted Date: ${date}`),
}));

jest.mock('../../hooks', () => ({
  ...jest.requireActual('../../hooks'),
  useItemAuditDataQuery: jest.fn().mockReturnValue({ data: [{}], isLoading: false }),
}));

const queryClient = new QueryClient();

const onCloseMock = jest.fn();
const itemId = 'itemId';

const renderItemVersionHistory = () => {
  const component = (
    <QueryClientProvider client={queryClient}>
      <DataContext.Provider value={{}}>
        <ItemVersionHistory
          itemId={itemId}
          onClose={onCloseMock}
          circulationHistory={{}}
        />
      </DataContext.Provider>
    </QueryClientProvider>
  );

  return renderWithIntl(component, translationsProperties);
};

describe('ItemVersionHistory', () => {
  it('should render View history pane', () => {
    renderItemVersionHistory();

    expect(screen.getByText('Version history')).toBeInTheDocument();
  });
});
