import React from 'react';
import { screen } from '@testing-library/react';
import '../../../test/jest/__mock__';
import { renderWithIntl, translationsProperties } from '../../../test/jest/helpers';
import { Confirmation } from './Confirmation';

describe('Confirmation component', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });
  it('render confirmation modal', () => {
    const props = { count : 1 };
    renderWithIntl(<Confirmation {...props} />, translationsProperties);
    expect(screen.getByText('ConfirmationModal')).toBeInTheDocument();
    expect(screen.getByText('Confirm move')).toBeInTheDocument();
    expect(screen.getByText(/Are you sure you want to remove this item from remote storage/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'confirm' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'cancel' })).toBeInTheDocument();
  });
});
