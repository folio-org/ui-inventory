import { MemoryRouter } from 'react-router-dom';
import { renderHook } from '@folio/jest-config-stripes/testing-library/react';

import { useStripes } from '@folio/stripes/core';
import { useVersionHistory } from '@folio/stripes-components';
import { useUsersBatch } from '@folio/stripes-acq-components';

import useInventoryVersionHistory, { versionsFormatter } from './useInventoryVersionHistory';
import buildStripes from '../../../test/jest/__mock__/stripesCore.mock';

const mockIntl = {
  formatMessage: jest.fn(({ id }) => id),
  formatDate: jest.fn(({ value }) => value),
};

const stripes = buildStripes();

jest.mock('react-intl', () => ({
  injectIntl: (Component) => (props) => <Component {...props} intl={mockIntl} />,
  useIntl: () => mockIntl,
}));
jest.mock('@folio/stripes-acq-components', () => ({
  formatDateTime: value => value,
  useUsersBatch: jest.fn(),
}));
jest.mock('@folio/stripes-components', () => ({
  ...jest.requireActual('@folio/stripes-components'),
  useVersionHistory: jest.fn(),
}));

describe('useInventoryVersionHistory', () => {
  beforeEach(() => {
    useUsersBatch.mockReturnValue({ users: [] });
    useVersionHistory.mockReturnValue({ versions: [], isLoadMoreVisible: true });
    useStripes.mockReturnValue(stripes);
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useInventoryVersionHistory([]), { wrapper: MemoryRouter });

    expect(result.current.actionsMap).toBeDefined();
    expect(result.current.versions).toEqual([]);
  });

  describe('versionsFormatter', () => {
    const mockUsersMap = {
      '1': { personal: { firstName: 'John', lastName: 'Doe' } },
      '2': { personal: { firstName: 'Jane', lastName: 'Smith' } },
    };

    it('should format versions correctly', () => {
      const mockData = [
        { eventDate: '2024-03-01', eventTs: 12345, userId: '1', eventId: 'evt1', diff: [], action: 'UPDATE' },
        { eventDate: '2024-03-02', eventTs: 12346, userId: '2', eventId: 'evt2', diff: [], action: 'DELETE' },
      ];

      const formatVersions = versionsFormatter(mockUsersMap, mockIntl);
      const formattedData = formatVersions(mockData);

      expect(formattedData).toHaveLength(2);
      expect(formattedData[0].userName).toBe('Doe, John');
      expect(formattedData[1].userName).toBe('Smith, Jane');
    });

    it('should handle anonymous users', () => {
      const mockData = [
        { eventDate: '2024-03-01', eventTs: 12345, userId: null, eventId: 'evt1', diff: [], action: 'UPDATE' },
      ];

      const formatVersions = versionsFormatter({}, mockIntl);
      const formattedData = formatVersions(mockData);

      expect(formattedData).toHaveLength(1);
      expect(formattedData[0].userName).toBe('ui-inventory.versionHistory.anonymousUser');
    });
  });

  it('should fetch users from central tenant', () => {
    const centralTenantId = 'central-tenant-id';
    const data = [{ userId: 'userId1' }, { userId: 'userId2' }];
    const usersId = ['userId1', 'userId2'];

    useStripes.mockReturnValue(buildStripes({
      user: {
        user: {
          consortium: {
            centralTenantId,
          },
        },
      },
    }));

    renderHook(() => useInventoryVersionHistory(data));

    expect(useUsersBatch).toHaveBeenLastCalledWith(usersId, { tenantId: centralTenantId });
  });
});
