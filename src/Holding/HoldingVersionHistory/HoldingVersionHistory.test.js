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
import HoldingVersionHistory from './HoldingVersionHistory';

jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  AuditLogPane: () => <div>Version history</div>,
}));

jest.mock('../../hooks', () => ({
  ...jest.requireActual('../../hooks'),
  useHoldingAuditDataQuery: jest.fn().mockReturnValue({ data: [{}], isLoading: false }),
}));

const queryClient = new QueryClient();

const onCloseMock = jest.fn();
const holdingId = 'holdingId';
const mockReferenceData = {
  holdingsTypes: [],
  statisticalCodes: [],
  callNumberTypes: [],
  locationsById: {},
  illPolicies: [],
  holdingsNoteTypes: [],
  electronicAccessRelationships: [],
};

const renderHoldingVersionHistory = () => {
  const component = (
    <QueryClientProvider client={queryClient}>
      <DataContext.Provider value={mockReferenceData}>
        <HoldingVersionHistory
          holdingId={holdingId}
          onClose={onCloseMock}
        />
      </DataContext.Provider>
    </QueryClientProvider>
  );

  return renderWithIntl(component, translationsProperties);
};

describe('HoldingVersionHistory', () => {
  it('should render View history pane', () => {
    renderHoldingVersionHistory();

    expect(screen.getByText('Version history')).toBeInTheDocument();
  });
});
