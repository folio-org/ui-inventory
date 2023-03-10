import React from 'react';
import { screen } from '@testing-library/react';
import '../../../test/jest/__mock__';
import { renderWithIntl, translationsProperties } from '../../../test/jest/helpers';
import { ConfirmationModal } from './ConfirmationModal';

const defaultProps = {
  label: 'Test Label',
  open: true,
  onCancel: jest.fn(),
  onConfirm: jest.fn(),
};

const renderConfirmationModal = (props = {}) => renderWithIntl(<ConfirmationModal {...props} />, translationsProperties);

describe('ConfirmationModal', () => {
  it('should render ConfirmationModal component', () => {
    renderConfirmationModal(defaultProps);
    expect(screen.getByText('ConfirmationModal')).toBeInTheDocument();
    expect(screen.getByText('Confirm move')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'confirm' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'cancel' })).toBeInTheDocument();
  });
});
