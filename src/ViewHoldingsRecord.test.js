import '../test/jest/__mock__';

import { QueryClient, QueryClientProvider } from 'react-query';
import { MemoryRouter } from 'react-router-dom';
import user from '@testing-library/user-event';
import { screen, waitFor } from '@testing-library/react';

import { renderWithIntl, translationsProperties } from '../test/jest/helpers';
import ViewHoldingsRecord from './ViewHoldingsRecord';

jest.mock('./withLocation', () => jest.fn(c => c));
jest.mock('@folio/stripes/components', () => ({
  ...jest.requireActual('@folio/stripes/components'),
  LoadingView: () => 'LoadingView',
}));
jest.mock('./Holding/ViewHolding/HoldingAquisitions/useHoldingOrderLines', () => {
  return () => ({ isLoading: false, holdingOrderLines: [] });
});

const defaultProps = {
  id: 'id',
  goTo: jest.fn(),
  holdingsrecordid: 'holdingId',
  referenceTables: {
    holdingsSources: [{ id: 'sourceId' }],
    locationsById: {
      inactiveLocation: { name: 'Location 1', isActive: false },
    },
  },
  resources: {
    holdingsRecords: {
      records: [
        { sourceId: 'sourceId', temporaryLocationId: 'inactiveLocation' }
      ],
    },
    instances1: { records: [{ id: 'instanceId' }], hasLoaded: true },
    permanentLocation: { hasLoaded: true },
    temporaryLocation: { hasLoaded: true },
    boundWithParts: { records: [{ itemId: '9e8dc8ce-68f3-4e75-8479-d548ce521157' }], hasLoaded: true },
  },
  mutator: {
    instances1: {
      GET: jest.fn(() => Promise.resolve({ id: 'instanceId' })),
      reset: jest.fn(() => Promise.resolve()),
    },
    holdingsRecords: {
      GET: jest.fn(() => Promise.resolve({ hrid: 'hrid' })),
      POST: jest.fn(() => Promise.resolve()),
      PUT: jest.fn(() => Promise.resolve()),
      DELETE: jest.fn(() => Promise.resolve()),
      reset: jest.fn(() => Promise.resolve()),
    },
    marcRecord: {
      GET: jest.fn(() => Promise.resolve({ id: 'marcRecordId' })),
      DELETE: jest.fn(() => Promise.resolve()),
    },
    marcRecordId: {
      replace: jest.fn(),
    },
    permanentLocationQuery: {},
    temporaryLocationQuery: {},
    query: {},
  },
  history: {
    push: jest.fn(),
  },
  location: {
    search: '/',
  },
};

const queryClient = new QueryClient();

const renderViewHoldingsRecord = (props = {}) => renderWithIntl(
  <QueryClientProvider client={queryClient}>
    <MemoryRouter>
      <ViewHoldingsRecord
        {...defaultProps}
        {...props}
      />,
    </MemoryRouter>
  </QueryClientProvider>,
  translationsProperties
);

describe('ViewHoldingsRecord actions', () => {
  beforeEach(() => {
    defaultProps.history.push.mockClear();
  });

  it('should render Loading when awaiting resource', () => {
    const { getByText } = renderViewHoldingsRecord({ referenceTables: {} });

    expect(getByText('LoadingView')).toBeDefined();
  });

  it('should close view holding page', async () => {
    renderViewHoldingsRecord();

    await waitFor(() => {
      const closeBtn = screen.getAllByRole('button')[0];

      user.click(closeBtn);

      expect(defaultProps.history.push).toHaveBeenCalled();
    });
  });

  it('should translate to edit holding form page', async () => {
    renderViewHoldingsRecord();

    const editHoldingBtn = await screen.findByTestId('edit-holding-btn');

    user.click(editHoldingBtn);

    expect(defaultProps.history.push).toHaveBeenCalled();
  });

  it('should translate to duplicate holding form page', async () => {
    renderViewHoldingsRecord();

    const duplicatHoldingBtn = await screen.findByTestId('duplicate-holding-btn');

    user.click(duplicatHoldingBtn);

    expect(defaultProps.history.push).toHaveBeenCalled();
  });

  it('should display "inactive" by an inactive temporary location', async () => {
    renderViewHoldingsRecord();

    await waitFor(() => {
      const tempLocation = document.querySelector('*[data-test-id=temporary-location]').innerHTML;
      expect(tempLocation).toContain('Inactive');
    });
  });
});
