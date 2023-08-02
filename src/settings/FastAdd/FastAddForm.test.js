import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import { screen } from '@folio/jest-config-stripes/testing-library/react';
import { FormattedMessage } from 'react-intl';
import '../../../test/jest/__mock__';
import {
  renderWithIntl,
  translationsProperties,
} from '../../../test/jest/helpers';
import FastAddForm from './FastAddForm';

const mockOnSubmit = jest.fn();
const mockOnCancel = jest.fn();
const handleSubmit = jest.fn();
const pristine = true;
const submitting = true;
const form = {};
const label = <FormattedMessage id="ui-inventory" />;
const FastAddFormSetup = (props = {}) => (
  <Router>
    <FastAddForm
      onSubmit={mockOnSubmit}
      onCancel={mockOnCancel}
      handleSubmit={handleSubmit}
      pristine={pristine}
      submitting={submitting}
      form={form}
      label={label}
      {...props}
    >
      <div>children</div>
    </FastAddForm>
  </Router>
);

const renderFastAddForm = (props = {}) => renderWithIntl(
  <FastAddFormSetup {...props} />,
  translationsProperties
);

describe('FastAddForm', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should render FastAddForm', () => {
    renderFastAddForm();
    expect(screen.getByText('ui-inventory')).toBeInTheDocument();
    expect(screen.getByText('children')).toBeInTheDocument();
  });
  test('Cancel button should be truthy', async () => {
    renderFastAddForm();
    userEvent.click(screen.getByText('Cancel'));
    expect(screen.getByRole('button', { name: /Cancel/i })).toBeTruthy();
  });
  test('Save button should be truthy', async () => {
    renderFastAddForm();
    const submitButton = screen.getByText(/Save/i);
    userEvent.click(submitButton);
    expect(screen.getByRole('button', { name: /Save/i })).toBeTruthy();
  });
});
