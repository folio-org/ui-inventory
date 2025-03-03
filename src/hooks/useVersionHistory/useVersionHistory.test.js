import { MemoryRouter } from 'react-router-dom';
import { renderHook } from '@folio/jest-config-stripes/testing-library/react';

import { useUsersBatch } from '@folio/stripes-acq-components';

import useVersionHistory from './useVersionHistory';

jest.mock('react-intl', () => ({
  injectIntl: (Component) => (props) => <Component {...props} intl={{ formatMessage: jest.fn(({ id }) => id) }} />,
  useIntl: () => ({
    formatMessage: jest.fn(({ id }) => id),
    formatDate : jest.fn(({ value }) => value),
  }),
}));
jest.mock('@folio/stripes-acq-components', () => ({
  formatDateTime: value => value,
  useUsersBatch: jest.fn(),
}));

describe('useVersionHistory', () => {
  beforeEach(() => {
    useUsersBatch.mockReturnValue({ users: [] });
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useVersionHistory([], 10), { wrapper: MemoryRouter });

    expect(result.current.actionsMap).toBeDefined();
    expect(result.current.isLoadedMoreVisible).toBe(true);
    expect(result.current.versionsToDisplay).toEqual([]);
  });

  it('should update versions when data changes', () => {
    const mockData = [{
      userId: '0',
      eventDate: '2024-03-01',
      eventTs: 12344,
      eventId: 'evt0',
      diff: [],
      action: 'CREATE',
    }, {
      userId: '1',
      eventDate: '2024-03-01',
      eventTs: 12345,
      eventId: 'evt1',
      diff: [],
      action: 'CHANGED',
    }];

    const { result, rerender } = renderHook(({ data }) => useVersionHistory(data, 10), {
      initialProps: { data: [], totalRecords: 10 },
      wrapper: MemoryRouter,
    });

    expect(result.current.versionsToDisplay).toEqual([]);

    rerender({ data: mockData, totalRecords: 10 });

    expect(result.current.versionsToDisplay.length).toBe(1);
    expect(result.current.versionsToDisplay[0].userName).toBe('ui-inventory.versionHistory.anonymousUser'); // Mocked formatMessage
  });

  it('should update users when new users are fetched', () => {
    const mockData = [{
      userId: '1',
      eventDate: '2024-03-01',
      eventTs: 12345,
      eventId: 'evt1',
      diff: [],
      action: 'CHANGED',
    }];
    const mockUsers = [{
      id: '1',
      personal: { firstName: 'John', lastName: 'Doe' },
    }];

    useUsersBatch.mockReturnValue({ users: mockUsers });

    const { result, rerender } = renderHook(({ data }) => useVersionHistory(data, 10), {
      initialProps: { data: mockData, totalRecords: 10 },
    });

    rerender({ data: mockData, totalRecords: 10 });

    expect(result.current.versionsToDisplay[0].userName).toBe('Doe, John');
  });

  it('should determine whether more versions can be loaded', () => {
    const mockData = Array(5).fill({
      userId: '1',
      eventDate: '2024-03-01',
      eventTs: 12345,
      eventId: 'evt1',
      diff: [],
      action: 'CHANGED',
    });

    const { result, rerender } = renderHook(({ data, totalRecords }) => useVersionHistory(data, totalRecords), {
      initialProps: { data: [], totalRecords: 10 },
      wrapper: MemoryRouter,
    });

    expect(result.current.isLoadedMoreVisible).toBe(true);

    rerender({ data: mockData, totalRecords: 5 });

    expect(result.current.isLoadedMoreVisible).toBe(false);
  });
});
