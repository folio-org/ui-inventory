import { screen, fireEvent } from '@folio/jest-config-stripes/testing-library/react';

import '../../../../test/jest/__mock__';

import { renderWithIntl, translationsProperties } from '../../../../test/jest/helpers';

import ViewInstancePane from './ViewInstancePane';
import { getIsVersionHistoryEnabled } from '../../../utils';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn().mockReturnValue({ state: {} }),
  useParams: () => ({ id: 'instanceId' }),
}));
jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  useStripes: jest.fn().mockReturnValue({ hasInterface: () => false }),
}));
jest.mock('../../hooks', () => ({
  useSharedInstancesQuery: jest.fn().mockReturnValue({ sharedInstances: [] }),
}));
jest.mock('../../../hooks', () => ({
  useAuditSettings: jest.fn().mockReturnValue({ settings: {} }),
}));
jest.mock('../../../utils', () => ({
  getDate: jest.fn(() => '01/01/2023'),
  getIsVersionHistoryEnabled: jest.fn(() => false),
  isInstanceShadowCopy: jest.fn(() => false),
  isUserInConsortiumMode: jest.fn(() => false),
}));
jest.mock('../utils', () => ({
  getPublishingInfo: jest.fn(() => ' • Publisher • 2023'),
}));

// Mock child components to focus on ViewInstancePane logic
jest.mock('../InstanceDetailsContent', () => jest.fn(() => <div>InstanceDetailsContent</div>));
jest.mock('../components/InstanceLoadingPane', () => jest.fn(({ onClose }) => (
  <div>InstanceLoadingPane
    <button type="button" onClick={onClose}>Close</button>
  </div>
)));
jest.mock('../components/InstanceWarningPane', () => jest.fn(({ onClose, messageBannerText }) => (
  <div>InstanceWarningPane
    <div>{messageBannerText}</div>
    <button type="button" onClick={onClose}>Close</button>
  </div>
)));
jest.mock('../InstanceVersionHistory', () => jest.fn(() => <div>InstanceVersionHistory</div>));
jest.mock('../../../components', () => ({
  ...jest.requireActual('../../../components'),
  HelperApp: jest.fn(() => <div>HelperApp</div>),
}));
jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  VersionHistoryButton: jest.fn(() => <button type="button">VersionHistoryButton</button>),
}));

const defaultProps = {
  instance: {
    id: 'instance-id',
    title: 'Test Instance',
    hrid: 'hrid-1',
    source: 'FOLIO',
    tags: { tagList: ['tag1', 'tag2'] },
    metadata: { updatedDate: '2023-01-01T00:00:00.000Z' },
  },
  isShared: false,
  tenantId: 'tenant-id',
  mutateInstance: jest.fn(),
  isLoading: false,
  isError: false,
  error: null,
  isCentralTenantPermissionsLoading: false,
  tagsEnabled: false,
  userTenantPermissions: [],
  onClose: jest.fn(),
  actionMenu: jest.fn(() => <div>ActionMenu</div>),
  isInstanceSharing: false,
  holdingsSection: <div>HoldingsSection</div>,
};

const renderViewInstancePane = (props) => {
  return renderWithIntl(<ViewInstancePane {...defaultProps} {...props} />, translationsProperties);
};

describe('ViewInstancePane', () => {
  it('renders the details content', () => {
    renderViewInstancePane();

    expect(screen.getByText('InstanceDetailsContent')).toBeInTheDocument();
    expect(screen.getByText('ActionMenu')).toBeInTheDocument();
  });

  it('renders loading pane when isLoading is true', () => {
    renderViewInstancePane({ isLoading: true });

    expect(screen.getByText('InstanceLoadingPane')).toBeInTheDocument();
  });

  it('renders loading pane when instance is missing', () => {
    renderViewInstancePane({ instance: null });

    expect(screen.getByText('InstanceLoadingPane')).toBeInTheDocument();
  });

  it('renders loading pane when isCentralTenantPermissionsLoading is true', () => {
    renderViewInstancePane({ isCentralTenantPermissionsLoading: true });

    expect(screen.getByText('InstanceLoadingPane')).toBeInTheDocument();
  });

  it('renders warning pane when isInstanceSharing is true', () => {
    renderViewInstancePane({ isInstanceSharing: true });

    expect(screen.getByText('InstanceWarningPane')).toBeInTheDocument();
  });

  it('renders warning pane when user lacks permission to view shared instance', () => {
    const error = { response: { status: 403 } };
    renderViewInstancePane({
      isError: true,
      isShared: true,
      error,
    });

    expect(screen.getByText('InstanceWarningPane')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked in loading pane', () => {
    const onClose = jest.fn();
    renderViewInstancePane({ isLoading: true, onClose });

    fireEvent.click(screen.getByText('Close'));
    expect(onClose).toHaveBeenCalled();
  });

  it('calls onClose when close button is clicked in warning pane', () => {
    const onClose = jest.fn();
    renderViewInstancePane({ isInstanceSharing: true, onClose });

    fireEvent.click(screen.getByText('Close'));
    expect(onClose).toHaveBeenCalled();
  });

  it('shows VersionHistoryButton if version history is enabled', () => {
    getIsVersionHistoryEnabled.mockReturnValue(true);
    renderViewInstancePane();

    expect(screen.getByText('VersionHistoryButton')).toBeInTheDocument();
  });

  describe('when overlaying is in progress', () => {
    it('should show waiting screen', () => {
      renderViewInstancePane({ isRecordImporting: true });

      expect(
        screen.getByText(
          'Importing this instance will take a few moments. A success message and updated details will be displayed upon completion.'
        )
      ).toBeInTheDocument();
    });
  });
});
