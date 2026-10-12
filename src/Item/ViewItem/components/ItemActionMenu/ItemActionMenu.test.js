import { MemoryRouter } from 'react-router-dom';

import {
  act,
  screen,
  fireEvent,
} from '@folio/jest-config-stripes/testing-library/react';
import { runAxeTest } from '@folio/stripes-testing';

import '../../../../../test/jest/__mock__';
import {
  renderWithIntl,
  translationsProperties,
} from '../../../../../test/jest/helpers';

import ItemActionMenu from './ItemActionMenu';

import useItemPermissions from '../../../hooks/useItemPermissions';
import useItemStatusChecks from '../../../hooks/useItemStatusChecks';
import useItemActions from '../../../hooks/useItemActions';

jest.mock('../../../hooks/useItemPermissions', () => jest.fn());
jest.mock('../../../hooks/useItemStatusChecks', () => jest.fn());
jest.mock('../../../hooks/useItemActions', () => jest.fn());

const mockItem = {
  id: 'itemId',
  status: { name: 'Available' },
};

const defaultProps = {
  item: mockItem,
  onToggle: jest.fn(),
  onUpdateOwnership: jest.fn(),
  request: {},
  tenants: [{ tenantId: 'tenantId' }],
  isSharedInstance: false,
  initialTenantId: 'tenantId',
};

const mockItemActions = {
  handleEdit: jest.fn(),
  handleCopy: jest.fn(),
  handleDelete: jest.fn(),
  handleMarcAsMissing: jest.fn(),
  handleMarkAsWithdrawn: jest.fn(),
  handleMarkWithStatus: jest.fn(),
};

const mockItemPermissions = {
  canEdit: true,
  canCreate: true,
  canUpdateOwnership: true,
  canMarkAsMissing: true,
  canMarkAsWithdrawn: true,
  canDelete: true,
};

const mockStatusChecks = {
  canMarkItemAsMissing: true,
  canMarkItemAsWithdrawn: true,
  canMarkItemWithStatus: true,
  canCreateNewRequest: true,
};

const renderItemActionMenu = (props = {}) => {
  const component = (
    <MemoryRouter>
      <ItemActionMenu
        {...defaultProps}
        {...props}
      />
    </MemoryRouter>
  );

  return renderWithIntl(component, translationsProperties);
};

describe('ItemActionMenu', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    useItemActions.mockReturnValue(mockItemActions);
    useItemPermissions.mockReturnValue(mockItemPermissions);
    useItemStatusChecks.mockReturnValue(mockStatusChecks);
  });

  it('should be rendered with no axe errors', async () => {
    const { container } = await act(async () => renderItemActionMenu());
    await runAxeTest({ rootNode: container });
  });

  it('should render edit button when user has edit permission', () => {
    renderItemActionMenu();
    expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument();
  });

  it('should not render edit button when user lacks edit permission', () => {
    useItemPermissions.mockReturnValue({
      ...mockItemPermissions,
      canEdit: false,
    });
    renderItemActionMenu();
    expect(screen.queryByRole('button', { name: /edit/i })).not.toBeInTheDocument();
  });

  it('should call handleEdit and onToggle when edit button is clicked', () => {
    renderItemActionMenu();
    fireEvent.click(screen.getByRole('button', { name: /edit/i }));
    expect(mockItemActions.handleEdit).toHaveBeenCalled();
    expect(defaultProps.onToggle).toHaveBeenCalled();
  });

  it('should render copy button when user has create permission', () => {
    renderItemActionMenu();
    expect(screen.getByRole('button', { name: /duplicate/i })).toBeInTheDocument();
  });

  it('should call handleCopy and onToggle when copy button is clicked', () => {
    renderItemActionMenu();
    fireEvent.click(screen.getByRole('button', { name: /duplicate/i }));
    expect(mockItemActions.handleCopy).toHaveBeenCalled();
    expect(defaultProps.onToggle).toHaveBeenCalled();
  });

  it('should render delete button when user has delete permission', () => {
    renderItemActionMenu();
    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
  });

  it('should call handleDelete with item and request when delete button is clicked', () => {
    renderItemActionMenu();
    fireEvent.click(screen.getByRole('button', { name: /delete/i }));
    expect(mockItemActions.handleDelete).toHaveBeenCalledWith(mockItem, defaultProps.request);
    expect(defaultProps.onToggle).toHaveBeenCalled();
  });

  it('should render new request button when user has create permission and proper item status set', () => {
    renderItemActionMenu();
    expect(screen.getByRole('button', { name: /new request/i })).toBeInTheDocument();
  });

  it('should not render new request button when user does not have create permission and proper item status set', () => {
    useItemStatusChecks.mockReturnValue({
      ...mockStatusChecks,
      canCreateNewRequest: false,
    });
    renderItemActionMenu();
    expect(screen.queryByRole('button', { name: /new request/i })).not.toBeInTheDocument();
  });

  it('should render "Mark as" section', () => {
    renderItemActionMenu();
    expect(screen.getByRole('heading', { name: /mark as/i })).toBeInTheDocument();
  });

  it('should render mark as missing button when permissions allow', () => {
    renderItemActionMenu();
    expect(screen.getByRole('button', { name: 'Missing' })).toBeInTheDocument();
  });

  it('should call handleMarcAsMissing when mark as missing button is clicked', () => {
    renderItemActionMenu();
    fireEvent.click(screen.getByRole('button', { name: 'Missing' }));
    expect(mockItemActions.handleMarcAsMissing).toHaveBeenCalled();
    expect(defaultProps.onToggle).toHaveBeenCalled();
  });

  it('should render mark as withdrawn button when permissions allow', () => {
    renderItemActionMenu();
    expect(screen.getByRole('button', { name: /withdrawn/i })).toBeInTheDocument();
  });

  it('should call handleMarkAsWithdrawn when mark as withdrawn button is clicked', () => {
    renderItemActionMenu();
    fireEvent.click(screen.getByRole('button', { name: /withdrawn/i }));
    expect(mockItemActions.handleMarkAsWithdrawn).toHaveBeenCalled();
    expect(defaultProps.onToggle).toHaveBeenCalled();
  });

  it('should not render mark as section when all marking permissions are false', () => {
    useItemStatusChecks.mockReturnValue({
      ...mockStatusChecks,
      canMarkItemAsMissing: false,
      canMarkItemAsWithdrawn: false,
      canMarkItemWithStatus: false,
    });
    renderItemActionMenu();
    expect(screen.queryByRole('heading', { name: /mark as/i })).not.toBeInTheDocument();
  });
});
