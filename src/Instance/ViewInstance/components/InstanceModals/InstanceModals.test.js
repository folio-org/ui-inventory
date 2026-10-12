import { screen, fireEvent } from '@folio/jest-config-stripes/testing-library/react';

import '../../../../../test/jest/__mock__';

import { renderWithIntl, translationsProperties } from '../../../../../test/jest/helpers';

import InstanceModals from './InstanceModals';
import { useInstanceModalsContext } from '../../../hooks';

jest.mock('../../../../components/ImportRecordModal', () => jest.fn(({ isOpen, handleSubmit, handleCancel }) => (isOpen ? (
  <div data-testid="import-record-modal">
    <button type="button" onClick={handleSubmit}>Submit Import</button>
    <button type="button" onClick={handleCancel}>Cancel Import</button>
  </div>
) : null)));

jest.mock('../../../../components/NewOrderModal', () => jest.fn(({ open, onCancel }) => (open ? (
  <div data-testid="new-order-modal">
    <button type="button" onClick={onCancel}>Cancel New Order</button>
  </div>
) : null)));

jest.mock('../../../../components/InstancePlugin', () => jest.fn(({ onSelect, onClose }) => (
  <div data-testid="instance-plugin">
    <button type="button" onClick={() => onSelect('selectedInstance')}>Select Instance</button>
    <button type="button" onClick={onClose}>Close Plugin</button>
  </div>
)));

jest.mock('@folio/stripes/components', () => ({
  ...jest.requireActual('@folio/stripes/components'),
  ConfirmationModal: jest.fn(({ open, onCancel, onConfirm, isConfirmButtonDisabled, ...props }) => (open ? (
    <div data-testid="confirmation-modal">
      <button type="button" onClick={onCancel}>Cancel</button>
      <button type="button" onClick={onConfirm} disabled={isConfirmButtonDisabled}>Confirm</button>
      {props.heading}
      {props.message}
      {props.confirmLabel}
    </div>
  ) : null)),
}));

jest.mock('../../../hooks', () => ({
  useInstanceModalsContext: jest.fn(),
}));

const defaultProps = {
  instance: { id: 'inst1', title: 'Test Instance' },
  canUseSingleRecordImport: true,
  linkedAuthoritiesLength: 2,
  onConfirmShareLocalInstance: jest.fn(),
  onShareLocalInstance: jest.fn(),
  onSetForDeletion: jest.fn(),
  onImportRecord: jest.fn(),
  onMoveToAnotherInstance: jest.fn(),
};

const getContext = (overrides = {}) => ({
  isFindInstancePluginOpen: false,
  isImportRecordModalOpen: false,
  isNewOrderModalOpen: false,
  isShareLocalInstanceModalOpen: false,
  isUnlinkAuthoritiesModalOpen: false,
  isSetForDeletionModalOpen: false,
  isShareButtonDisabled: false,
  setIsFindInstancePluginOpen: jest.fn(),
  setIsImportRecordModalOpen: jest.fn(),
  setIsShareLocalInstanceModalOpen: jest.fn(),
  setIsNewOrderModalOpen: jest.fn(),
  setIsUnlinkAuthoritiesModalOpen: jest.fn(),
  setIsSetForDeletionModalOpen: jest.fn(),
  setIsShareButtonDisabled: jest.fn(),
  ...overrides,
});

const renderInstanceModals = () => {
  return renderWithIntl(<InstanceModals {...defaultProps} />, translationsProperties);
};

describe('InstanceModals', () => {
  it('renders ImportRecordModal when isImportRecordModalOpen is true', () => {
    useInstanceModalsContext.mockReturnValue(getContext({ isImportRecordModalOpen: true }));
    renderInstanceModals();
    expect(screen.getByTestId('import-record-modal')).toBeInTheDocument();
  });

  it('renders NewOrderModal when isNewOrderModalOpen is true', () => {
    useInstanceModalsContext.mockReturnValue(getContext({ isNewOrderModalOpen: true }));
    renderInstanceModals();
    expect(screen.getByTestId('new-order-modal')).toBeInTheDocument();
  });

  it('renders InstancePlugin when isFindInstancePluginOpen is true', () => {
    useInstanceModalsContext.mockReturnValue(getContext({ isFindInstancePluginOpen: true }));
    renderInstanceModals();
    expect(screen.getByTestId('instance-plugin')).toBeInTheDocument();
  });

  it('renders ConfirmationModal for share local instance', () => {
    useInstanceModalsContext.mockReturnValue(getContext({ isShareLocalInstanceModalOpen: true }));
    renderInstanceModals();
    expect(screen.getAllByTestId('confirmation-modal').length).toBeGreaterThan(0);
  });

  it('calls onConfirmShareLocalInstance when confirming share local instance', () => {
    useInstanceModalsContext.mockReturnValue(getContext({ isShareLocalInstanceModalOpen: true }));
    renderInstanceModals();
    fireEvent.click(screen.getByText('Confirm'));
    expect(defaultProps.onConfirmShareLocalInstance).toHaveBeenCalled();
  });

  it('calls onShareLocalInstance when confirming unlink authorities', () => {
    useInstanceModalsContext.mockReturnValue(getContext({ isUnlinkAuthoritiesModalOpen: true }));
    renderInstanceModals();
    fireEvent.click(screen.getByText('Confirm'));
    expect(defaultProps.onShareLocalInstance).toHaveBeenCalled();
  });

  it('calls onSetForDeletion when confirming set for deletion', () => {
    useInstanceModalsContext.mockReturnValue(getContext({ isSetForDeletionModalOpen: true }));
    renderInstanceModals();
    fireEvent.click(screen.getByText('Confirm'));
    expect(defaultProps.onSetForDeletion).toHaveBeenCalled();
  });

  it('calls onImportRecord when submitting ImportRecordModal', () => {
    useInstanceModalsContext.mockReturnValue(getContext({ isImportRecordModalOpen: true }));
    renderInstanceModals();
    fireEvent.click(screen.getByText('Submit Import'));
    expect(defaultProps.onImportRecord).toHaveBeenCalled();
  });

  it('calls onMoveToAnotherInstance when selecting instance in InstancePlugin', () => {
    useInstanceModalsContext.mockReturnValue(getContext({ isFindInstancePluginOpen: true }));
    renderInstanceModals();
    fireEvent.click(screen.getByText('Select Instance'));
    expect(defaultProps.onMoveToAnotherInstance).toHaveBeenCalledWith('selectedInstance');
  });
});
