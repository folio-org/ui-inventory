import { act, screen } from '@folio/jest-config-stripes/testing-library/react';

import '../../../test/jest/__mock__';

import {
  renderWithIntl,
  translationsProperties,
} from '../../../test/jest/helpers';

import { ViewInstance } from './index';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn().mockReturnValue({
    state: {},
  }),
  useHistory: jest.fn(),
  useParams: jest.fn().mockReturnValue({ id: 'instance-id' }),
}));
jest.mock('../../common', () => ({
  useInstance: jest.fn().mockReturnValue({
    instance: {
      id: 'instance-id',
      title: 'Test Instance',
      hrid: 'hrid-1',
      shared: false,
      source: 'FOLIO',
      metadata: { updatedDate: '2023-01-01T00:00:00.000Z' },
    },
    isLoading: false,
    isError: false,
    error: null,
    refetch: jest.fn(),
  }),
}));
jest.mock('../../hooks', () => ({
  useMarcRecordQuery: jest.fn().mockReturnValue({ data: {} }),
  useTLRSettingsQuery: jest.fn().mockReturnValue({ data: { configs: [{ value: { titleLevelRequestsFeatureEnabled: 'true' } }] } }),
}));
jest.mock('../hooks', () => ({
  useUserTenantPermissions: jest.fn().mockReturnValue({ userPermissions: [], isFetching: false, isLoading: false }),
  useInstanceImportSupportedQuery: jest.fn().mockReturnValue({ data: true }),
  useCirculationInstanceRequestsQuery: jest.fn().mockReturnValue({ data: { requests: [], totalRecords: 0 } }),
  useInstanceModalsContext: jest.fn().mockReturnValue({
    isItemsMovement: false,
    setIsShareLocalInstanceModalOpen: jest.fn(),
    setIsUnlinkAuthoritiesModalOpen: jest.fn(),
    setIsShareButtonDisabled: jest.fn(),
    setIsSetForDeletionModalOpen: jest.fn(),
    setIsImportRecordModalOpen: jest.fn(),
  }),
  useSetRecordForDeletion: jest.fn().mockReturnValue({ setRecordForDeletion: jest.fn() }),
  useImportRecord: jest.fn().mockReturnValue({ importRecord: jest.fn() }),
  useInstanceMutation: jest.fn().mockReturnValue({ mutateInstance: jest.fn() }),
  useAuthoritiesByIdQuery: jest.fn(),
  useInstanceSharing: jest.fn().mockReturnValue({ isInstanceSharing: false, handleShareLocalInstance: jest.fn() }),
  useInstanceDetailsShortcuts: jest.fn().mockReturnValue([]),
  useSharedInstancesQuery: jest.fn().mockReturnValue({ sharedInstances: [] }),
  useAuditSettings: jest.fn().mockReturnValue({ settings: {} }),
}));
jest.mock('./components', () => ({
  ViewInstancePane: jest.fn(() => <div>ViewInstancePane</div>),
  InstanceActionMenu: jest.fn(() => <div>InstanceActionMenu</div>),
  InstanceModals: jest.fn(() => <div>InstanceModals</div>),
}));

const renderViewInstance = () => {
  return renderWithIntl(<ViewInstance />, translationsProperties);
};

describe('ViewInstance', () => {
  it('should render instance view pane', async () => {
    await act(async () => renderViewInstance());

    expect(screen.getByText('ViewInstancePane')).toBeInTheDocument();
  });

  it('should render instance modals', async () => {
    await act(async () => renderViewInstance());

    expect(screen.getByText('InstanceModals')).toBeInTheDocument();
  });
});
