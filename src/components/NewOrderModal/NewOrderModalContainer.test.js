import React from 'react';
import {
  BrowserRouter as Router,
  useHistory,
} from 'react-router-dom';
import { act, render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';

import '../../../test/jest/__mock__';

// eslint-disable-next-line import/order
import { useOkapiKy } from '@folio/stripes/core';

import { translationsProperties } from '../../../test/jest/helpers';
import Harness from '../../../test/jest/helpers/Harness';
import NewOrderModalContainer from './NewOrderModalContainer';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: jest.fn()
}));

const ORDER_ID = 'orderId';

const defaultProps = {
  onCancel: jest.fn(),
  open: true,
};

const wrapper = ({ children }) => (
  <Router>
    <Harness translations={translationsProperties}>
      {children}
    </Harness>
  </Router>
);

const renderNewOrderModalContainer = (props = {}) => render(
  <NewOrderModalContainer
    {...defaultProps}
    {...props}
  />,
  { wrapper }
);

describe('NewOrderModalContainer', () => {
  const historyMock = {
    push: jest.fn(),
  };
  const kyMock = {
    get: jest.fn(() => ({
      json: () => Promise.resolve({
        purchaseOrders: [{ id: 'orderId' }],
      })
    }))
  };

  beforeEach(() => {
    useHistory
      .mockClear()
      .mockReturnValue(historyMock);
    useOkapiKy
      .mockClear()
      .mockReturnValue(kyMock);
  });

  it('should render \'New order\' modal', () => {
    renderNewOrderModalContainer();

    screen.debug();

    expect(screen.getByText(/Create order/i)).toBeInTheDocument();
  });

  it('should navigate to \'PO\' creation form when create btn was clicked and \'PO number\' field is empty', async () => {
    renderNewOrderModalContainer();

    await act(async () => user.click(screen.getByText(/^Create$/)));

    expect(historyMock.push).toHaveBeenCalledWith('/orders/create', expect.anything());
  });

  it('should navigate to \'PO Line\' creation form when create btn was clicked and PO is exist', async () => {
    renderNewOrderModalContainer();

    await act(async () => user.type(screen.getByLabelText(/PO number/i), '123'));
    await act(async () => user.click(screen.getByText(/^Create$/)));

    expect(historyMock.push).toHaveBeenCalledWith(`/orders/view/${ORDER_ID}/po-line/create`, expect.anything());
  });
});
