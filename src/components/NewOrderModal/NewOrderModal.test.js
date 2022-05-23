import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';

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

    user.click(screen.getByText(/Cancel/i));

    expect(defaultProps.onCancel).toHaveBeenCalled();
  });

  it('should call \'onSubmit\' when create btn was clicked', () => {
    renderNewOrderModal();

    user.click(screen.getByText(/^Create$/i));

    expect(defaultProps.onSubmit).toHaveBeenCalled();
  });

  it('should call validate \'PONumber\' field on blur', () => {
    renderNewOrderModal();

    const field = screen.getByLabelText(/PO number/i);

    user.click(field);

    expect(field).toHaveFocus();

    user.type(field, '123');
    user.tab();

    expect(field).not.toHaveFocus();
    expect(defaultProps.validatePONumber).toHaveBeenCalled();
  });
});
