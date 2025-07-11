import { BrowserRouter as Router } from 'react-router-dom';

import { screen, fireEvent } from '@folio/jest-config-stripes/testing-library/react';

import '../../../../../test/jest/__mock__';

import { renderWithIntl, translationsProperties } from '../../../../../test/jest/helpers';

import InstanceActionMenu from './InstanceActionMenu';
import {
  useInstanceActions,
  useInstanceModalsContext,
  useInstancePermissions,
} from '../../../hooks';
import useReferenceData from '../../../../hooks/useReferenceData';

jest.mock('../../../hooks', () => ({
  ...jest.requireActual('../../../hooks'),
  useInstancePermissions: jest.fn(),
  useInstanceActions: jest.fn(),
  useInstanceModalsContext: jest.fn(),
}));
jest.mock('../../../../hooks/useReferenceData', () => jest.fn());

const defaultInstance = { id: 'inst1', title: 'Test Instance', source: 'FOLIO', identifiers: [] };
const defaultReferenceData = { identifierTypesById: {} };
const defaultModalsContext = { isItemsMovement: false, isCopyrightModalOpen: false, setIsCopyrightModalOpen: jest.fn() };
const defaultActions = {
  handleEdit: jest.fn(),
  handleViewSource: jest.fn(),
  handleItemsMovement: jest.fn(),
  handleMoveItemsToAnotherInstance: jest.fn(),
  handleOverlaySourceBib: jest.fn(),
  handleCopy: jest.fn(),
  handleShareLocalInstance: jest.fn(),
  handleQuickExport: jest.fn(),
  handleSetRecordForDeletion: jest.fn(),
  handleCreateNewOrder: jest.fn(),
  handleViewRequests: jest.fn(),
  handleEditInstanceMarc: jest.fn(),
  handleDuplicateInstanceMarc: jest.fn(),
  handleCreateHoldingsMarc: jest.fn(),
  handleEditInLinkedDataEditor: jest.fn(),
};
const defaultPermissions = {
  showInventoryMenuSection: true,
  showQuickMarcMenuSection: true,
  canEditInstance: true,
  canViewSource: true,
  canMoveItems: true,
  canMoveHoldingsItemsToAnotherInstance: true,
  canCreateInstance: true,
  canShareLocalInstance: true,
  canExportMarc: true,
  canSetForDeletion: true,
  canCreateOrder: true,
  canCreateNewRequest: true,
  canEditMARCRecord: true,
  canDeriveMARCRecord: true,
  canAddMARCHoldingsRecord: true,
  canCreateMARCHoldings: true,
  hasReorderPermissions: true,
  showLinkedDataMenuSection: true,
};

const onToggle = jest.fn();

const renderInstanceActionMenu = (props) => {
  const callout = {};

  return renderWithIntl(
    <Router>
      <InstanceActionMenu
        onToggle={onToggle}
        instance={defaultInstance}
        callout={callout}
        centralTenantPermissions={[]}
        requests={[]}
        numberOfRequests={0}
        canUseSingleRecordImport
        {...props}
      />
    </Router>, translationsProperties,
  );
};

describe('InstanceActionMenu', () => {
  beforeEach(() => {
    useInstancePermissions.mockReturnValue(defaultPermissions);
    useInstanceActions.mockReturnValue(defaultActions);
    useInstanceModalsContext.mockReturnValue(defaultModalsContext);
    useReferenceData.mockReturnValue(defaultReferenceData);
  });

  it('renders the inventory menu section when showInventoryMenuSection is true', () => {
    renderInstanceActionMenu();

    expect(screen.getByText('Inventory')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /edit instance/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /view source/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /move items within an instance/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /move holdings\/items to another instance/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /overlay source bib/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /duplicate instance/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /share local instance/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /export instance \(marc\)/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /set record for deletion/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /new order/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /view requests/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /new request/i })).toBeInTheDocument();
  });

  it('renders QuickMarc menu section if showQuickMarcMenuSection is true', () => {
    renderInstanceActionMenu();

    expect(screen.getByText('quickMARC')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /edit marc bibliographic record/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /derive new marc bibliographic record/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add marc holdings record/i })).toBeInTheDocument();
  });

  it('renders Linked Data menu section if showLinkedDataMenuSection is true', () => {
    renderInstanceActionMenu();

    expect(screen.getByText('Linked data editor')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /edit resource in linked data editor/i })).toBeInTheDocument();
  });

  it('calls onToggle and handleEdit when Edit Instance is clicked', () => {
    renderInstanceActionMenu();

    const editBtn = screen.getByRole('button', { name: /edit instance/i });
    fireEvent.click(editBtn);

    expect(onToggle).toHaveBeenCalled();
    expect(defaultActions.handleEdit).toHaveBeenCalled();
  });

  it('disables View Source button if marcRecord is not provided', () => {
    renderInstanceActionMenu({ marcRecord: undefined });
    const viewSourceBtn = screen.getByRole('button', { name: /view source/i });

    expect(viewSourceBtn).toBeDisabled();
  });
});
