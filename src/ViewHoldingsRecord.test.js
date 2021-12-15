import '../test/jest/__mock__';

import { QueryClient, QueryClientProvider } from 'react-query';
import { MemoryRouter } from 'react-router-dom';
import user from '@testing-library/user-event';
import { screen } from '@testing-library/react';

import { renderWithIntl, translationsProperties } from '../test/jest/helpers';
import ViewHoldingsRecord from './ViewHoldingsRecord';

jest.mock('./withLocation', () => jest.fn(c => c));

const defaultProps = {
  id: 'id',
  goTo: jest.fn(),
  holdingsrecordid: 'holdingId',
  referenceTables: { holdingsSources: [{ id: 'sourceId' }], locationsById: {} },
  resources: {
    holdingsRecords: { records: [{ sourceId: 'sourceId' }] },
    instances1: { records: [{ id: 'instanceId' }], hasLoaded: true },
    permanentLocation: { hasLoaded: true },
    temporaryLocation: { hasLoaded: true },
  },
  mutator: {
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

  it('should close view holding page', async () => {
    renderViewHoldingsRecord();

    const closeBtn = screen.getAllByRole('button')[0];

    user.click(closeBtn);

    expect(defaultProps.history.push).toHaveBeenCalled();
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
});
