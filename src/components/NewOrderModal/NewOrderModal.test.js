import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { render, screen, fireEvent, act } from '@folio/jest-config-stripes/testing-library/react';

import '../../../test/jest/__mock__';

import { translationsProperties } from '../../../test/jest/helpers';
import Harness from '../../../test/jest/helpers/Harness';
import NewOrderModal from './NewOrderModal';

const defaultProps = {
  onCancel: jest.fn(),
  onSubmit: jest.fn(),
  open: true,
  validatePONumber: jest.fn(),
};

const wrapper = ({ children }) => (
  <Router>
    <Harness translations={translationsProperties}>
      {children}
    </Harness>
  </Router>
);

const renderNewOrderModal = (props = {}) => render(
  <NewOrderModal
    {...defaultProps}
    {...props}
  />,
  { wrapper }
);

describe('NewOrderModal', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render \'New order\' modal', () => {
    renderNewOrderModal();

    expect(screen.getByText(/Create order/i)).toBeInTheDocument();
  });

  it('should call \'onCancel\' when cancel btn was clicked', () => {
    renderNewOrderModal();

    fireEvent.click(screen.getByText(/Cancel/i));

    expect(defaultProps.onCancel).toHaveBeenCalled();
  });

  it('should call \'onSubmit\' when create btn was clicked', () => {
    renderNewOrderModal();

    fireEvent.click(screen.getByText(/^Create$/i));

    expect(defaultProps.onSubmit).toHaveBeenCalled();
  });

  it('should call validate \'PONumber\' field on blur', async () => {
    renderNewOrderModal();

    const field = screen.getByLabelText(/PO number/i);

    await act(async () => field.focus());
    fireEvent.change(field, { target: { value: '123' } });
    expect(field).toHaveFocus();
    await act(async () => field.blur());
    expect(field).not.toHaveFocus();
    expect(defaultProps.validatePONumber).toHaveBeenCalled();
  });
});
