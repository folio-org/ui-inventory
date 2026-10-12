import {
  BrowserRouter as Router,
  useHistory,
} from 'react-router-dom';

import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import { render, screen } from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import '../../../test/jest/__mock__';

import { translationsProperties } from '../../../test/jest/helpers';
import Harness from '../../../test/jest/helpers/Harness';
import { instance } from '../../../test/fixtures/instance';
import { useInstance } from '../../common';
import NewOrderModalContainer from './NewOrderModalContainer';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: jest.fn()
}));
jest.mock('../../common', () => ({
  ...jest.requireActual('../../common'),
  useInstance: jest.fn(),
}));

global.document.createRange = jest.fn(() => new Range());

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
  const order = {
    id: 'orderId',
  };
  const kyMock = {
    get: jest.fn(() => ({
      json: () => Promise.resolve({
        purchaseOrders: [order],
      })
    }))
  };

  beforeEach(() => {
    historyMock.push.mockClear();
    useHistory
      .mockClear()
      .mockReturnValue(historyMock);
    useInstance
      .mockClear()
      .mockReturnValue({ instance });
    useOkapiKy
      .mockClear()
      .mockReturnValue(kyMock);
  });

  it('should render \'New order\' modal', () => {
    renderNewOrderModalContainer();

    expect(screen.getByText(/Create order/i)).toBeInTheDocument();
  });

  it('should navigate to \'PO\' creation form when create btn was clicked and \'PO number\' field is empty', async () => {
    renderNewOrderModalContainer();

    await userEvent.click(screen.getByText(/^Create$/));

    expect(historyMock.push).toHaveBeenCalledWith('/orders/create', expect.anything());
  });

  it('should navigate to \'PO Line\' creation form when create btn was clicked and PO is exist', async () => {
    renderNewOrderModalContainer();

    await userEvent.type(screen.getByLabelText(/PO number/i), '123');
    await userEvent.tab();

    expect(screen.queryByText('ui-inventory.newOrder.modal.PONumber.doesNotExist')).not.toBeInTheDocument();

    await userEvent.click(await screen.findByText(/^Create$/));

    expect(historyMock.push).toHaveBeenCalledWith(
      `/orders/view/${order.id}/po-line/create`,
      {
        instanceId: instance.id,
        instanceTenantId: 'diku',
      },
    );
  });
});
